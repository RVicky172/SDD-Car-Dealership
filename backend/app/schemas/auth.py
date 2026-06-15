from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: str | None = None
    role: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    role: str = "buyer"
