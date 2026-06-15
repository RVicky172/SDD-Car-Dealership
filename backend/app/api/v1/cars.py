from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.api import deps
from app.models.car import Car
from app.schemas.car import CarResponse, CarCreate

router = APIRouter()

@router.get("/", response_model=List[CarResponse])
async def read_cars(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(deps.get_db)
):
    result = await db.execute(select(Car).offset(skip).limit(limit))
    return result.scalars().all()
