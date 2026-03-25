from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.Schema import CourseEquivalency
from app.repository.r2_Loader import load_course_equivalencies

router = APIRouter(prefix="/equivalencies", tags=["equivalencies"])

@router.get("/", response_model=List[CourseEquivalency])
def list_equivalencies():
    #List all course equivalencies from R2
    try:
        equivalencies = load_course_equivalencies()
        return equivalencies
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading equivalencies: {str(e)}")

@router.get("/{cc_course}", response_model=List[CourseEquivalency])
def get_equivalencies(cc_course: str):
    #Get equivalencies for specific CC course
    try:
        equivalencies = load_course_equivalencies()
        matching = [e for e in equivalencies if e["cc_course_name"].lower() == cc_course.lower()]
        if not matching:
            raise HTTPException(status_code=404, detail="No equivalency found")
        return matching
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
