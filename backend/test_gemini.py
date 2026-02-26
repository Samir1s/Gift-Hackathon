import asyncio
import sys
from app.services import gemini_service

async def main():
    print("Testing gemini_service.chat_response...")
    # enable verbose printing of exceptions in _call_gemini_with_timeout by temporarily patching it or since it already has print, it will print to stdout
    result = await gemini_service.chat_response("What is trading?", "general")
    print(f"Result: {result}")

if __name__ == "__main__":
    asyncio.run(main())
