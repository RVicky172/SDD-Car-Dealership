from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.models.dealer import Dealer
from app.schemas.dealer import DealerResponse

router = APIRouter()

@router.get("/{dealer_id}", response_model=DealerResponse)
async def read_dealer(
    dealer_id: str, db: AsyncSession = Depends(deps.get_db)
):
    result = await db.execute(select(Dealer).where(Dealer.id == dealer_id))
    dealer = result.scalar_one_or_none()
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found")
    return dealer
