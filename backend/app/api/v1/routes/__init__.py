from fastapi import APIRouter
from . import courses, schools, majors, equivalencies, transfer, audits

# Main v1 API router
api_v1_router = APIRouter(prefix="/api/v1")

# Mount sub-routers
api_v1_router.include_router(courses.router, tags=["courses"])
api_v1_router.include_router(schools.router, tags=["schools"])
api_v1_router.include_router(majors.router, tags=["majors"])
api_v1_router.include_router(equivalencies.router, tags=["equivalencies"])
api_v1_router.include_router(transfer.router, tags=["transfers"])
api_v1_router.include_router(audits.router, tags=["audits"])