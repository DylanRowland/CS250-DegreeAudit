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

class DegreeEvalResponseSchema(BaseModel):
    chosen_major: str
    chosen_school: SchoolSchema
    completed_courses: List[CourseEquivalency]
    uncompleted_courses: List[CourseEquivalency]
    total_units_completed: float
    total_units_remaining: float
    total_units_required: float

class JSONExportSchema(BaseModel):
    school: SchoolSchema
    major: MajorSchema
    degree_eval: DegreeEvalResponseSchema
    courses_entered: List[CourseInput]

class ErrorMSG(BaseModel):
    error_msg: str
    unrecognized_input: str