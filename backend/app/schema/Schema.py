from pydantic import BaseModel
from typing import Optional, List

class CourseInput(BaseModel):
    course_name: str
    community_college: str

class CourseEquivalency (BaseModel):
    cc_course_name: str
    sdsu_course_name: str
    units: int
    is_transferable: bool