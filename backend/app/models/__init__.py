from sqlmodel import SQLModel, Field
## Fix database issue
try:
    from sqlmodel import SQLModel, Field
except ImportError:  # pragma: no cover
    # Keep this module importable even when sqlmodel isn't installed.
    SQLModel = object

    def Field(*args, **kwargs): 
        return None

#Base Model (inheriter / shared properties)
class College(SQLModel):
    name: str = Field(index=True, nullable=False)

class Major(SQLModel):
    name: str = Field(index=True, nullable=False)
    
class Minor(SQLModel):
    name: str = Field(index=True, nullable=False)
    
class Courses(SQLModel):
    name: str = Field(index=True, nullable=False)
    
    