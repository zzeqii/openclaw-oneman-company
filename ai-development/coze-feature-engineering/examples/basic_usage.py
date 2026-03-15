"""
特征工程模块基本使用示例
"""
import pandas as pd
import numpy as np
from sklearn.datasets import load_iris, load_boston
from src.feature_engineering import (
    FeatureExtractor, FeatureTransformer,
    FeatureSelector, FeatureEvaluator
)

def classification_example():
    """分类问题特征工程示例"""
    print("=" * 60)
    print("分类问题特征工程示例")
    print("=" * 60)
    
    # 加载示例数据
    data = load_iris()
    df = pd.DataFrame(data.data, columns=data.feature_names)
    df['target'] = data.target
    
    print(f"原始数据形状: {df.shape}")
    print(f"原始特征: {df.columns.tolist()[:-1]}")
    print()
    
    # 1. 特征抽取
    print("1. 特征抽取...")
    extractor = FeatureExtractor()
    features = extractor.extract(df, target='target')
    print(f"抽取后特征数量: {len(features.columns) - 1}")  # 减去目标列
    print(f"抽取后特征示例: {features.columns.tolist()[:5]}...")
    print()
    
    # 2. 特征转换
    print("2. 特征转换...")
    transformer = FeatureTransformer({
        'scaling_method': 'standard',
        'enable_discretization': True
    })
    transformed_features = transformer.transform(features, target='target')
    print(f"转换后特征数量: {len(transformed_features.columns) - 1}")
    print()
    
    # 3. 特征选择
    print("3. 特征选择...")
    selector = FeatureSelector({
        'correlation_threshold': 0.7,
        'enable_rfe': False
    })
    selected_features = selector.select(transformed_features, target='target', top_k=20)
    print(f"选择后特征数量: {len(selected_features.columns) - 1}")
    print(f"选择的特征: {selected_features.columns.tolist()[:-1]}")
    print()
    
    # 查看特征评分
    scores = selector.get_feature_scores()
    print("特征评分Top 5:")
    print(scores.head())
    print()
    
    # 4. 特征重要性评估
    print("4. 特征重要性评估...")
    evaluator = FeatureEvaluator({
        'n_estimators': 200
    })
    importance = evaluator.evaluate(selected_features, target='target', method='all')
    print(f"模型性能: {evaluator.model_performance}")
    print()
    
    print("特征重要性Top 10:")
    print(importance.head(10))
    print()
    
    # 导出报告
    evaluator.export_report("classification_feature_report.md")
    print("特征评估报告已导出到 classification_feature_report.md")
    print()

def regression_example():
    """回归问题特征工程示例"""
    print("=" * 60)
    print("回归问题特征工程示例")
    print("=" * 60)
    
    # 加载示例数据
    data = load_boston()
    df = pd.DataFrame(data.data, columns=data.feature_names)
    df['target'] = data.target
    
    print(f"原始数据形状: {df.shape}")
    print(f"原始特征: {df.columns.tolist()[:-1]}")
    print()
    
    # 全流程处理
    print("全流程特征处理...")
    
    # 1. 特征抽取
    extractor = FeatureExtractor()
    features = extractor.extract(df, target='target')
    
    # 2. 特征转换
    transformer = FeatureTransformer({
        'scaling_method': 'minmax',
        'enable_log_transform': True
    })
    transformed_features = transformer.transform(features, target='target')
    
    # 3. 特征选择
    selector = FeatureSelector({
        'correlation_threshold': 0.8,
        'enable_rfe': True
    })
    selected_features = selector.select(transformed_features, target='target', top_k=15)
    
    # 4. 特征评估
    evaluator = FeatureEvaluator()
    importance = evaluator.evaluate(selected_features, target='target')
    
    print(f"最终特征数量: {len(selected_features.columns) - 1}")
    print(f"模型R2得分: {evaluator.model_performance['r2']:.4f}")
    print()
    
    print("最重要的5个特征:")
    print(evaluator.get_top_features(5))
    print()
    
    # 绘制特征重要性图
    evaluator.plot_feature_importance(top_n=10, save_path="regression_feature_importance.png")
    print("特征重要性图已保存到 regression_feature_importance.png")
    
    evaluator.export_report("regression_feature_report.md")
    print("特征评估报告已导出到 regression_feature_report.md")

if __name__ == "__main__":
    classification_example()
    regression_example()
