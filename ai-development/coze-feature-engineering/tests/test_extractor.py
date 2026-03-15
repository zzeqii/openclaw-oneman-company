import pytest
import pandas as pd
import numpy as np
from src.feature_engineering.feature_extractor import FeatureExtractor

def test_feature_extractor_basic():
    """测试基础特征抽取功能"""
    # 创建测试数据
    data = {
        'id': [1, 2, 3, 4, 5],
        'numerical1': [10, 20, 30, 40, 50],
        'numerical2': [1.5, 2.5, 3.5, 4.5, 5.5],
        'categorical': ['A', 'B', 'A', 'C', 'B'],
        'datetime': pd.date_range('2023-01-01', periods=5),
        'text': ['hello world', 'test text', 'feature engineering', 'machine learning', 'data science'],
        'target': [0, 1, 0, 1, 0]
    }
    df = pd.DataFrame(data)
    
    # 初始化抽取器
    extractor = FeatureExtractor({
        'text_features': ['text'],
        'id_columns': ['id']
    })
    
    # 抽取特征
    result = extractor.extract(df, target='target')
    
    # 验证结果
    assert 'id' not in result.columns  # ID列已被移除
    assert 'target' in result.columns  # 目标列保留
    
    # 验证时间特征
    assert 'datetime_year' in result.columns
    assert 'datetime_month' in result.columns
    assert 'datetime_day' in result.columns
    assert 'datetime_dayofweek' in result.columns
    assert 'datetime_is_weekend' in result.columns
    
    # 验证类别特征
    assert 'categorical_rare' in result.columns
    assert 'categorical_count' in result.columns
    assert 'categorical_freq' in result.columns
    assert 'categorical_target_enc' in result.columns
    
    # 验证文本特征
    assert 'text_length' in result.columns
    assert 'text_word_count' in result.columns
    assert 'text_avg_word_length' in result.columns
    assert any(col.startswith('text_tfidf_') for col in result.columns)
    
    # 验证数值特征衍生
    assert 'numerical1_add_numerical2' in result.columns
    assert 'numerical1_sub_numerical2' in result.columns
    assert 'numerical1_mul_numerical2' in result.columns
    assert 'numerical1_div_numerical2' in result.columns
    assert 'numerical_sum' in result.columns
    assert 'numerical_mean' in result.columns
    
    # 验证特征数量增加
    assert len(result.columns) > len(df.columns)

def test_feature_extractor_no_target():
    """测试无目标列时的特征抽取"""
    data = {
        'numerical': [1, 2, 3, 4, 5],
        'categorical': ['X', 'Y', 'X', 'Y', 'Z']
    }
    df = pd.DataFrame(data)
    
    extractor = FeatureExtractor()
    result = extractor.extract(df)
    
    assert 'categorical_target_enc' not in result.columns  # 无目标列时不会生成目标编码
    assert 'categorical_count' in result.columns
    assert 'categorical_freq' in result.columns

def test_feature_extractor_no_text_features():
    """测试无文本特征时的特征抽取"""
    data = {
        'numerical': [1, 2, 3, 4, 5],
        'categorical': ['A', 'B', 'A', 'B', 'A']
    }
    df = pd.DataFrame(data)
    
    extractor = FeatureExtractor()
    result = extractor.extract(df)
    
    assert not any(col.startswith('text_') for col in result.columns)

def test_feature_extractor_datetime_only():
    """测试只有时间列的情况"""
    data = {
        'datetime1': pd.date_range('2023-01-01', periods=5),
        'datetime2': pd.date_range('2023-01-02', periods=5)
    }
    df = pd.DataFrame(data)
    
    extractor = FeatureExtractor()
    result = extractor.extract(df)
    
    # 验证时间差特征
    assert 'diff_datetime1_datetime2_days' in result.columns
    assert (result['diff_datetime1_datetime2_days'] == 1).all()
