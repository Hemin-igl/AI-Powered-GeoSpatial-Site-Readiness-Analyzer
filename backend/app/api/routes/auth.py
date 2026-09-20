from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from ...schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from ...services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required")
    token = authorization.split(" ")[1]
    payload = AuthService.decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = AuthService.get_user_by_email(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=TokenResponse)
def register(req: UserRegister):
    try:
        user = AuthService.register(req)
        token = AuthService.create_access_token({"sub": user.email, "id": user.id})
        return TokenResponse(access_token=token, user=user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login(req: UserLogin):
    user = AuthService.authenticate(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = AuthService.create_access_token({"sub": user.email, "id": user.id})
    return TokenResponse(access_token=token, user=user)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"status": "ok", "message": "Logged out successfully"}
