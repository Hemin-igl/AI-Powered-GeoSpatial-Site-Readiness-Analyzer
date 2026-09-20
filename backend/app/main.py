from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.routes import (
    health,
    layers,
    sites,
    opportunities,
    accessibility,
    competition,
    hotspots,
    ai,
    reports,
    auth,
)

from .db.session import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered GeoSpatial Site Readiness Analyzer Backend API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
def on_startup():
    init_db()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 routes
api_router = FastAPI()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(layers.router)
api_router.include_router(sites.router)
api_router.include_router(opportunities.router)
api_router.include_router(accessibility.router)
api_router.include_router(competition.router)
api_router.include_router(hotspots.router)
api_router.include_router(ai.router)
api_router.include_router(reports.router)

app.mount(settings.API_V1_STR, api_router)

# Also expose health check at root /health for convenience
@app.get("/health", tags=["Health"])
def root_health():
    return {"status": "ok", "version": settings.VERSION}

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "AI-Powered GeoSpatial Site Readiness Analyzer API",
        "docs": "/docs",
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
