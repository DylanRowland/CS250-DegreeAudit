from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.Schema import SchoolSchema
from app.repository.r2_Loader import load_schools

router = APIRouter(prefix="/schools", tags=["schools"])

@router.get("/", response_model=List[SchoolSchema])
def list_schools():
    #List all available schools from R2 schools.json
    try:
        schools_data = load_schools()
        return schools_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading schools: {str(e)}")

@router.get("/{school_name}", response_model=SchoolSchema)
def get_school(school_name: str):
    #Get specific school details
    try:
        schools = load_schools()
        for school in schools:
            if school["school_name"].lower() == school_name.lower():
                return school
        raise HTTPException(status_code=404, detail="School not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
