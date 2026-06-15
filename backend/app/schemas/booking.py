from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
import uuid

class BookingBase(BaseModel):
    booking_date: date
    time_slot: str
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    car_id: uuid.UUID

class BookingResponse(BookingBase):
    id: uuid.UUID
    car_id: uuid.UUID
    user_id: uuid.UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
