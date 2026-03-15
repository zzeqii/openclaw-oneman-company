import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, KBinsDiscretizer
from sklearn.impute import SimpleImputer, KNNImputer
from .utils import detect_feature_types
import scipy.stats as stats

class FeatureTransformer:
    """
    特征转换类，支持缺失值处理、异常值处理、标准化、归一化、离散化等功能
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初始化特征转换器
        
        Args:
            config: 配置参数字典，可选
        """
        self.config = config or {}
        self.numerical_features: List[str] = []
        self.categorical_features: List[str] = []
        self.scalers: Dict[str, Any] = {}
        self.imputers: Dict[str, Any] = {}
        self.discretizers: Dict[str, KBinsDiscretizer] = {}
        self.outlier_bounds: Dict[str, Tuple[float, float]] = {}
        
    def transform(self, df: pd.DataFrame, target: Optional[str] = None, fit: bool = True) -> pd.DataFrame:
        """
        特征转换主函数
        
        Args:
            df: 输入数据集
            target: 目标列名
            fit: 是否拟合转换器，False表示使用已拟合的转换器
            
        Returns:
            转换后的数据集
        """
        df = df.copy()
        
        # 检测特征类型
        self.numerical_features, self.categorical_features, _ = detect_feature_types(df)
        
        # 移除目标列
        if target and target in self.numerical_features:
            self.numerical_features.remove(target)
        
        # 1. 缺失值处理
        df = self._handle_missing_values(df, fit)
        
        # 2. 异常值处理
        df = self._handle_outliers(df, fit)
        
        # 3. 数值特征转换
        if self.numerical_features:
            df = self._transform_numerical_features(df, fit)
        
        # 4. 特征离散化
        if self.config.get('enable_discretization', True):
            df = self._discretize_features(df, fit)
        
        return df
    
    def _handle_missing_values(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        处理缺失值
        
        Args:
            df: 输入数据集
            fit: 是否拟合填充器
            
        Returns:
            处理缺失值后的数据集
        """
        # 数值特征缺失值处理
        if self.numerical_features:
            if fit:
                imputer = SimpleImputer(strategy=self.config.get('numerical_impute_strategy', 'median'))
                self.imputers['numerical'] = imputer.fit(df[self.numerical_features])
            
            df[self.numerical_features] = self.imputers['numerical'].transform(df[self.numerical_features])
            
            # 添加缺失值标记
            for col in self.numerical_features:
                if df[col].isna().any():
                    df[f'{col}_missing'] = df[col].isna().astype(int)
        
        # 类别特征缺失值处理
        if self.categorical_features:
            if fit:
                imputer = SimpleImputer(strategy=self.config.get('categorical_impute_strategy', 'most_frequent'))
                self.imputers['categorical'] = imputer.fit(df[self.categorical_features])
            
            df[self.categorical_features] = self.imputers['categorical'].transform(df[self.categorical_features])
        
        return df
    
    def _handle_outliers(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        处理异常值
        
        Args:
            df: 输入数据集
            fit: 是否计算异常值边界
            
        Returns:
            处理异常值后的数据集
        """
        outlier_method = self.config.get('outlier_method', 'iqr')
        outlier_threshold = self.config.get('outlier_threshold', 1.5)
        
        for col in self.numerical_features:
            if fit:
                if outlier_method == 'iqr':
                    q1 = df[col].quantile(0.25)
                    q3 = df[col].quantile(0.75)
                    iqr = q3 - q1
                    lower_bound = q1 - outlier_threshold * iqr
                    upper_bound = q3 + outlier_threshold * iqr
                elif outlier_method == 'zscore':
                    mean = df[col].mean()
                    std = df[col].std()
                    lower_bound = mean - outlier_threshold * std
                    upper_bound = mean + outlier_threshold * std
                else:
                    continue
                
                self.outlier_bounds[col] = (lower_bound, upper_bound)
            
            lower_bound, upper_bound = self.outlier_bounds[col]
            
            # 截断异常值
            df[col] = df[col].clip(lower=lower_bound, upper=upper_bound)
            
            # 添加异常值标记
            df[f'{col}_outlier'] = ((df[col] < lower_bound) | (df[col] > upper_bound)).astype(int)
        
        return df
    
    def _transform_numerical_features(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        转换数值特征（标准化/归一化）
        
        Args:
            df: 输入数据集
            fit: 是否拟合缩放器
            
        Returns:
            转换后的数据集
        """
        scaling_method = self.config.get('scaling_method', 'standard')
        
        if fit:
            if scaling_method == 'standard':
                scaler = StandardScaler()
            elif scaling_method == 'minmax':
                scaler = MinMaxScaler()
            elif scaling_method == 'robust':
                scaler = RobustScaler()
            else:
                return df
            
            self.scalers['numerical'] = scaler.fit(df[self.numerical_features])
        
        df[self.numerical_features] = self.scalers['numerical'].transform(df[self.numerical_features])
        
        # 对数转换（可选）
        if self.config.get('enable_log_transform', True):
            for col in self.numerical_features:
                if (df[col] > 0).all():
                    df[f'{col}_log'] = np.log1p(df[col])
        
        # 平方根转换（可选）
        if self.config.get('enable_sqrt_transform', False):
            for col in self.numerical_features:
                if (df[col] >= 0).all():
                    df[f'{col}_sqrt'] = np.sqrt(df[col])
        
        # Box-Cox转换（可选，仅对正数据有效）
        if self.config.get('enable_boxcox_transform', False):
            for col in self.numerical_features:
                if (df[col] > 0).all() and fit:
                    transformed, _ = stats.boxcox(df[col] + 1e-8)
                    df[f'{col}_boxcox'] = transformed
        
        return df
    
    def _discretize_features(self, df: pd.DataFrame, fit: bool = True) -> pd.DataFrame:
        """
        特征离散化（分箱）
        
        Args:
            df: 输入数据集
            fit: 是否拟合离散化器
            
        Returns:
            包含离散化特征的数据集
        """
        n_bins = self.config.get('discretization_bins', 5)
        strategy = self.config.get('discretization_strategy', 'quantile')
        
        for col in self.numerical_features:
            if fit:
                discretizer = KBinsDiscretizer(n_bins=n_bins, encode='ordinal', strategy=strategy)
                self.discretizers[col] = discretizer.fit(df[[col]])
            
            df[f'{col}_bin'] = self.discretizers[col].transform(df[[col]]).flatten()
            
            # 分箱独热编码
            if self.config.get('discretization_onehot', True):
                dummies = pd.get_dummies(df[f'{col}_bin'], prefix=f'{col}_bin', drop_first=True)
                df = pd.concat([df, dummies], axis=1)
        
        return df
