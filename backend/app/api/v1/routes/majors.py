from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.Schema import MajorSchema, SchoolSchema
from app.repository.r2Loader import load_majors_programs, load_schools

router = APIRouter(prefix="/majors", tags=["majors"])

@router.get("/", response_model=List[MajorSchema])
def list_majors(
    school_name: Optional[str] = Query(None, description="Filter majors by school")
):
    #List all majors or filter by school from R2 majors_programs.json
    try:
        majors = load_majors_programs()
        
        if school_name:
            schools = load_schools()
            school_majors = []
            for school in schools:
                if school["school_name"].lower() == school_name.lower():
                    school_majors = school.get("available_majors", [])
                    break
            majors = [m for m in majors if m["major_name"] in school_majors]
        
        return majors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading majors: {str(e)}")

@router.get("/{major_name}", response_model=MajorSchema)
def get_major(major_name: str):
    #Get specific major requirements
    try:
        majors = load_majors_programs()
        for major in majors:
            if major["major_name"].lower() == major_name.lower():
                return major
        raise HTTPException(status_code=404, detail="Major not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
