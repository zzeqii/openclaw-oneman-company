# 用户使用指南

## 1. 模块简介
Coze特征工程模块为自动策略Agent提供完整的特征工程能力，支持自动特征抽取、特征选择、特征转换、特征重要性评估等核心功能。模块支持结构化数据、时间序列数据、文本数据等多种数据类型，兼容分类和回归两类机器学习问题。

## 2. 快速开始

### 2.1 安装依赖
```bash
# 安装poetry（如果未安装）
curl -sSL https://install.python-poetry.org | python3 -

# 安装项目依赖
poetry install
```

### 2.2 启动服务
```bash
# 启动API服务
poetry run python src/main.py
```
服务启动后访问 http://localhost:8000/docs 查看交互式API文档。

### 2.3 基本使用示例
```python
import pandas as pd
from src.feature_engineering import (
    FeatureExtractor, FeatureTransformer,
    FeatureSelector, FeatureEvaluator
)

# 加载数据
df = pd.read_csv("your_data.csv")
target_col = "target"

# 1. 特征抽取
extractor = FeatureExtractor({
    'text_features': ['description'],  # 指定文本特征列
    'id_columns': ['id']                # 指定ID列
})
features = extractor.extract(df, target=target_col)
print(f"抽取后特征数量: {len(features.columns) - 1}")

# 2. 特征转换
transformer = FeatureTransformer({
    'scaling_method': 'standard',       # 标准化
    'enable_discretization': True       # 启用特征离散化
})
transformed = transformer.transform(features, target=target_col)
print(f"转换后特征数量: {len(transformed.columns) - 1}")

# 3. 特征选择
selector = FeatureSelector({
    'correlation_threshold': 0.7,       # 相关系数阈值
    'enable_rfe': False                 # 不使用递归特征消除
})
selected = selector.select(transformed, target=target_col, top_k=20)
print(f"选择后特征数量: {len(selected.columns) - 1}")

# 4. 特征重要性评估
evaluator = FeatureEvaluator()
importance = evaluator.evaluate(selected, target=target_col)
print("特征重要性Top 10:")
print(importance.head(10))

# 导出报告
evaluator.export_report("feature_report.md")
# 绘制特征重要性图
evaluator.plot_feature_importance(save_path="feature_importance.png")
```

## 3. 功能详解

### 3.1 特征抽取功能
特征抽取模块支持自动从原始数据中提取各类特征：

#### 3.1.1 时间特征抽取
自动从时间列中提取以下特征：
- 基本时间特征：年、月、日、时、分、周几、季度
- 衍生特征：是否周末、月中/月末标识、节假日（需要额外配置）
- 时间差特征：多个时间列之间的天数差、小时差等

#### 3.1.2 类别特征编码
对类别特征进行多种方式的编码：
- 基础编码：独热编码、标签编码
- 统计编码：类别计数、类别频率、目标编码
- 低频处理：自动合并出现频率低于1%的稀有类别

#### 3.1.3 文本特征抽取
从文本列中提取以下特征：
- 基础统计：文本长度、词数、平均词长、数字个数、大写字母个数
- TF-IDF特征：Top 100关键词的TF-IDF值
- 语义特征：支持预训练词嵌入（需要额外配置）

#### 3.1.4 数值特征衍生
对数值特征进行交叉衍生：
- 两两交叉：加、减、乘、除
- 统计特征：所有数值特征的总和、均值、标准差、最大值、最小值、中位数

### 3.2 特征转换功能
特征转换模块对特征进行预处理，提升特征质量：

#### 3.2.1 缺失值处理
- 数值特征：支持中位数、均值、众数填充
- 类别特征：支持众数填充、新增"缺失"类别
- 自动添加缺失值标记列，记录哪些特征原本是缺失的

#### 3.2.2 异常值处理
- 检测方法：IQR方法、Z-score方法
- 处理方式：截断异常值到合理范围
- 自动添加异常值标记列

#### 3.2.3 特征缩放
支持多种缩放方式：
- StandardScaler：标准化，均值为0，方差为1
- MinMaxScaler：归一化，缩放到[0,1]区间
- RobustScaler：鲁棒缩放，对异常值不敏感

#### 3.2.4 数学变换
支持多种数学变换：
- 对数变换：适合右偏分布的特征
- 平方根变换：适合计数类特征
- Box-Cox变换：将特征转换为近似正态分布

#### 3.2.5 特征离散化
将连续数值特征离散化：
- 分箱策略：等频分箱、等宽分箱、K-means分箱
- 支持分箱后独热编码
- 默认分箱数：5箱

### 3.3 特征选择功能
特征选择模块自动筛选重要特征，移除无效和冗余特征：

#### 3.3.1 过滤式选择
- 移除低方差特征：默认移除方差低于0.01的特征
- 移除高度相关特征：默认移除相关系数高于0.8的特征对中的一个
- 单变量特征选择：基于卡方检验、F检验、互信息等统计指标选择特征

#### 3.3.2 包裹式选择
- 递归特征消除（RFE）：通过迭代训练模型，逐步移除不重要的特征
- 支持自定义保留的特征数量

#### 3.3.3 嵌入式选择
- 基于树模型的特征重要性选择
- 基于L1正则化的特征选择

### 3.4 特征重要性评估功能
特征评估模块对特征的重要性进行定量评估：

#### 3.4.1 评估方法
- 树模型重要性：基于随机森林、XGBoost等树模型的特征分裂增益
- 排列重要性：通过随机打乱特征值，观察模型性能下降程度
- SHAP重要性：基于SHAP值的特征贡献度（需要安装shap库）

#### 3.4.2 输出结果
- 特征重要性排序
- 模型性能指标（准确率、F1、AUC、MSE、R2等）
- 特征重要性可视化图
- 完整的特征评估报告

## 4. 最佳实践

### 4.1 数据准备
1. 确保数据质量：尽量减少缺失值和异常值
2. 明确问题类型：分类问题还是回归问题
3. 标记特殊列：明确哪些是ID列、文本列、时间列

### 4.2 参数调优
1. 对于高维数据：可以先通过单变量选择减少特征数量，再进行后续处理
2. 对于时间序列数据：关闭默认的随机拆分，使用时间顺序拆分
3. 对于高 cardinality 类别特征：优先使用目标编码而不是独热编码

### 4.3 性能优化
1. 大数据量下：建议先采样小数据集调试参数，再全量运行
2. 特征数量过多时：调整`select_top_k`参数限制最终特征数量
3. 递归特征消除（RFE）比较耗时，大数据量下建议关闭

### 4.4 结果验证
1. 检查特征重要性是否符合业务直觉
2. 验证使用选择后的特征训练的模型性能是否优于原始特征
3. 定期重新运行特征工程流程，适应数据分布变化

## 5. 常见问题

### Q: 运行时报错"ModuleNotFoundError: No module named 'xxx'"
A: 请确保已经运行`poetry install`安装了所有依赖，如果缺少shap库，可以单独安装：`poetry add shap`

### Q: 特征抽取后特征数量过多怎么办？
A: 可以通过以下方式减少特征数量：
1. 调整`select_top_k`参数，保留重要的特征
2. 提高`correlation_threshold`参数，移除更多相关特征
3. 关闭不必要的特征衍生功能，如文本特征、交叉特征等

### Q: 模型性能不理想怎么办？
A: 可以尝试以下优化：
1. 检查原始数据质量，是否有过多缺失值或异常值
2. 调整特征转换参数，尝试不同的缩放方法
3. 调整特征选择参数，保留更多或更少的特征
4. 增加树模型的`n_estimators`参数，提升模型性能

### Q: 如何处理中文文本？
A: 目前默认的文本特征抽取是针对英文的，处理中文需要：
1. 先对文本进行中文分词
2. 替换TfidfVectorizer的分词器为中文分词器
3. 使用中文停用词表

### Q: 支持增量更新吗？
A: 支持。在调用特征转换接口时，设置`fit=False`即可使用已拟合的转换器对新数据进行转换，不需要重新拟合。

## 6. 性能指标
- 单CPU核心处理10万行×100列数据的全流程特征工程耗时约5-10分钟
- 支持多进程加速，自动利用所有可用CPU核心
- 内存占用约为原始数据大小的3-5倍

## 7. 扩展开发
模块采用模块化设计，方便扩展新功能：
1. 新增特征抽取方法：在`feature_extractor.py`中添加新的特征提取函数
2. 新增转换方法：在`feature_transformer.py`中添加新的转换逻辑
3. 新增选择算法：在`feature_selector.py`中添加新的特征选择算法
4. 新增评估方法：在`feature_evaluator.py`中添加新的重要性评估方法
