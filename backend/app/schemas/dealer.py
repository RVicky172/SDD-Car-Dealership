from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class DealerBase(BaseModel):
    business_name: str
    license_number: str
    description: Optional[str] = None
    address: Optional[Dict[str, Any]] = None
    working_hours: Optional[Dict[str, Any]] = None

class DealerCreate(DealerBase):
    pass

class DealerResponse(DealerBase):
    id: uuid.UUID
    user_id: uuid.UUID
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True
