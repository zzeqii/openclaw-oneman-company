import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, mean_squared_error,
    mean_absolute_error, r2_score
)
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.inspection import permutation_importance
import matplotlib.pyplot as plt
import seaborn as sns
from .utils import split_dataset

class FeatureEvaluator:
    """
    特征重要性评估类，支持多种评估方法和可视化
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        初始化特征评估器
        
        Args:
            config: 配置参数字典，可选
        """
        self.config = config or {}
        self.feature_importance: pd.DataFrame = pd.DataFrame()
        self.model_performance: Dict[str, float] = {}
        self.is_classification: bool = False
        
    def evaluate(self, df: pd.DataFrame, target: str, method: str = 'all') -> pd.DataFrame:
        """
        特征重要性评估主函数
        
        Args:
            df: 输入数据集
            target: 目标列名
            method: 评估方法，可选 'tree', 'permutation', 'shap', 'all'
            
        Returns:
            特征重要性DataFrame
        """
        df = df.copy()
        X = df.drop(columns=[target])
        y = df[target]
        
        # 确定问题类型
        self.is_classification = y.dtype == 'object' or y.nunique() < 10
        
        # 拆分数据集
        X_train, X_test, y_train, y_test = split_dataset(df, target)
        
        # 训练基准模型
        model = self._train_model(X_train, y_train)
        
        # 评估模型性能
        self._evaluate_model_performance(model, X_test, y_test)
        
        # 计算特征重要性
        importance_dfs = []
        
        if method in ['tree', 'all']:
            tree_importance = self._get_tree_importance(model, X.columns)
            importance_dfs.append(tree_importance)
        
        if method in ['permutation', 'all']:
            perm_importance = self._get_permutation_importance(model, X_test, y_test, X.columns)
            importance_dfs.append(perm_importance)
        
        if method in ['shap', 'all']:
            try:
                shap_importance = self._get_shap_importance(model, X_test, X.columns)
                importance_dfs.append(shap_importance)
            except ImportError:
                print("SHAP库未安装，跳过SHAP重要性计算")
        
        # 合并所有重要性结果
        if not importance_dfs:
            raise ValueError("没有可用的特征重要性计算方法")
        
        # 合并并平均重要性
        self.feature_importance = importance_dfs[0]
        for df_imp in importance_dfs[1:]:
            self.feature_importance = self.feature_importance.merge(
                df_imp, on='feature', how='outer', suffixes=('', '_y')
            )
        
        # 计算平均重要性
        importance_columns = [col for col in self.feature_importance.columns if col.endswith('_importance')]
        self.feature_importance['importance'] = self.feature_importance[importance_columns].mean(axis=1)
        
        # 归一化重要性
        self.feature_importance['importance'] = (
            self.feature_importance['importance'] / self.feature_importance['importance'].sum()
        )
        
        # 按重要性排序
        self.feature_importance = self.feature_importance.sort_values(
            'importance', ascending=False
        ).reset_index(drop=True)
        
        return self.feature_importance
    
    def _train_model(self, X_train: pd.DataFrame, y_train: pd.Series) -> Any:
        """
        训练基准模型
        
        Args:
            X_train: 训练集特征
            y_train: 训练集目标
            
        Returns:
            训练好的模型
        """
        if self.is_classification:
            model = RandomForestClassifier(
                n_estimators=self.config.get('n_estimators', 200),
                max_depth=self.config.get('max_depth', 10),
                random_state=42,
                n_jobs=-1
            )
        else:
            model = RandomForestRegressor(
                n_estimators=self.config.get('n_estimators', 200),
                max_depth=self.config.get('max_depth', 10),
                random_state=42,
                n_jobs=-1
            )
        
        model.fit(X_train, y_train)
        return model
    
    def _evaluate_model_performance(self, model: Any, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, float]:
        """
        评估模型性能
        
        Args:
            model: 训练好的模型
            X_test: 测试集特征
            y_test: 测试集目标
            
        Returns:
            性能指标字典
        """
        y_pred = model.predict(X_test)
        
        if self.is_classification:
            self.model_performance = {
                'accuracy': accuracy_score(y_test, y_pred),
                'f1_score': f1_score(y_test, y_pred, average='weighted'),
            }
            # 二分类问题额外计算AUC
            if len(np.unique(y_test)) == 2:
                y_pred_proba = model.predict_proba(X_test)[:, 1]
                self.model_performance['roc_auc'] = roc_auc_score(y_test, y_pred_proba)
        else:
            self.model_performance = {
                'mse': mean_squared_error(y_test, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                'mae': mean_absolute_error(y_test, y_pred),
                'r2': r2_score(y_test, y_pred)
            }
        
        return self.model_performance
    
    def _get_tree_importance(self, model: Any, feature_names: List[str]) -> pd.DataFrame:
        """
        获取树模型的特征重要性
        
        Args:
            model: 训练好的树模型
            feature_names: 特征名称列表
            
        Returns:
            特征重要性DataFrame
        """
        importances = model.feature_importances_
        df = pd.DataFrame({
            'feature': feature_names,
            'tree_importance': importances
        })
        # 归一化
        df['tree_importance'] = df['tree_importance'] / df['tree_importance'].sum()
        return df
    
    def _get_permutation_importance(self, model: Any, X_test: pd.DataFrame, y_test: pd.Series, 
                                   feature_names: List[str]) -> pd.DataFrame:
        """
        获取排列重要性
        
        Args:
            model: 训练好的模型
            X_test: 测试集特征
            y_test: 测试集目标
            feature_names: 特征名称列表
            
        Returns:
            特征重要性DataFrame
        """
        result = permutation_importance(
            model, X_test, y_test,
            n_repeats=self.config.get('permutation_repeats', 5),
            random_state=42,
            n_jobs=-1
        )
        
        importances = result.importances_mean
        # 处理负数重要性
        importances = np.maximum(importances, 0)
        
        df = pd.DataFrame({
            'feature': feature_names,
            'permutation_importance': importances
        })
        # 归一化
        if df['permutation_importance'].sum() > 0:
            df['permutation_importance'] = df['permutation_importance'] / df['permutation_importance'].sum()
        return df
    
    def _get_shap_importance(self, model: Any, X_test: pd.DataFrame, feature_names: List[str]) -> pd.DataFrame:
        """
        获取SHAP特征重要性
        
        Args:
            model: 训练好的模型
            X_test: 测试集特征
            feature_names: 特征名称列表
            
        Returns:
            特征重要性DataFrame
        """
        import shap
        
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X_test)
        
        # 处理分类问题的SHAP值
        if self.is_classification and len(shap_values) == 2:
            shap_values = shap_values[1]  # 取正类的SHAP值
        
        importances = np.mean(np.abs(shap_values), axis=0)
        
        df = pd.DataFrame({
            'feature': feature_names,
            'shap_importance': importances
        })
        # 归一化
        df['shap_importance'] = df['shap_importance'] / df['shap_importance'].sum()
        return df
    
    def plot_feature_importance(self, top_n: int = 20, save_path: Optional[str] = None) -> None:
        """
        绘制特征重要性柱状图
        
        Args:
            top_n: 显示前n个最重要的特征
            save_path: 图片保存路径，可选
        """
        if self.feature_importance.empty:
            raise ValueError("请先调用evaluate方法计算特征重要性")
        
        plt.figure(figsize=(12, 8))
        data = self.feature_importance.head(top_n).sort_values('importance', ascending=True)
        
        sns.barplot(x='importance', y='feature', data=data, palette='viridis')
        
        plt.title(f'Top {top_n} Feature Importance', fontsize=16)
        plt.xlabel('Importance', fontsize=12)
        plt.ylabel('Feature', fontsize=12)
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()
    
    def plot_importance_correlation(self, save_path: Optional[str] = None) -> None:
        """
        绘制不同重要性方法之间的相关性热图
        
        Args:
            save_path: 图片保存路径，可选
        """
        if self.feature_importance.empty:
            raise ValueError("请先调用evaluate方法计算特征重要性")
        
        importance_columns = [col for col in self.feature_importance.columns if col.endswith('_importance')]
        if len(importance_columns) < 2:
            print("只有一种重要性计算方法，无法绘制相关性热图")
            return
        
        corr = self.feature_importance[importance_columns].corr()
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(corr, annot=True, cmap='coolwarm', vmin=-1, vmax=1, center=0)
        plt.title('Correlation between Feature Importance Methods', fontsize=14)
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()
    
    def get_top_features(self, top_n: int = 10) -> List[str]:
        """
        获取前n个最重要的特征
        
        Args:
            top_n: 前n个特征
            
        Returns:
            特征名称列表
        """
        if self.feature_importance.empty:
            raise ValueError("请先调用evaluate方法计算特征重要性")
        
        return self.feature_importance.head(top_n)['feature'].tolist()
    
    def export_report(self, save_path: str) -> None:
        """
        导出特征评估报告
        
        Args:
            save_path: 报告保存路径
        """
        if self.feature_importance.empty:
            raise ValueError("请先调用evaluate方法计算特征重要性")
        
        report = []
        report.append("# 特征重要性评估报告\n")
        report.append("## 模型性能\n")
        
        for metric, value in self.model_performance.items():
            report.append(f"- {metric}: {value:.4f}")
        
        report.append("\n## 特征重要性Top 20\n")
        report.append(self.feature_importance.head(20).to_markdown(index=False))
        
        report.append("\n## 特征重要性统计\n")
        report.append(f"- 总特征数: {len(self.feature_importance)}")
        report.append(f"- 前10个特征累计重要性: {self.feature_importance.head(10)['importance'].sum():.4f}")
        report.append(f"- 前20个特征累计重要性: {self.feature_importance.head(20)['importance'].sum():.4f}")
        
        with open(save_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(report))
