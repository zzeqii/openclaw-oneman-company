# 策略生成大师（Strategy Master）
企业内部自用智能策略生成Agent，部署在字节跳动Coze平台
---
## 🎯 核心功能
### 1. 数据接入层
- ✅ 多源数据导入：支持CSV/JSON/HIVE/MySQL数据导入
- ✅ 数据预处理：自动清洗、缺失值填充、异常值处理
- ✅ SQL操作支持：支持多表join、自定义SQL查询
- ✅ 业务规则约束：支持自定义业务规则过滤，不符合规则的数据自动剔除
### 2. 特征工程层
- ✅ 自动特征抽取：
  - 有监督场景：基于标签自动抽取高相关性特征组合
  - 无监督场景：基于聚类算法自动发现团伙簇特征
- ✅ 特征选择：自动筛选高重要性特征，去除冗余特征
- ✅ 特征转换：支持归一化、标准化、编码、交叉特征生成
- ✅ 特征重要性评估：输出特征重要性排序报告
### 3. 模型训练层
- ✅ 算法自动选择：根据数据类型和任务类型自动匹配最优算法
  - 有监督场景：scikit-learn、XGBoost、LightGBM、CatBoost
  - 无监督场景：kmeans、leiden、DBSCAN、层次聚类
- ✅ 超参数自动调优：基于贝叶斯优化自动搜索最优超参数组合
- ✅ 交叉验证：支持K折交叉验证，确保模型泛化能力
- ✅ 多模型对比：自动训练多个模型，输出最优模型
### 4. 评估输出层
- ✅ 多维度评估：输出召回率、精确率、F1值、P95/P99准确率、AUC等指标
- ✅ 效能评估报告：可视化展示模型效果、特征重要性、混淆矩阵
- ✅ 最优特征组合清单：输出TopN高价值特征组合及权重
- ✅ 可部署策略代码：自动生成可直接部署的Python策略代码
- ✅ Airflow调度脚本：自动生成Airflow DAG调度脚本，支持定时运行
---
## 📦 技术栈
| 层级 | 技术选型 |
|------|----------|
| 数据处理 | Pandas、NumPy、PySpark |
| 特征工程 | scikit-learn、Featuretools |
| 模型算法 | XGBoost、LightGBM、CatBoost、scikit-learn、kmeans、leiden |
| 超参数优化 | Optuna、Hyperopt |
| 调度 | Apache Airflow |
| 可视化 | Matplotlib、Seaborn、Plotly |
| 部署 | Coze平台函数计算、Docker |
---
## 🚀 快速开始
### 安装依赖
```bash
pip install -r requirements.txt
```
### 运行示例
```python
from strategy_master import StrategyGenerator
# 初始化生成器
generator = StrategyGenerator()
# 导入数据
generator.load_data('data/test_data.csv', label_column='label')
# 自动生成策略
result = generator.generate(strategy_type='supervised', target_metric='recall', min_p95_accuracy=0.95)
# 输出结果
print(result['feature_list']) # 最优特征组合
print(result['model']) # 训练好的模型
print(result['deploy_code']) # 可部署代码
# 生成评估报告
result.generate_report('report/result.html')
```
---
## 📅 开发节奏（7天交付）
| 时间 | 交付内容 | 完成状态 |
|------|----------|----------|
| Day1（3.13） | 需求确认+架构设计+项目初始化 | ✅ 已完成 |
| Day2（3.14） | 数据接入+预处理模块 | 🔄 开发中 |
| Day3（3.15） | 特征工程模块 | ⏳ 待开发 |
| Day4（3.16） | 模型训练+超参调优模块 | ⏳ 待开发 |
| Day5（3.17） | 评估输出+报告生成模块 | ⏳ 待开发 |
| Day6（3.18） | 策略代码+Airflow调度模块 | ⏳ 待开发 |
| Day7（3.19） | 功能测试+示例演示 | ⏳ 待开发 |
| 部署日（3.20） | Coze平台部署包+文档 | ⏳ 待开发 |
---
## 📊 验收标准
✅ 结构化样本数据输入后，自动生成特征组合，验证集P95准确率≥95%
✅ 有标签场景：支持选择有监督模型，基于标签评估输出对应指标
✅ 无标签场景：通过聚类方式自动找到团伙簇特征
✅ 输出可直接部署的Python策略代码和Airflow调度脚本
✅ 输出完整的效能评估报告和特征重要性清单
---
## 📁 项目结构
```
strategy_master/
├── data/               # 测试数据集
├── src/                # 核心代码
│   ├── data_loader.py  # 数据接入模块
│   ├── preprocess.py   # 数据预处理模块
│   ├── feature_engine.py # 特征工程模块
│   ├── model_trainer.py # 模型训练模块
│   ├── evaluator.py    # 评估输出模块
│   └── deploy_generator.py # 部署代码生成模块
├── tests/              # 测试用例
├── report/             # 评估报告输出目录
├── examples/           # 使用示例
├── requirements.txt    # 依赖清单
├── README.md           # 项目说明
└── deploy/             # Coze平台部署包
```