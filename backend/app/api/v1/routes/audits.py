from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.schemas.Schema import (CourseInput, DegreeEvalResponseSchema,
SchoolSchema, CourseEquivalency, JSONExportSchema, MajorSchema)

#Loading in data
from app.repository.r2_Loader import (
    load_courses,
    load_degree_requirements,
    load_majors_programs,
    load_schools,
    load_course_equivalencies,
)
from app.services.course_match import (
    compact_alnum,
    catalog_cc_key,
    course_entry_matches_catalog,
    filter_equivalencies_by_school,
    school_catalog_id,
)

router = APIRouter(prefix="/audits", tags=["audits"])


def _equivalency_model(eq: dict) -> CourseEquivalency:
    return CourseEquivalency(
        cc_course_name=str(eq["cc_course_name"]),
        sdsu_course_name=str(eq["sdsu_course_name"]),
        units=float(eq.get("units", 3.0)),
        is_transferable=bool(eq.get("is_transferable", True)),
    )

def _course_units_map(courses: list) -> dict:
    out = {}
    for c in courses:
        if not isinstance(c, dict):
            continue
        cid = c.get("id")
        if cid is None:
            continue
        try:
            out[str(cid)] = float(c.get("units", 0.0))
        except (TypeError, ValueError):
            out[str(cid)] = 0.0
    return out

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
        courses = load_courses()
        degree_requirements = load_degree_requirements()
        sid = school_catalog_id(schools, request.school_name)
        # Narrow to rows for this CC when the equivalency table tags them with from_school.
        equiv_pool = filter_equivalencies_by_school(equivalencies, sid)
        units_by_course_id = _course_units_map(courses)

        #Find major requirements
        major_reqs = []
        major_id = None
        for major in majors:
            if major["major_name"].lower() == request.major_name.lower():
                major_reqs = major.get("requirements", [])
                # Same id string as degree_requirements.json's major_id, not the display name.
                major_id = major.get("id")
                break
        # Use SDSU degree_requirement if catalog dosent include major_program
        required_sdsu_courses = []
        if (not major_reqs) and major_id:
            for r in degree_requirements:
                if isinstance(r, dict) and r.get("major_id") == major_id:
                    cid = r.get("course_id")
                    if cid is not None:
                        required_sdsu_courses.append(str(cid))
        
        #Match entered courses to equivalencies
        completed = []
        completed_sdsu_ids = set()
        # Classify course in correct format, ex Math150 -> MATH150 -> Math 150 or MATH 150 are equivalent
        seen_user_courses = set()
        
        for course in request.courses_entered:
            user_key = compact_alnum(course.course_name)
            if user_key and user_key in seen_user_courses:
                continue
            if user_key:
                seen_user_courses.add(user_key)
            matched = False
            for eq in equiv_pool:
                if course_entry_matches_catalog(
                    course.course_name, eq["cc_course_name"]
                ):
                    sdsu = str(eq["sdsu_course_name"])
                    units = float(eq.get("units", units_by_course_id.get(sdsu, 3.0)))
                    ceq = CourseEquivalency(
                        cc_course_name=course.course_name,
                        sdsu_course_name=sdsu,
                        units=units,
                        is_transferable=bool(eq.get("is_transferable", True)),
                    )
                    completed.append(ceq)
                    completed_sdsu_ids.add(sdsu)
                    matched = True
                    break
            if not matched:
                completed.append(CourseEquivalency(
                    cc_course_name=course.course_name,
                    sdsu_course_name="No Equivalent",
                    units=0.0,
                    is_transferable=False
                ))
        
        total_completed = sum(c.units for c in completed if c.is_transferable)
        
        # Build remaining requirements.
        uncompleted = []
        total_required = 0.0
        if major_reqs:
            uncompleted = major_reqs.copy()
            total_required = sum(r.get("units", 3.0) for r in major_reqs)
            # Remove completed SDSU courses if present
            uncompleted = [
                r for r in uncompleted
                if r.get("sdsu_course_name") not in completed_sdsu_ids
            ]
        else:
            # For each SDSU major requuired course, find a equivalent from the selected CC.
            for sdsu_id in required_sdsu_courses:
                if sdsu_id in completed_sdsu_ids:
                    continue
                units = units_by_course_id.get(sdsu_id, 3.0)
                # find equivalency that maps to this SDSU course
                cc_equiv = None
                for eq in equiv_pool:
                    if str(eq.get("sdsu_course_name")) == sdsu_id:
                        # Remove _COLLEGENAME from course output
                        cc_equiv = catalog_cc_key(str(eq.get("cc_course_name")))
                        break
                if cc_equiv is None:
                    cc_equiv = "No Equivalent"
                uncompleted.append(CourseEquivalency(
                    cc_course_name=cc_equiv,
                    sdsu_course_name=sdsu_id,
                    units=float(units),
                    is_transferable=(cc_equiv != "No Equivalent"),
                ))
                total_required += float(units)

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