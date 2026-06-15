from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class CarBase(BaseModel):
    title: str
    make: str
    model: str
    variant: Optional[str] = None
    year: int
    price: float
    mileage: int
    fuel_type: str
    transmission: str
    body_type: Optional[str] = None
    color: Optional[str] = None
    engine_cc: Optional[int] = None
    seats: Optional[int] = None
    description: Optional[str] = None
    features: Optional[Dict[str, Any]] = None

class CarCreate(CarBase):
    dealer_id: uuid.UUID

class CarUpdate(BaseModel):
    price: Optional[float] = None
    mileage: Optional[int] = None
    status: Optional[str] = None

class CarResponse(CarBase):
    id: uuid.UUID
    dealer_id: uuid.UUID
    status: str
    is_featured: bool
    view_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
