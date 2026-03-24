from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.repository.r2Loader import load_courses, load_course_equivalencies
from app.schemas.Schema import CourseEquivalency
from pydantic import BaseModel

router = APIRouter(prefix="/courses", tags=["courses"])

class CourseSearch(BaseModel):
    query: str
    school: Optional[str] = None

@router.get("/", response_model=List[dict])
def list_courses(limit: int = 20, skip: int = 0):
    #List all courses from R2 courses.json 
    try:
        courses = load_courses()
        return courses[skip:skip+limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading courses: {str(e)}")

@router.get("/{course_id}", response_model=dict)
def get_course(course_id: str):
    #Get specific course by ID
    try:
        courses = load_courses()
        for course in courses:
            if course.get('id', '').lower() == course_id.lower():
                return course
        raise HTTPException(status_code=404, detail="Course not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/search", response_model=List[CourseEquivalency])
def search_courses(search: CourseSearch):
    #Search courses/equivalencies
    try:
        equivalencies = load_course_equivalencies()
        matching = [e for e in equivalencies if search.query.lower() in e["cc_course_name"].lower()]
        return matching
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {str(e)}")
