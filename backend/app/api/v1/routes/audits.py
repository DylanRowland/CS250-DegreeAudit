from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.schemas.Schema import (CourseInput, DegreeEvalResponseSchema, JSONExportSchema, 
SchoolSchema, MajorSchema, CourseEquivalency)

router = APIRouter(prefix="/audits", tags=["audits"])

class AuditRequest(BaseModel):
    school_name: str
    major_name: str
    courses_entered: List[CourseInput]

