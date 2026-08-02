from fastapi import APIRouter

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.currency import router as currency_router
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.trip import router as trips_router
from app.api.v1.endpoints.user import router as users_router
from app.api.v1.endpoints.destination import router as destinations_router
from app.api.v1.endpoints.activity import router as activities_router
from app.api.v1.endpoints.transport import router as transport_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(trips_router)
api_router.include_router(destinations_router)
api_router.include_router(activities_router)
api_router.include_router(transport_router)
api_router.include_router(currency_router)