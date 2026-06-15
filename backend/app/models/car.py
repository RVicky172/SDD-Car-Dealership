import uuid
from sqlalchemy import Column, String, Integer, Numeric, Text, Boolean, DateTime, ForeignKey, func, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    dealer_id = Column(UUID(as_uuid=True), ForeignKey("dealers.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    variant = Column(String(100))
    year = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    mileage = Column(Integer, nullable=False)
    fuel_type = Column(String(50), nullable=False)
    transmission = Column(String(50), nullable=False)
    body_type = Column(String(50))
    color = Column(String(50))
    engine_cc = Column(Integer)
    seats = Column(Integer)
    description = Column(Text)
    features = Column(JSONB)
    status = Column(String(20), default='active')
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    dealer = relationship("Dealer", backref="cars")

Index("idx_cars_dealer_id", Car.dealer_id)
Index("idx_cars_status", Car.status)
Index("idx_cars_make_model", Car.make, Car.model)
Index("idx_cars_price", Car.price)
Index("idx_cars_year", Car.year)
Index("idx_cars_fuel_transmission", Car.fuel_type, Car.transmission)
