import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from category_encoders import TargetEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from .utils import detect_feature_types
import re

class FeatureExtractor:
    """
    自动特征抽取类，支持多种类型的特征自动提取
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初始化特征抽取器
        
        Args:
            config: 配置参数字典，可选
        """
        self.config = config or {}
        self.datetime_features: List[str] = []
        self.categorical_features: List[str] = []
        self.numerical_features: List[str] = []
        self.text_features: List[str] = self.config.get('text_features', [])
        self.id_columns: List[str] = self.config.get('id_columns', [])
        self.target_encoders: Dict[str, TargetEncoder] = {}
        self.tfidf_vectorizers: Dict[str, TfidfVectorizer] = {}
        
    def extract(self, df: pd.DataFrame, target: Optional[str] = None) -> pd.DataFrame:
        """
        自动抽取特征
        
        Args:
            df: 输入数据集
            target: 目标列名，用于目标编码等需要标签的特征提取
            
        Returns:
            抽取特征后的数据集
        """
        df = df.copy()
        
        # 自动检测特征类型
        self.numerical_features, self.categorical_features, self.datetime_features = detect_feature_types(df)
        
        # 移除ID列和目标列
        for col in self.id_columns + ([target] if target else []):
            if col in self.numerical_features:
                self.numerical_features.remove(col)
            if col in self.categorical_features:
                self.categorical_features.remove(col)
            if col in self.datetime_features:
                self.datetime_features.remove(col)
        
        # 1. 时间特征抽取
        if self.datetime_features:
            df = self._extract_datetime_features(df)
        
        # 2. 类别特征编码
        if self.categorical_features:
            df = self._encode_categorical_features(df, target)
        
        # 3. 文本特征抽取
        if self.text_features:
            df = self._extract_text_features(df)
        
        # 4. 数值特征衍生
        if self.numerical_features:
            df = self._derive_numerical_features(df)
        
        return df
    
    def _extract_datetime_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        从时间列中抽取时间特征
        
        Args:
            df: 输入数据集
            
        Returns:
            包含时间特征的数据集
        """
        for col in self.datetime_features:
            # 基本时间特征
            df[f'{col}_year'] = df[col].dt.year
            df[f'{col}_month'] = df[col].dt.month
            df[f'{col}_day'] = df[col].dt.day
            df[f'{col}_hour'] = df[col].dt.hour
            df[f'{col}_dayofweek'] = df[col].dt.dayofweek
            df[f'{col}_quarter'] = df[col].dt.quarter
            df[f'{col}_is_weekend'] = (df[col].dt.dayofweek >= 5).astype(int)
            
            # 时间差特征（如果有多个时间列）
            for other_col in self.datetime_features:
                if col < other_col:
                    df[f'diff_{col}_{other_col}_days'] = (df[other_col] - df[col]).dt.days
            
            # 移除原始时间列
            df = df.drop(columns=[col])
        
        return df
    
    def _encode_categorical_features(self, df: pd.DataFrame, target: Optional[str] = None) -> pd.DataFrame:
        """
        编码类别特征
        
        Args:
            df: 输入数据集
            target: 目标列名，用于目标编码
            
        Returns:
            编码后的数据集
        """
        for col in self.categorical_features:
            # 低频类别合并
            value_counts = df[col].value_counts()
            rare_categories = value_counts[value_counts < len(df) * 0.01].index
            df[f'{col}_rare'] = df[col].isin(rare_categories).astype(int)
            
            # 类别计数编码
            count_map = df[col].value_counts().to_dict()
            df[f'{col}_count'] = df[col].map(count_map)
            
            # 类别频率编码
            freq_map = (df[col].value_counts() / len(df)).to_dict()
            df[f'{col}_freq'] = df[col].map(freq_map)
            
            # 独热编码（仅当唯一值较少时）
            if df[col].nunique() < 10:
                dummies = pd.get_dummies(df[col], prefix=col, drop_first=True)
                df = pd.concat([df, dummies], axis=1)
            
            # 目标编码（当有目标列时）
            if target is not None and df[target].dtype in ['int64', 'float64']:
                if col not in self.target_encoders:
                    self.target_encoders[col] = TargetEncoder()
                    df[f'{col}_target_enc'] = self.target_encoders[col].fit_transform(df[col], df[target])
                else:
                    df[f'{col}_target_enc'] = self.target_encoders[col].transform(df[col])
            
            # 移除原始类别列
            df = df.drop(columns=[col])
        
        return df
    
    def _extract_text_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        从文本列中抽取特征
        
        Args:
            df: 输入数据集
            
        Returns:
            包含文本特征的数据集
        """
        for col in self.text_features:
            # 基础文本统计特征
            df[f'{col}_length'] = df[col].astype(str).apply(len)
            df[f'{col}_word_count'] = df[col].astype(str).apply(lambda x: len(x.split()))
            df[f'{col}_avg_word_length'] = df[f'{col}_length'] / (df[f'{col}_word_count'] + 1)
            df[f'{col}_digit_count'] = df[col].astype(str).apply(lambda x: sum(c.isdigit() for c in x))
            df[f'{col}_upper_count'] = df[col].astype(str).apply(lambda x: sum(c.isupper() for c in x))
            
            # TF-IDF特征
            if col not in self.tfidf_vectorizers:
                self.tfidf_vectorizers[col] = TfidfVectorizer(max_features=100, stop_words='english')
                tfidf_matrix = self.tfidf_vectorizers[col].fit_transform(df[col].astype(str))
            else:
                tfidf_matrix = self.tfidf_vectorizers[col].transform(df[col].astype(str))
            
            # 将TF-IDF矩阵转换为DataFrame
            tfidf_df = pd.DataFrame(
                tfidf_matrix.toarray(),
                columns=[f'{col}_tfidf_{i}' for i in range(tfidf_matrix.shape[1])],
                index=df.index
            )
            df = pd.concat([df, tfidf_df], axis=1)
            
            # 移除原始文本列
            df = df.drop(columns=[col])
        
        return df
    
    def _derive_numerical_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        衍生数值特征
        
        Args:
            df: 输入数据集
            
        Returns:
            包含衍生数值特征的数据集
        """
        # 两两特征交叉
        for i in range(len(self.numerical_features)):
            for j in range(i+1, len(self.numerical_features)):
                col1 = self.numerical_features[i]
                col2 = self.numerical_features[j]
                
                # 加减乘除交叉
                df[f'{col1}_add_{col2}'] = df[col1] + df[col2]
                df[f'{col1}_sub_{col2}'] = df[col1] - df[col2]
                df[f'{col1}_mul_{col2}'] = df[col1] * df[col2]
                df[f'{col1}_div_{col2}'] = df[col1] / (df[col2] + 1e-8)
        
        # 统计特征（基于所有数值特征）
        df['numerical_sum'] = df[self.numerical_features].sum(axis=1)
        df['numerical_mean'] = df[self.numerical_features].mean(axis=1)
        df['numerical_std'] = df[self.numerical_features].std(axis=1)
        df['numerical_max'] = df[self.numerical_features].max(axis=1)
        df['numerical_min'] = df[self.numerical_features].min(axis=1)
        df['numerical_median'] = df[self.numerical_features].median(axis=1)
        
        return df
