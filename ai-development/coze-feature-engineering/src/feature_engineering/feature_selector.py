import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_selection import (
    VarianceThreshold, SelectKBest, chi2, f_classif, f_regression,
    mutual_info_classif, mutual_info_regression, RFE, SelectFromModel
)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from .utils import detect_feature_types, remove_highly_correlated_features

class FeatureSelector:
    """
    特征选择类，支持多种特征选择算法
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初始化特征选择器
        
        Args:
            config: 配置参数字典，可选
        """
        self.config = config or {}
        self.selected_features: List[str] = []
        self.selectors: Dict[str, Any] = {}
        self.feature_scores: Dict[str, float] = {}
        
    def select(self, df: pd.DataFrame, target: str, top_k: Optional[int] = None) -> pd.DataFrame:
        """
        特征选择主函数
        
        Args:
            df: 输入数据集
            target: 目标列名
            top_k: 选择前k个特征，默认自动选择最优数量
            
        Returns:
            包含选择后特征的数据集
        """
        df = df.copy()
        X = df.drop(columns=[target])
        y = df[target]
        
        # 确定问题类型
        is_classification = y.dtype == 'object' or y.nunique() < 10
        
        # 1. 移除低方差特征
        X = self._remove_low_variance_features(X)
        
        # 2. 移除高度相关特征
        X = remove_highly_correlated_features(
            X, 
            threshold=self.config.get('correlation_threshold', 0.8)
        )
        
        # 3. 单变量特征选择
        X = self._univariate_feature_selection(X, y, is_classification)
        
        # 4. 基于模型的特征选择
        X = self._model_based_feature_selection(X, y, is_classification)
        
        # 5. 递归特征消除（可选）
        if self.config.get('enable_rfe', False):
            X = self._recursive_feature_elimination(X, y, is_classification, top_k)
        
        # 选择top_k个特征
        if top_k and len(X.columns) > top_k:
            # 按特征重要性排序选择前k个
            sorted_features = sorted(
                self.feature_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )[:top_k]
            self.selected_features = [f[0] for f in sorted_features]
            X = X[self.selected_features]
        else:
            self.selected_features = X.columns.tolist()
        
        # 添加目标列
        X[target] = y.values
        
        return X
    
    def _remove_low_variance_features(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        移除低方差特征
        
        Args:
            X: 特征数据集
            
        Returns:
            移除低方差特征后的数据集
        """
        threshold = self.config.get('variance_threshold', 0.01)
        
        if 'variance' not in self.selectors:
            selector = VarianceThreshold(threshold=threshold)
            self.selectors['variance'] = selector.fit(X)
        
        mask = self.selectors['variance'].get_support()
        selected_cols = X.columns[mask].tolist()
        
        return X[selected_cols]
    
    def _univariate_feature_selection(self, X: pd.DataFrame, y: pd.Series, is_classification: bool) -> pd.DataFrame:
        """
        单变量特征选择
        
        Args:
            X: 特征数据集
            y: 目标列
            is_classification: 是否是分类问题
            
        Returns:
            选择后的特征数据集
        """
        k = self.config.get('univariate_k', 'all')
        
        if is_classification:
            # 分类问题使用卡方检验和互信息
            score_funcs = [
                ('chi2', chi2),
                ('f_classif', f_classif),
                ('mutual_info', mutual_info_classif)
            ]
        else:
            # 回归问题使用F检验和互信息
            score_funcs = [
                ('f_regression', f_regression),
                ('mutual_info', mutual_info_regression)
            ]
        
        all_scores = []
        for name, score_func in score_funcs:
            try:
                if name == 'chi2':
                    # 卡方检验需要非负特征
                    X_non_neg = X.copy()
                    X_non_neg[X_non_neg < 0] = 0
                    selector = SelectKBest(score_func=score_func, k=k)
                    selector.fit(X_non_neg, y)
                else:
                    selector = SelectKBest(score_func=score_func, k=k)
                    selector.fit(X, y)
                
                scores = selector.scores_
                # 标准化分数
                scores = (scores - scores.min()) / (scores.max() - scores.min() + 1e-8)
                all_scores.append(scores)
                
                # 保存特征分数
                for col, score in zip(X.columns, scores):
                    if col not in self.feature_scores:
                        self.feature_scores[col] = []
                    self.feature_scores[col].append(score)
                    
            except Exception as e:
                print(f"单变量选择器 {name} 运行失败: {e}")
                continue
        
        if not all_scores:
            return X
        
        # 平均多个评分函数的结果
        avg_scores = np.mean(all_scores, axis=0)
        mask = avg_scores > self.config.get('univariate_threshold', 0.1)
        selected_cols = X.columns[mask].tolist()
        
        # 更新特征分数为平均值
        for col, score in zip(X.columns, avg_scores):
            self.feature_scores[col] = np.mean(self.feature_scores.get(col, [score]))
        
        return X[selected_cols]
    
    def _model_based_feature_selection(self, X: pd.DataFrame, y: pd.Series, is_classification: bool) -> pd.DataFrame:
        """
        基于模型的特征选择
        
        Args:
            X: 特征数据集
            y: 目标列
            is_classification: 是否是分类问题
            
        Returns:
            选择后的特征数据集
        """
        if is_classification:
            model = RandomForestClassifier(
                n_estimators=self.config.get('n_estimators', 100),
                random_state=42,
                n_jobs=-1
            )
        else:
            model = RandomForestRegressor(
                n_estimators=self.config.get('n_estimators', 100),
                random_state=42,
                n_jobs=-1
            )
        
        if 'model_based' not in self.selectors:
            selector = SelectFromModel(model, threshold=self.config.get('model_threshold', 'median'))
            self.selectors['model_based'] = selector.fit(X, y)
        
        mask = self.selectors['model_based'].get_support()
        selected_cols = X.columns[mask].tolist()
        
        # 获取特征重要性
        importances = self.selectors['model_based'].estimator_.feature_importances_
        # 标准化重要性
        importances = (importances - importances.min()) / (importances.max() - importances.min() + 1e-8)
        
        # 更新特征分数
        for col, importance in zip(X.columns, importances):
            if col in self.feature_scores:
                self.feature_scores[col] = (self.feature_scores[col] + importance) / 2
            else:
                self.feature_scores[col] = importance
        
        return X[selected_cols]
    
    def _recursive_feature_elimination(self, X: pd.DataFrame, y: pd.Series, is_classification: bool, top_k: Optional[int] = None) -> pd.DataFrame:
        """
        递归特征消除
        
        Args:
            X: 特征数据集
            y: 目标列
            is_classification: 是否是分类问题
            top_k: 选择前k个特征
            
        Returns:
            选择后的特征数据集
        """
        if top_k is None:
            n_features_to_select = max(1, int(len(X.columns) * 0.5))
        else:
            n_features_to_select = min(top_k, len(X.columns))
        
        if is_classification:
            estimator = LogisticRegression(max_iter=1000, random_state=42)
        else:
            estimator = LinearRegression()
        
        if 'rfe' not in self.selectors:
            selector = RFE(
                estimator=estimator,
                n_features_to_select=n_features_to_select,
                step=self.config.get('rfe_step', 1)
            )
            self.selectors['rfe'] = selector.fit(X, y)
        
        mask = self.selectors['rfe'].get_support()
        selected_cols = X.columns[mask].tolist()
        
        # 更新特征分数
        rfe_ranking = self.selectors['rfe'].ranking_
        max_rank = rfe_ranking.max()
        for col, rank in zip(X.columns, rfe_ranking):
            # 排名越靠前分数越高
            score = (max_rank - rank + 1) / max_rank
            if col in self.feature_scores:
                self.feature_scores[col] = (self.feature_scores[col] + score) / 2
            else:
                self.feature_scores[col] = score
        
        return X[selected_cols]
    
    def get_feature_scores(self) -> pd.DataFrame:
        """
        获取所有特征的评分
        
        Returns:
            特征评分DataFrame
        """
        scores = []
        for feature, score in self.feature_scores.items():
            scores.append({
                'feature': feature,
                'score': score
            })
        
        return pd.DataFrame(scores).sort_values('score', ascending=False).reset_index(drop=True)
