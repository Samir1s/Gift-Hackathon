from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from app.models.schemas import LoginRequest, SignupRequest, UserProfile
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# In-memory user storage
# Structure: email -> {"id": str, "name": str, "email": str, "hashed_password": str, "xp": int, "level": int, "streak": int}
_users: dict = {}

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    user = _users.get(email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/signup")
async def signup(req: SignupRequest):
    if req.email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_id = str(uuid.uuid4())[:8]
    user = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "hashed_password": get_password_hash(req.password),
        "xp": 0,
        "level": 1,
        "streak": 0,
    }
    _users[req.email] = user
    
    # Generate token immediately after signup
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != "hashed_password"}
    return {"user": user_response, "access_token": access_token, "token_type": "bearer", "message": "Account created successfully"}


@router.post("/login")
async def login(req: LoginRequest):
    user = _users.get(req.email)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    user_response = {k: v for k, v in user.items() if k != "hashed_password"}
    return {"user": user_response, "access_token": access_token, "token_type": "bearer", "message": "Login successful"}


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user_response = {k: v for k, v in current_user.items() if k != "hashed_password"}
    return user_response
