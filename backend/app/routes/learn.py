from fastapi import APIRouter
from app.data.modules_data import MODULES, PROGRESS_DATA
from app.services import gemini_service

router = APIRouter(prefix="/api/learn", tags=["learn"])

# In-memory progress tracking
_module_progress = {m["id"]: m["completed"] for m in MODULES}


@router.get("/modules")
async def get_modules():
    modules = []
    for m in MODULES:
        mod = dict(m)
        mod["completed"] = _module_progress.get(m["id"], m["completed"])
        modules.append(mod)
    return modules


@router.get("/modules/{module_id}")
async def get_module(module_id: int):
    module = next((m for m in MODULES if m["id"] == module_id), None)
    if module:
        mod = dict(module)
        mod["completed"] = _module_progress.get(module_id, module["completed"])
        return mod
    return {"error": "Module not found"}


@router.post("/modules/{module_id}/lessons/{lesson_id}/complete")
async def complete_lesson(module_id: int, lesson_id: int):
    if module_id in _module_progress:
        module = next((m for m in MODULES if m["id"] == module_id), None)
        if module and _module_progress[module_id] < module["lessons"]:
            _module_progress[module_id] += 1
            return {
                "completed": _module_progress[module_id],
                "total": module["lessons"],
                "xp_earned": module["xp"] // module["lessons"],
            }
    return {"completed": 0, "total": 0, "xp_earned": 0}


@router.get("/progress")
async def get_progress():
    return PROGRESS_DATA


@router.post("/ai-analysis")
async def get_ai_analysis():
    modules = []
    for m in MODULES:
        mod = dict(m)
        mod["completed"] = _module_progress.get(m["id"], m["completed"])
        modules.append(mod)
    analysis = await gemini_service.analyze_learning(modules)
    return analysis
