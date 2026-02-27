from fastapi import APIRouter, HTTPException
from app.models.schemas import LoginRequest, SignupRequest, UserProfile
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])

# In-memory user storage
_users: dict = {}
_current_user: dict = None


def _get_or_create_default_user() -> dict:
    global _current_user
    if not _current_user:
        _current_user = {
            "id": "default",
            "name": "Trader",
            "email": "trader@tradequest.io",
            "xp": 2450,
            "level": 5,
            "streak": 7,
        }
    return _current_user


@router.post("/signup")
async def signup(req: SignupRequest):
    if req.email in _users:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = str(uuid.uuid4())[:8]
    user = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "password": req.password, # In a real app, use hashing like passlib/bcrypt
        "xp": 0,
        "level": 1,
        "streak": 0,
    }
    _users[req.email] = user
    global _current_user
    _current_user = user
    return {"user": {k: v for k, v in user.items() if k != "password"}, "message": "Account created successfully"}


@router.post("/login")
async def login(req: LoginRequest):
    global _current_user
    if req.email in _users:
        user = _users[req.email]
        if user.get("password") == req.password:
            _current_user = user
            return {"user": {k: v for k, v in user.items() if k != "password"}, "message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
    else:
        # For "basic functional" we can still allow auto-creation if desired, 
        # but let's make it strict for a "functional" section.
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/me")
async def get_me():
    user = _get_or_create_default_user()
    return user
