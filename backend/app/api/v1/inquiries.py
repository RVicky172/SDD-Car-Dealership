from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryResponse, InquiryCreate

router = APIRouter()

@router.post("/", response_model=InquiryResponse)
async def create_inquiry(
    inquiry_in: InquiryCreate,
    db: AsyncSession = Depends(deps.get_db)
):
    inquiry = Inquiry(**inquiry_in.model_dump())
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    return inquiry
