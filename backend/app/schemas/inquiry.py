from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class InquiryBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class InquiryCreate(InquiryBase):
    car_id: uuid.UUID

class InquiryResponse(InquiryBase):
    id: uuid.UUID
    car_id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
