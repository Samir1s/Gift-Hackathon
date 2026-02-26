from fastapi import APIRouter
from app.models.schemas import ChatMessage, ChatResponse
from app.services import gemini_service

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

# In-memory chat history
_chat_history: list = []


@router.post("/message")
async def send_message(req: ChatMessage):
    _chat_history.append({"role": "user", "content": req.message})

    response = await gemini_service.chat_response(req.message, req.context)

    _chat_history.append({"role": "ai", "content": response})

    return {"role": "ai", "content": response}


@router.get("/history")
async def get_history():
    return _chat_history


@router.delete("/history")
async def clear_history():
    _chat_history.clear()
    return {"message": "Chat history cleared"}
