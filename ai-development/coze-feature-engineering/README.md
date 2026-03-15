# Coze自动策略Agent特征工程模块

## 项目概述
本模块为Coze自动策略Agent提供完整的特征工程能力，支持自动特征抽取、特征选择、特征转换、特征重要性评估等核心功能，帮助用户快速构建高质量的特征数据集，提升策略模型的效果和性能。

## 功能特性
### 1. 自动特征抽取
- 支持结构化数据（CSV、Excel、数据库）的自动特征提取
- 支持时间序列特征自动生成（滑动窗口、时间差分、滚动统计等）
- 支持类别特征自动编码（独热编码、标签编码、目标编码等）
- 支持文本特征自动提取（TF-IDF、词嵌入、主题模型等）
- 支持自定义特征抽取规则

### 2. 特征选择
- 基于统计的特征选择（方差选择、卡方检验、互信息法）
- 基于模型的特征选择（L1正则化、树模型特征重要性）
- 递归特征消除（RFE）
- 特征重要性排序
- 自动去除冗余特征和高度相关特征

### 3. 特征转换
- 数值特征标准化/归一化
- 特征离散化/分箱
- 特征交叉/组合
- 缺失值自动处理（填充、删除、标记）
- 异常值检测与处理

### 4. 特征重要性评估
- 多种评估算法支持（树模型、线性模型、Permutation Importance）
- 特征重要性可视化
- 特征贡献度分析
- 特征稳定性评估
- 特征效果验证

## 技术栈
- Python 3.11+
- Pandas 2.0+：数据处理
- NumPy 1.24+：数值计算
- Scikit-learn 1.3+：机器学习基础库
- LightGBM/XGBoost：树模型特征重要性
- Matplotlib/Seaborn：可视化
- Pydantic 2.0+：数据验证
- FastAPI 0.100+：API服务

## 项目结构
```
coze-feature-engineering/
├── src/
│   ├── feature_engineering/
│   │   ├── __init__.py
│   │   ├── feature_extractor.py    # 特征抽取模块
│   │   ├── feature_selector.py     # 特征选择模块
│   │   ├── feature_transformer.py  # 特征转换模块
│   │   ├── feature_evaluator.py    # 特征重要性评估模块
│   │   └── utils.py                # 工具函数
│   ├── schemas/                    # 数据模型定义
│   │   ├── __init__.py
│   │   └── feature_schemas.py
│   ├── api/                        # API接口
│   │   ├── __init__.py
│   │   └── feature_api.py
│   └── main.py                     # 项目入口
├── tests/                          # 测试用例
│   ├── test_extractor.py
│   ├── test_selector.py
│   ├── test_transformer.py
│   └── test_evaluator.py
├── examples/                       # 使用示例
│   ├── basic_usage.py
│   └── time_series_example.py
├── docs/                           # 文档
│   ├── api.md
│   └── user_guide.md
├── pyproject.toml                  # 依赖配置
└── README.md
```

## 快速开始
### 安装依赖
```bash
poetry install
```

### 基本使用
```python
import pandas as pd
from src.feature_engineering.feature_extractor import FeatureExtractor
from src.feature_engineering.feature_selector import FeatureSelector
from src.feature_engineering.feature_transformer import FeatureTransformer
from src.feature_engineering.feature_evaluator import FeatureEvaluator

# 加载数据
data = pd.read_csv("your_data.csv")
target = "target_column"

# 1. 特征抽取
extractor = FeatureExtractor()
features = extractor.extract(data, target=target)
print("抽取后的特征:", features.columns.tolist())

# 2. 特征转换
transformer = FeatureTransformer()
transformed_features = transformer.transform(features, target=target)
print("转换后的特征:", transformed_features.columns.tolist())

# 3. 特征选择
selector = FeatureSelector()
selected_features = selector.select(transformed_features, target=target, top_k=20)
print("选择后的特征:", selected_features.columns.tolist())

# 4. 特征重要性评估
evaluator = FeatureEvaluator()
importance = evaluator.evaluate(selected_features, target=target)
print("特征重要性:", importance.sort_values("importance", ascending=False))

# 导出结果
importance.to_csv("feature_importance.csv", index=False)
```

### 启动API服务
```bash
poetry run python src/main.py
```
访问 http://localhost:8000/docs 查看API文档

## API接口
- `POST /api/v1/feature/extract`：特征抽取
- `POST /api/v1/feature/transform`：特征转换
- `POST /api/v1/feature/select`：特征选择
- `POST /api/v1/feature/evaluate`：特征重要性评估
- `POST /api/v1/feature/pipeline`：全流程特征处理

## 开发计划
### Day 1：基础框架搭建
- 项目结构初始化
- 特征抽取模块实现
- 特征转换模块实现
- 基础测试用例编写

### Day 2：核心功能开发
- 特征选择模块实现
- 特征重要性评估模块实现
- API接口开发
- 完整测试用例编写

### Day 3：优化与交付
- 性能优化
- 文档完善
- 示例代码编写
- 交付测试

## 许可证
MIT
