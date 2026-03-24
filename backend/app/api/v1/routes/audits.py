from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.schemas.Schema import (CourseInput, DegreeEvalResponseSchema,
SchoolSchema, CourseEquivalency, JSONExportSchema, MajorSchema)

#Loading in data
from app.repository.r2Loader import load_majors_programs, load_schools, load_course_equivalencies

router = APIRouter(prefix="/audits", tags=["audits"])

class AuditRequest(BaseModel):
    school_name: str
    major_name: str
    courses_entered: List[CourseInput]
    
@router.post("/generate", response_model=DegreeEvalResponseSchema)
def generate_audit(request: AuditRequest):
    #Generate degree audit based on input courses, major, school
    try:
        majors = load_majors_programs()
        schools = load_schools()
        equivalencies = load_course_equivalencies()
        
        #Find major requirements
        major_reqs = []
        for major in majors:
            if major["major_name"].lower() == request.major_name.lower():
                major_reqs = major.get("requirements", [])
                break
        
        #Match entered courses to equivalencies
        completed = []
        uncompleted = major_reqs.copy()
        total_required = sum(r.get("units", 3.0) for r in major_reqs)
        
        for course in request.courses_entered:
            matched = False
            for eq in equivalencies:
                if eq["cc_course_name"].lower() == course.course_name.lower():
                    completed.append(CourseEquivalency(**eq))
                    #Remove from uncompleted if matched
                    uncompleted = [r for r in uncompleted if r["sdsu_course_name"] != eq["sdsu_course_name"]]
                    matched = True
                    break
            if not matched:
                completed.append(CourseEquivalency(
                    cc_course_name=course.course_name,
                    sdsu_course_name="No Equivalent",
                    units=0.0,
                    is_transferable=False
                ))
        
        total_completed = sum(c.get("units", 0.0) for c in completed if c["is_transferable"])
        remaining = total_required - total_completed
      
        return DegreeEvalResponseSchema(
            chosen_major=request.major_name,
            chosen_school=SchoolSchema(school_name=request.school_name, available_courses=[]),
            completed_courses=completed,
            uncompleted_courses=uncompleted,
            total_units_completed=total_completed,
            total_units_remaining=remaining,
            total_units_required=total_required
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating audit: {str(e)}")

@router.post("/export", response_model=JSONExportSchema)
def export_audit(request: AuditRequest):
    #Generate and return full exportable audit JSON
    audit = generate_audit(request)
    return JSONExportSchema(
        school=SchoolSchema(school_name=request.school_name, available_courses=[]),
        major=MajorSchema(major_name=request.major_name, requirements=[]),
        degree_eval=audit,
        courses_entered=request.courses_entered
    )