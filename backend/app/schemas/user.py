from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
