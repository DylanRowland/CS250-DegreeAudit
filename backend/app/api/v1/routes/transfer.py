from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.schemas.Schema import CourseInput, CourseEquivalency
from app.repository.r2_Loader import load_course_equivalencies

router = APIRouter(prefix="/transfers", tags=["transfers"])

class TransferEvalRequest(BaseModel):
    courses: List[CourseInput]
    school_name: str

@router.post("/evaluate", response_model=List[CourseEquivalency])
def evaluate_transfers(request: TransferEvalRequest):
    #Evaluate transfer credits for given courses from school
    try:
        equivalencies = load_course_equivalencies()
        
        results = []
        for course in request.courses:
            matching = [e for e in equivalencies if e["cc_course_name"].lower() == course.course_name.lower()]
            if matching:
                results.extend(matching)
            else:
                results.append(CourseEquivalency(
                    cc_course_name=course.course_name,
                    sdsu_course_name="No Equivalent",
                    units=0.0,
                    is_transferable=False
                ))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating transfers: {str(e)}")
