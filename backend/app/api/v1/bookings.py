from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.api import deps
from app.models.booking import TestDriveBooking
from app.schemas.booking import BookingResponse, BookingCreate
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_in: BookingCreate,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db)
):
    booking = TestDriveBooking(
        **booking_in.model_dump(),
        user_id=current_user.id
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking
