from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.models.user import User
from app.schemas.auth import Token, UserRegister
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """OAuth2 compatible token login, get an access token for future requests"""
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token = security.create_access_token(subject=user.id, role=user.role)
    refresh_token = security.create_refresh_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserResponse)
async def register_user(
    user_in: UserRegister, db: AsyncSession = Depends(deps.get_db)
):
    """Register a new user (mocking Cognito local)"""
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = security.get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
