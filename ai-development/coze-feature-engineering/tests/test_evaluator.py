import pytest
import pandas as pd
import numpy as np
import os
from src.feature_engineering.feature_evaluator import FeatureEvaluator
from sklearn.datasets import make_classification, make_regression

def test_evaluator_classification():
    """测试分类问题特征评估"""
    X, y = make_classification(
        n_samples=500, n_features=20, n_informative=8,
        n_redundant=2, random_state=42
    )
    
    feature_names = [f'feature_{i}' for i in range(20)]
    df = pd.DataFrame(X, columns=feature_names)
    df['target'] = y
    
    evaluator = FeatureEvaluator({'n_estimators': 100})
    importance = evaluator.evaluate(df, target='target', method='all')
    
    # 验证结果
    assert len(importance) == 20
    assert 'feature' in importance.columns
    assert 'importance' in importance.columns
    assert np.isclose(importance['importance'].sum(), 1.0, atol=0.1)
    
    # 验证模型性能
    assert 'accuracy' in evaluator.model_performance
    assert 'f1_score' in evaluator.model_performance
    assert evaluator.model_performance['accuracy'] > 0.7  # 应该有合理的准确率
    
    # 验证Top特征
    top_features = evaluator.get_top_features(5)
    assert len(top_features) == 5
    assert all(f.startswith('feature_') for f in top_features)

def test_evaluator_regression():
    """测试回归问题特征评估"""
    X, y = make_regression(
        n_samples=500, n_features=20, n_informative=10,
        noise=0.2, random_state=42
    )
    
    feature_names = [f'feature_{i}' for i in range(20)]
    df = pd.DataFrame(X, columns=feature_names)
    df['target'] = y
    
    evaluator = FeatureEvaluator()
    importance = evaluator.evaluate(df, target='target', method='tree')
    
    assert len(importance) == 20
    assert 'r2' in evaluator.model_performance
    assert evaluator.model_performance['r2'] > 0.5  # 应该有合理的R2得分

def test_evaluator_permutation_importance():
    """测试排列重要性计算"""
    X, y = make_classification(
        n_samples=200, n_features=10, n_informative=3,
        random_state=42
    )
    
    feature_names = [f'feature_{i}' for i in range(10)]
    df = pd.DataFrame(X, columns=feature_names)
    df['target'] = y
    
    evaluator = FeatureEvaluator()
    importance = evaluator.evaluate(df, target='target', method='permutation')
    
    assert 'permutation_importance' in importance.columns
    assert (importance['permutation_importance'] >= 0).all()

def test_evaluator_export_report():
    """测试报告导出功能"""
    X, y = make_classification(n_samples=100, n_features=10, random_state=42)
    df = pd.DataFrame(X, columns=[f'f{i}' for i in range(10)])
    df['target'] = y
    
    evaluator = FeatureEvaluator()
    evaluator.evaluate(df, target='target')
    
    report_path = 'test_report.md'
    evaluator.export_report(report_path)
    
    assert os.path.exists(report_path)
    with open(report_path, 'r', encoding='utf-8') as f:
        content = f.read()
        assert '# 特征重要性评估报告' in content
        assert '## 模型性能' in content
        assert '## 特征重要性Top 20' in content
    
    os.remove(report_path)

def test_evaluator_plotting():
    """测试绘图功能"""
    X, y = make_classification(n_samples=100, n_features=10, random_state=42)
    df = pd.DataFrame(X, columns=[f'f{i}' for i in range(10)])
    df['target'] = y
    
    evaluator = FeatureEvaluator()
    evaluator.evaluate(df, target='target')
    
    plot_path = 'test_plot.png'
    evaluator.plot_feature_importance(top_n=5, save_path=plot_path)
    
    assert os.path.exists(plot_path)
    os.remove(plot_path)

def test_evaluator_empty_data():
    """测试空数据异常处理"""
    df = pd.DataFrame({'feature1': [], 'target': []})
    evaluator = FeatureEvaluator()
    
    with pytest.raises(Exception):
        evaluator.evaluate(df, target='target')
