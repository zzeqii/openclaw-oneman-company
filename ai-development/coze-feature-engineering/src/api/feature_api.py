from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
import numpy as np
from src.schemas import (
    FeatureExtractRequest, FeatureExtractResponse,
    FeatureTransformRequest, FeatureTransformResponse,
    FeatureSelectRequest, FeatureSelectResponse,
    FeatureEvaluateRequest, FeatureEvaluateResponse,
    FeaturePipelineRequest, FeaturePipelineResponse
)
from src.feature_engineering import (
    FeatureExtractor, FeatureTransformer,
    FeatureSelector, FeatureEvaluator
)

router = APIRouter(prefix="/api/v1/feature", tags=["feature-engineering"])

# 全局存储已拟合的转换器，支持增量调用
extractor_instance: FeatureExtractor = None
transformer_instance: FeatureTransformer = None
selector_instance: FeatureSelector = None
evaluator_instance: FeatureEvaluator = None

@router.post("/extract", response_model=FeatureExtractResponse, summary="特征抽取")
async def extract_features(request: FeatureExtractRequest):
    """
    从输入数据中自动抽取各类特征：
    - 时间特征自动提取（年、月、日、时、周几、季度等）
    - 类别特征编码（计数、频率、目标编码等）
    - 文本特征提取（长度、词数、TF-IDF等）
    - 数值特征交叉衍生
    """
    try:
        global extractor_instance
        
        # 转换为DataFrame
        df = pd.DataFrame(request.data)
        
        # 初始化特征抽取器
        config = request.config or {}
        config['text_features'] = request.text_features
        config['id_columns'] = request.id_columns
        
        extractor_instance = FeatureExtractor(config)
        features_df = extractor_instance.extract(df, target=request.target)
        
        # 转换为列表格式
        features_list = features_df.replace({np.nan: None}).to_dict(orient='records')
        
        return FeatureExtractResponse(
            features=features_list,
            feature_names=features_df.columns.tolist(),
            message=f"成功抽取{len(features_df.columns)}个特征"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"特征抽取失败: {str(e)}")

@router.post("/transform", response_model=FeatureTransformResponse, summary="特征转换")
async def transform_features(request: FeatureTransformRequest):
    """
    对特征进行转换处理：
    - 缺失值自动填充
    - 异常值检测与处理
    - 标准化/归一化
    - 特征离散化/分箱
    - 对数/平方根等数学变换
    """
    try:
        global transformer_instance
        
        # 转换为DataFrame
        df = pd.DataFrame(request.data)
        
        # 初始化特征转换器
        config = request.config or {}
        config.update({
            'scaling_method': request.scaling_method,
            'numerical_impute_strategy': request.numerical_impute_strategy,
            'categorical_impute_strategy': request.categorical_impute_strategy,
            'enable_discretization': request.enable_discretization,
            'discretization_bins': request.discretization_bins
        })
        
        if not transformer_instance or request.fit:
            transformer_instance = FeatureTransformer(config)
        
        transformed_df = transformer_instance.transform(df, target=request.target, fit=request.fit)
        
        # 转换为列表格式
        transformed_list = transformed_df.replace({np.nan: None}).to_dict(orient='records')
        
        return FeatureTransformResponse(
            transformed_features=transformed_list,
            feature_names=transformed_df.columns.tolist(),
            message=f"成功转换{len(transformed_df.columns)}个特征"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"特征转换失败: {str(e)}")

@router.post("/select", response_model=FeatureSelectResponse, summary="特征选择")
async def select_features(request: FeatureSelectRequest):
    """
    自动选择重要特征：
    - 移除低方差特征
    - 移除高度相关特征
    - 单变量特征选择（卡方、F检验、互信息）
    - 基于模型的特征选择
    - 递归特征消除（可选）
    """
    try:
        global selector_instance
        
        # 转换为DataFrame
        df = pd.DataFrame(request.data)
        
        if request.target not in df.columns:
            raise HTTPException(status_code=400, detail=f"目标列{request.target}不存在")
        
        # 初始化特征选择器
        config = request.config or {}
        config.update({
            'correlation_threshold': request.correlation_threshold,
            'variance_threshold': request.variance_threshold,
            'enable_rfe': request.enable_rfe
        })
        
        selector_instance = FeatureSelector(config)
        selected_df = selector_instance.select(df, target=request.target, top_k=request.top_k)
        
        # 获取特征评分
        scores_df = selector_instance.get_feature_scores()
        scores_list = scores_df.to_dict(orient='records')
        
        # 转换为列表格式
        selected_list = selected_df.replace({np.nan: None}).to_dict(orient='records')
        
        return FeatureSelectResponse(
            selected_features=selected_list,
            feature_names=selector_instance.selected_features,
            feature_scores=scores_list,
            message=f"成功选择{len(selector_instance.selected_features)}个特征"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"特征选择失败: {str(e)}")

@router.post("/evaluate", response_model=FeatureEvaluateResponse, summary="特征重要性评估")
async def evaluate_features(request: FeatureEvaluateRequest):
    """
    评估特征重要性：
    - 树模型特征重要性
    - 排列重要性
    - SHAP重要性（可选）
    - 特征重要性可视化支持
    - 模型性能评估
    """
    try:
        global evaluator_instance
        
        # 转换为DataFrame
        df = pd.DataFrame(request.data)
        
        if request.target not in df.columns:
            raise HTTPException(status_code=400, detail=f"目标列{request.target}不存在")
        
        # 初始化特征评估器
        config = request.config or {}
        config.update({
            'n_estimators': request.n_estimators,
            'max_depth': request.max_depth
        })
        
        evaluator_instance = FeatureEvaluator(config)
        importance_df = evaluator_instance.evaluate(df, target=request.target, method=request.method)
        
        # 转换为列表格式
        importance_list = importance_df.to_dict(orient='records')
        top_features = evaluator_instance.get_top_features(10)
        
        return FeatureEvaluateResponse(
            feature_importance=importance_list,
            model_performance=evaluator_instance.model_performance,
            top_features=top_features,
            message=f"成功评估{len(importance_df)}个特征的重要性"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"特征评估失败: {str(e)}")

@router.post("/pipeline", response_model=FeaturePipelineResponse, summary="全流程特征处理")
async def feature_pipeline(request: FeaturePipelineRequest):
    """
    一站式特征工程全流程处理：
    1. 特征抽取 -> 2. 特征转换 -> 3. 特征选择 -> 4. 特征评估
    输入原始数据，直接输出高质量特征集和重要性分析结果
    """
    try:
        # 转换为DataFrame
        df = pd.DataFrame(request.data)
        
        if request.target not in df.columns:
            raise HTTPException(status_code=400, detail=f"目标列{request.target}不存在")
        
        # 1. 特征抽取
        extractor_config = {
            'text_features': request.text_features,
            'id_columns': request.id_columns
        }
        extractor = FeatureExtractor(extractor_config)
        features_df = extractor.extract(df, target=request.target)
        
        # 2. 特征转换
        transformer = FeatureTransformer(request.config)
        transformed_df = transformer.transform(features_df, target=request.target)
        
        # 3. 特征选择
        selector = FeatureSelector(request.config)
        selected_df = selector.select(transformed_df, target=request.target, top_k=request.select_top_k)
        
        # 4. 特征评估
        evaluator = FeatureEvaluator(request.config)
        importance_df = evaluator.evaluate(selected_df, target=request.target, method=request.evaluate_method)
        
        # 转换为列表格式
        final_features_list = selected_df.replace({np.nan: None}).to_dict(orient='records')
        importance_list = importance_df.to_dict(orient='records')
        
        return FeaturePipelineResponse(
            final_features=final_features_list,
            feature_names=selector.selected_features,
            feature_importance=importance_list,
            model_performance=evaluator.model_performance,
            message=f"全流程处理完成，最终得到{len(selector.selected_features)}个优质特征"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"特征工程全流程处理失败: {str(e)}")
