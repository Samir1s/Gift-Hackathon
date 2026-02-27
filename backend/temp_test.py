import asyncio
import traceback
from app.services.prediction_service import predictor

async def main():
    try:
        res = await predictor.predict_direction('BTC')
        print("Success:")
        print(res)
    except Exception as e:
        print("Error details:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
