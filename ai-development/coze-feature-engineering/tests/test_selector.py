import pytest
import pandas as pd
import numpy as np
from src.feature_engineering.feature_selector import FeatureSelector
from sklearn.datasets import make_classification, make_regression

def test_selector_basic_classification():
    """测试分类问题特征选择"""
    # 创建模拟数据，包含10个有效特征和20个噪声特征
    X, y = make_classification(
        n_samples=1000, n_features=30, n_informative=10, 
        n_redundant=5, random_state=42
    )
    
    feature_names = [f'feature_{i}' for i in range(30)]
    df = pd.DataFrame(X, columns=feature_names)
    df['target'] = y
    
    selector = FeatureSelector({
        'correlation_threshold': 0.7,
        'variance_threshold': 0.01
    })
    
    selected_df = selector.select(df, target='target', top_k=15)
    
    # 验证结果
    assert 'target' in selected_df.columns
    assert len(selected_df.columns) - 1 <= 15  # 减去目标列
    
    # 验证特征评分
    scores = selector.get_feature_scores()
    assert len(scores) == len(selected_df.columns) - 1
    assert (scores['score'] >= 0).all()
    assert (scores['score'] <= 1).all()

def test_selector_basic_regression():
    """测试回归问题特征选择"""
    X, y = make_regression(
        n_samples=1000, n_features=30, n_informative=10, 
        noise=0.1, random_state=42
    )
    
    feature_names = [f'feature_{i}' for i in range(30)]
    df = pd.DataFrame(X, columns=feature_names)
    df['target'] = y
    
    selector = FeatureSelector()
    selected_df = selector.select(df, target='target', top_k=10)
    
    assert len(selected_df.columns) - 1 <= 10

def test_selector_remove_low_variance():
    """测试移除低方差特征"""
    data = {
        'feature1': [1, 1, 1, 1, 1],  # 方差为0
        'feature2': [1, 2, 3, 4, 5],  # 方差大
        'feature3': [1, 1, 1, 2, 2],  # 方差小
        'target': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    
    selector = FeatureSelector({'variance_threshold': 0.1})
    selected_df = selector.select(df, target='target')
    
    # 低方差特征被移除
    assert 'feature1' not in selected_df.columns
    assert 'feature2' in selected_df.columns

def test_selector_remove_highly_correlated():
    """测试移除高度相关特征"""
    data = {
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [2, 4, 6, 8, 10],  # 和feature1完全相关
        'feature3': [1, 3, 5, 7, 9],   # 和feature1高度相关
        'feature4': [5, 4, 3, 2, 1],   # 不相关
        'target': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    
    selector = FeatureSelector({'correlation_threshold': 0.9})
    selected_df = selector.select(df, target='target')
    
    # 高度相关的特征应该只保留一个
    assert not ('feature1' in selected_df.columns and 'feature2' in selected_df.columns)
    assert 'feature4' in selected_df.columns

def test_selector_rfe():
    """测试递归特征消除功能"""
    X, y = make_classification(
        n_samples=200, n_features=20, n_informative=5,
        random_state=42
    )
    
    feature_names = [f'feature_{i}' for i in range(20)]
    df = pd.DataFrame(X, columns=feature_names)
    df['target'] = y
    
    selector = FeatureSelector({'enable_rfe': True})
    selected_df = selector.select(df, target='target', top_k=5)
    
    assert len(selected_df.columns) - 1 == 5
