from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from enum import Enum

class ProblemTypeEnum(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"

class FeatureExtractRequest(BaseModel):
    """特征抽取请求模型"""
    data: List[Dict[str, Any]] = Field(description="输入数据集，列表形式，每个元素为一个样本")
    target: Optional[str] = Field(None, description="目标列名")
    text_features: Optional[List[str]] = Field(default_factory=list, description="文本特征列名列表")
    id_columns: Optional[List[str]] = Field(default_factory=list, description="ID列名列表")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="额外配置参数")

class FeatureExtractResponse(BaseModel):
    """特征抽取响应模型"""
    features: List[Dict[str, Any]] = Field(description="抽取后的特征数据集")
    feature_names: List[str] = Field(description="所有特征名称列表")
    message: str = Field(default="特征抽取完成", description="响应消息")

class FeatureTransformRequest(BaseModel):
    """特征转换请求模型"""
    data: List[Dict[str, Any]] = Field(description="输入数据集")
    target: Optional[str] = Field(None, description="目标列名")
    scaling_method: Optional[str] = Field("standard", description="缩放方法: standard, minmax, robust")
    numerical_impute_strategy: Optional[str] = Field("median", description="数值特征填充策略")
    categorical_impute_strategy: Optional[str] = Field("most_frequent", description="类别特征填充策略")
    enable_discretization: Optional[bool] = Field(True, description="是否启用特征离散化")
    discretization_bins: Optional[int] = Field(5, description="离散化分箱数")
    fit: Optional[bool] = Field(True, description="是否拟合转换器")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="额外配置参数")

class FeatureTransformResponse(BaseModel):
    """特征转换响应模型"""
    transformed_features: List[Dict[str, Any]] = Field(description="转换后的特征数据集")
    feature_names: List[str] = Field(description="所有特征名称列表")
    message: str = Field(default="特征转换完成", description="响应消息")

class FeatureSelectRequest(BaseModel):
    """特征选择请求模型"""
    data: List[Dict[str, Any]] = Field(description="输入数据集")
    target: str = Field(description="目标列名")
    top_k: Optional[int] = Field(None, description="选择前k个特征，默认自动选择")
    correlation_threshold: Optional[float] = Field(0.8, description="相关系数阈值")
    variance_threshold: Optional[float] = Field(0.01, description="方差阈值")
    enable_rfe: Optional[bool] = Field(False, description="是否启用递归特征消除")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="额外配置参数")

class FeatureSelectResponse(BaseModel):
    """特征选择响应模型"""
    selected_features: List[Dict[str, Any]] = Field(description="选择后的特征数据集")
    feature_names: List[str] = Field(description="选择的特征名称列表")
    feature_scores: List[Dict[str, Union[str, float]]] = Field(description="特征评分列表")
    message: str = Field(default="特征选择完成", description="响应消息")

class FeatureEvaluateRequest(BaseModel):
    """特征评估请求模型"""
    data: List[Dict[str, Any]] = Field(description="输入数据集")
    target: str = Field(description="目标列名")
    method: Optional[str] = Field("all", description="评估方法: tree, permutation, shap, all")
    n_estimators: Optional[int] = Field(200, description="树模型的数量")
    max_depth: Optional[int] = Field(10, description="树的最大深度")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="额外配置参数")

class FeatureEvaluateResponse(BaseModel):
    """特征评估响应模型"""
    feature_importance: List[Dict[str, Union[str, float]]] = Field(description="特征重要性列表")
    model_performance: Dict[str, float] = Field(description="模型性能指标")
    top_features: List[str] = Field(description="前10个最重要的特征")
    message: str = Field(default="特征评估完成", description="响应消息")

class FeaturePipelineRequest(BaseModel):
    """全流程特征处理请求模型"""
    data: List[Dict[str, Any]] = Field(description="输入数据集")
    target: str = Field(description="目标列名")
    text_features: Optional[List[str]] = Field(default_factory=list, description="文本特征列名列表")
    id_columns: Optional[List[str]] = Field(default_factory=list, description="ID列名列表")
    select_top_k: Optional[int] = Field(None, description="特征选择保留的特征数量")
    evaluate_method: Optional[str] = Field("all", description="特征评估方法")
    config: Optional[Dict[str, Any]] = Field(default_factory=dict, description="额外配置参数")

class FeaturePipelineResponse(BaseModel):
    """全流程特征处理响应模型"""
    final_features: List[Dict[str, Any]] = Field(description="最终处理后的特征数据集")
    feature_names: List[str] = Field(description="最终特征名称列表")
    feature_importance: List[Dict[str, Union[str, float]]] = Field(description="特征重要性列表")
    model_performance: Dict[str, float] = Field(description="模型性能指标")
    message: str = Field(default="全流程特征处理完成", description="响应消息")
