from pydantic import BaseModel
from typing import Optional, List

class CourseInput(BaseModel):
    course_name: str
    community_college: str