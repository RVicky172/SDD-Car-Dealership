import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class CarImage(Base):
    __tablename__ = "car_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    car_id = Column(UUID(as_uuid=True), ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    s3_key = Column(String(500), nullable=False)
    url = Column(String(1000), nullable=False)
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    car = relationship("Car", backref="images")

Index("idx_car_images_car_id", CarImage.car_id)
