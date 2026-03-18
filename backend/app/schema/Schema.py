from pydantic import BaseModel
from typing import Optional, List

class CourseInput(BaseModel):
    course_name: str
    community_college: str

class CourseEquivalency (BaseModel):
    cc_course_name: str
    sdsu_course_name: str
    units: float
    is_transferable: bool = True

class MajorSchema(BaseModel):
    major_name: str
    requirements: List[CourseEquivalency]

class SchoolSchema(BaseModel):
    school_name: str
    available_courses: List[CourseEquivalency]