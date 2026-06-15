import uuid
from sqlalchemy import Column, String, Date, Text, DateTime, ForeignKey, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class TestDriveBooking(Base):
    __tablename__ = "test_drive_bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    car_id = Column(UUID(as_uuid=True), ForeignKey("cars.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    time_slot = Column(String(20), nullable=False)
    status = Column(String(20), default='scheduled')
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    car = relationship("Car", backref="bookings")
    user = relationship("User", backref="bookings")

Index("idx_bookings_car_id", TestDriveBooking.car_id)
Index("idx_bookings_booking_date", TestDriveBooking.booking_date)
