from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .cars import router as cars_router
from .dealers import router as dealers_router
from .inquiries import router as inquiries_router
from .bookings import router as bookings_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(cars_router, prefix="/cars", tags=["cars"])
api_router.include_router(dealers_router, prefix="/dealers", tags=["dealers"])
api_router.include_router(inquiries_router, prefix="/inquiries", tags=["inquiries"])
api_router.include_router(bookings_router, prefix="/bookings", tags=["bookings"])
