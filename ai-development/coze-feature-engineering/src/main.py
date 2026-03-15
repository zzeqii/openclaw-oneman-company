from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from src.api import feature_router

app = FastAPI(
    title="Coze特征工程模块API",
    description="为Coze自动策略Agent提供完整的特征工程能力，支持自动特征抽取、选择、转换和重要性评估",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(feature_router)

@app.get("/", summary="健康检查")
async def root():
    return {
        "status": "ok",
        "message": "Coze特征工程模块服务运行正常",
        "version": "0.1.0"
    }

@app.get("/health", summary="健康检查")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )
