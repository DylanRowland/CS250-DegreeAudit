import typing import Optional
from sqlmodel import SQLModel, Field

#Base Model (inheriter / shared properties)
class College(SQLModel):
    name: str = Field(index=True, nullable=False)

class Major(SQLModel):
    name: str = Field(index=True, nullable=False)
    
class Minor(SQLModel):
    name: str = Field(index=True, nullable=False)
    
class Courses(SQLModel):
    name: str = Field(index=True, nullable=False)
    
    