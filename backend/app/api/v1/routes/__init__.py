from fastapi import APIRouter
from . import courses, schools, majors, equivalencies, transfer, audits

# Main v1 API router
api_v1_router = APIRouter(prefix="/api/v1")

# Mount sub-routers
api_v1_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_v1_router.include_router(schools.router, prefix="/schools", tags=["schools"])
api_v1_router.include_router(majors.router, prefix="/majors", tags=["majors"])
api_v1_router.include_router(equivalencies.router, prefix="/equivalencies", tags=["equivalencies"])
api_v1_router.include_router(transfer.router, prefix="/transfers", tags=["transfers"])
api_v1_router.include_router(audits.router, prefix="/audits", tags=["audits"])
