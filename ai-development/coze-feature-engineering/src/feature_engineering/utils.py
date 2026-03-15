import pandas as pd
import numpy as np
from typing import List, Tuple, Dict, Any
from sklearn.model_selection import train_test_split

def detect_feature_types(df: pd.DataFrame) -> Tuple[List[str], List[str], List[str]]:
    """
    自动检测数据中的特征类型
    
    Args:
        df: 输入数据集
        
    Returns:
        numerical_features: 数值特征列表
        categorical_features: 类别特征列表
        datetime_features: 时间特征列表
    """
    numerical_features = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    datetime_features = df.select_dtypes(include=['datetime64', 'datetime64[ns]']).columns.tolist()
    
    # 处理可能被错误识别为数值的类别特征（比如只有少数几个唯一值的数值列）
    for col in numerical_features.copy():
        if df[col].nunique() < 10 and df[col].dtype in ['int64']:
            categorical_features.append(col)
            numerical_features.remove(col)
    
    return numerical_features, categorical_features, datetime_features

def split_dataset(df: pd.DataFrame, target_col: str, test_size: float = 0.2, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    拆分数据集为训练集和测试集
    
    Args:
        df: 输入数据集
        target_col: 目标列名
        test_size: 测试集比例
        random_state: 随机种子
        
    Returns:
        X_train: 训练集特征
        X_test: 测试集特征
        y_train: 训练集目标
        y_test: 测试集目标
    """
    X = df.drop(columns=[target_col])
    y = df[target_col]
    return train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y if y.dtype == 'object' or y.nunique() < 10 else None)

def calculate_correlation(df: pd.DataFrame, method: str = 'pearson') -> pd.DataFrame:
    """
    计算特征之间的相关系数
    
    Args:
        df: 输入数据集
        method: 相关系数计算方法，可选 pearson, spearman, kendall
        
    Returns:
        相关系数矩阵
    """
    return df.corr(method=method)

def find_highly_correlated_features(corr_matrix: pd.DataFrame, threshold: float = 0.8) -> List[Tuple[str, str, float]]:
    """
    查找高度相关的特征对
    
    Args:
        corr_matrix: 相关系数矩阵
        threshold: 相关系数阈值
        
    Returns:
        高度相关的特征对列表，每个元素为 (feature1, feature2, correlation)
    """
    correlated_pairs = []
    for i in range(len(corr_matrix.columns)):
        for j in range(i+1, len(corr_matrix.columns)):
            if abs(corr_matrix.iloc[i, j]) > threshold:
                correlated_pairs.append((
                    corr_matrix.columns[i],
                    corr_matrix.columns[j],
                    corr_matrix.iloc[i, j]
                ))
    return correlated_pairs

def remove_highly_correlated_features(df: pd.DataFrame, threshold: float = 0.8, keep: str = 'first') -> pd.DataFrame:
    """
    移除高度相关的特征
    
    Args:
        df: 输入数据集
        threshold: 相关系数阈值
        keep: 保留策略，'first' 保留先出现的特征，'last' 保留后出现的特征
        
    Returns:
        移除高度相关特征后的数据集
    """
    corr_matrix = df.corr().abs()
    upper = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
    
    if keep == 'first':
        to_drop = [column for column in upper.columns if any(upper[column] > threshold)]
    else:  # keep == 'last'
        to_drop = [column for column in upper.index if any(upper.loc[column] > threshold)]
    
    return df.drop(columns=to_drop)

def get_feature_statistics(df: pd.DataFrame) -> pd.DataFrame:
    """
    获取特征的统计信息
    
    Args:
        df: 输入数据集
        
    Returns:
        特征统计信息DataFrame
    """
    stats = []
    for col in df.columns:
        col_stats = {
            'feature': col,
            'dtype': str(df[col].dtype),
            'count': df[col].count(),
            'missing_count': df[col].isna().sum(),
            'missing_rate': df[col].isna().mean(),
            'nunique': df[col].nunique(),
            'unique_rate': df[col].nunique() / len(df)
        }
        
        if pd.api.types.is_numeric_dtype(df[col]):
            col_stats.update({
                'mean': df[col].mean(),
                'std': df[col].std(),
                'min': df[col].min(),
                '25%': df[col].quantile(0.25),
                '50%': df[col].median(),
                '75%': df[col].quantile(0.75),
                'max': df[col].max()
            })
        
        stats.append(col_stats)
    
    return pd.DataFrame(stats)
