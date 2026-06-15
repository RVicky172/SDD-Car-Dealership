import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    car_id = Column(UUID(as_uuid=True), ForeignKey("cars.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    message = Column(Text, nullable=False)
    status = Column(String(20), default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    car = relationship("Car", backref="inquiries")
    user = relationship("User", backref="inquiries")

Index("idx_inquiries_car_id", Inquiry.car_id)
