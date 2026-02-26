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
    user_id = str(uuid.uuid4())[:8]
    user = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "xp": 0,
        "level": 1,
        "streak": 0,
    }
    _users[req.email] = user
    global _current_user
    _current_user = user
    return {"user": user, "message": "Account created successfully"}


@router.post("/login")
async def login(req: LoginRequest):
    global _current_user
    if req.email in _users:
        _current_user = _users[req.email]
    else:
        _current_user = {
            "id": str(uuid.uuid4())[:8],
            "name": req.email.split("@")[0].title(),
            "email": req.email,
            "xp": 2450,
            "level": 5,
            "streak": 7,
        }
        _users[req.email] = _current_user
    return {"user": _current_user, "message": "Login successful"}


@router.get("/me")
async def get_me():
    user = _get_or_create_default_user()
    return user
