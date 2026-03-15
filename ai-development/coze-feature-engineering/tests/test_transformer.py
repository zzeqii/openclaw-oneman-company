import pytest
import pandas as pd
import numpy as np
from src.feature_engineering.feature_transformer import FeatureTransformer

def test_transformer_missing_values():
    """测试缺失值处理功能"""
    data = {
        'numerical1': [1, 2, np.nan, 4, 5],
        'numerical2': [10, np.nan, 30, np.nan, 50],
        'categorical': ['A', 'B', np.nan, 'B', 'A'],
        'target': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    
    transformer = FeatureTransformer({
        'numerical_impute_strategy': 'median',
        'categorical_impute_strategy': 'most_frequent'
    })
    
    result = transformer.transform(df, target='target')
    
    # 验证缺失值已被填充
    assert result['numerical1'].isna().sum() == 0
    assert result['numerical2'].isna().sum() == 0
    assert result['categorical'].isna().sum() == 0
    
    # 验证填充值正确
    assert result['numerical1'].median() == 3.0
    assert result['categorical'].mode()[0] in ['A', 'B']
    
    # 验证缺失值标记
    assert 'numerical1_missing' in result.columns
    assert 'numerical2_missing' in result.columns

def test_transformer_outlier_handling():
    """测试异常值处理功能"""
    data = {
        'numerical': [1, 2, 3, 4, 5, 100],  # 100是异常值
        'target': [0, 1, 0, 1, 0, 1]
    }
    df = pd.DataFrame(data)
    
    transformer = FeatureTransformer({
        'outlier_method': 'iqr',
        'outlier_threshold': 1.5
    })
    
    result = transformer.transform(df, target='target')
    
    # 验证异常值已被截断
    assert result['numerical'].max() < 100
    
    # 验证异常值标记
    assert 'numerical_outlier' in result.columns
    assert result['numerical_outlier'].sum() == 1  # 最后一个样本是异常值

def test_transformer_scaling():
    """测试特征缩放功能"""
    data = {
        'numerical1': [1, 2, 3, 4, 5],
        'numerical2': [10, 20, 30, 40, 50],
        'target': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    
    # 测试标准化
    transformer = FeatureTransformer({'scaling_method': 'standard'})
    result = transformer.transform(df, target='target')
    
    assert np.isclose(result['numerical1'].mean(), 0, atol=0.1)
    assert np.isclose(result['numerical1'].std(), 1, atol=0.1)
    
    # 测试MinMax缩放
    transformer = FeatureTransformer({'scaling_method': 'minmax'})
    result = transformer.transform(df, target='target')
    
    assert result['numerical1'].min() == 0
    assert result['numerical1'].max() == 1

def test_transformer_discretization():
    """测试特征离散化功能"""
    data = {
        'numerical': list(range(100)),
        'target': [i % 2 for i in range(100)]
    }
    df = pd.DataFrame(data)
    
    transformer = FeatureTransformer({
        'enable_discretization': True,
        'discretization_bins': 5,
        'discretization_onehot': True
    })
    
    result = transformer.transform(df, target='target')
    
    assert 'numerical_bin' in result.columns
    assert result['numerical_bin'].nunique() == 5
    assert any(col.startswith('numerical_bin_') for col in result.columns)  # 独热编码列存在

def test_transformer_transform_only():
    """测试仅转换模式（使用已拟合的转换器）"""
    train_data = {
        'numerical': [1, 2, 3, 4, 5],
        'target': [0, 1, 0, 1, 0]
    }
    train_df = pd.DataFrame(train_data)
    
    transformer = FeatureTransformer()
    # 拟合转换器
    train_result = transformer.transform(train_df, target='target', fit=True)
    
    # 新数据转换
    test_data = {'numerical': [6, 7, 8, 9, 10]}
    test_df = pd.DataFrame(test_data)
    test_result = transformer.transform(test_df, fit=False)
    
    assert not test_result.isna().any().any()
    assert 'numerical' in test_result.columns
