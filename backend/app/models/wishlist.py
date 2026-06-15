import uuid
from sqlalchemy import Column, DateTime, ForeignKey, func, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    car_id = Column(UUID(as_uuid=True), ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="wishlists")
    car = relationship("Car", backref="wishlisted_by")

    __table_args__ = (
        UniqueConstraint('user_id', 'car_id', name='uix_wishlists_user_car'),
    )

Index("idx_wishlists_user_id", Wishlist.user_id)
