from fastapi import FastAPI

app = FastAPI(
    title="SkillBridge Backend",
    description="Backend API for SkillBridge",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "name": "SkillBridge",
        "status": "running",
        "version": "0.1.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }