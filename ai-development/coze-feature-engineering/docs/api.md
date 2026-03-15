# API接口文档

## 基础信息
- 服务地址：http://localhost:8000
- 接口前缀：/api/v1/feature
- 数据格式：JSON
- 文档地址：http://localhost:8000/docs (Swagger UI)

## 接口列表

### 1. 特征抽取接口
**POST /api/v1/feature/extract**

从输入数据中自动抽取各类特征。

#### 请求参数
```json
{
  "data": [
    {
      "id": 1,
      "age": 25,
      "gender": "男",
      "register_time": "2023-01-01 10:00:00",
      "description": "新用户"
    }
  ],
  "target": "is_paid",
  "text_features": ["description"],
  "id_columns": ["id"],
  "config": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | array[object] | 是 | 输入数据集，每个元素为一个样本 |
| target | string | 否 | 目标列名，用于目标编码 |
| text_features | array[string] | 否 | 文本特征列名列表 |
| id_columns | array[string] | 否 | ID列名列表，会被从特征中移除 |
| config | object | 否 | 额外配置参数 |

#### 响应示例
```json
{
  "features": [
    {
      "age": 25,
      "gender_count": 100,
      "gender_freq": 0.3,
      "register_time_year": 2023,
      "register_time_month": 1,
      "description_length": 3,
      "is_paid": 0
    }
  ],
  "feature_names": ["age", "gender_count", "gender_freq", "..."],
  "message": "成功抽取25个特征"
}
```

---

### 2. 特征转换接口
**POST /api/v1/feature/transform**

对特征进行标准化、归一化、缺失值处理、离散化等转换操作。

#### 请求参数
```json
{
  "data": [
    {
      "age": 25,
      "income": 10000,
      "gender": "男"
    }
  ],
  "target": "is_paid",
  "scaling_method": "standard",
  "numerical_impute_strategy": "median",
  "categorical_impute_strategy": "most_frequent",
  "enable_discretization": true,
  "discretization_bins": 5,
  "fit": true,
  "config": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | array[object] | 是 | 输入数据集 |
| target | string | 否 | 目标列名 |
| scaling_method | string | 否 | 缩放方法：standard(默认), minmax, robust |
| numerical_impute_strategy | string | 否 | 数值特征填充策略：median(默认), mean, most_frequent |
| categorical_impute_strategy | string | 否 | 类别特征填充策略：most_frequent(默认) |
| enable_discretization | boolean | 否 | 是否启用特征离散化，默认true |
| discretization_bins | integer | 否 | 离散化分箱数，默认5 |
| fit | boolean | 否 | 是否拟合转换器，默认true，增量预测时设为false |
| config | object | 否 | 额外配置参数 |

#### 响应示例
```json
{
  "transformed_features": [
    {
      "age": 0.23,
      "income": -0.56,
      "age_bin": 2,
      "gender_A": 1,
      "is_paid": 0
    }
  ],
  "feature_names": ["age", "income", "age_bin", "..."],
  "message": "成功转换30个特征"
}
```

---

### 3. 特征选择接口
**POST /api/v1/feature/select**

自动选择重要特征，移除冗余和无效特征。

#### 请求参数
```json
{
  "data": [
    {
      "feature1": 0.23,
      "feature2": -0.56,
      "feature3": 1.2,
      "is_paid": 0
    }
  ],
  "target": "is_paid",
  "top_k": 20,
  "correlation_threshold": 0.8,
  "variance_threshold": 0.01,
  "enable_rfe": false,
  "config": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | array[object] | 是 | 输入数据集 |
| target | string | 是 | 目标列名 |
| top_k | integer | 否 | 选择前k个特征，默认自动选择 |
| correlation_threshold | float | 否 | 相关系数阈值，默认0.8，高于此值的相关特征会被移除 |
| variance_threshold | float | 否 | 方差阈值，默认0.01，低于此值的低方差特征会被移除 |
| enable_rfe | boolean | 否 | 是否启用递归特征消除，默认false |
| config | object | 否 | 额外配置参数 |

#### 响应示例
```json
{
  "selected_features": [
    {
      "feature1": 0.23,
      "feature3": 1.2,
      "is_paid": 0
    }
  ],
  "feature_names": ["feature1", "feature3", "..."],
  "feature_scores": [
    {"feature": "feature1", "score": 0.95},
    {"feature": "feature3", "score": 0.87}
  ],
  "message": "成功选择15个特征"
}
```

---

### 4. 特征重要性评估接口
**POST /api/v1/feature/evaluate**

评估特征的重要性，输出特征重要性排序和模型性能指标。

#### 请求参数
```json
{
  "data": [
    {
      "feature1": 0.23,
      "feature2": -0.56,
      "is_paid": 0
    }
  ],
  "target": "is_paid",
  "method": "all",
  "n_estimators": 200,
  "max_depth": 10,
  "config": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | array[object] | 是 | 输入数据集 |
| target | string | 是 | 目标列名 |
| method | string | 否 | 评估方法：all(默认), tree, permutation, shap |
| n_estimators | integer | 否 | 树模型数量，默认200 |
| max_depth | integer | 否 | 树的最大深度，默认10 |
| config | object | 否 | 额外配置参数 |

#### 响应示例
```json
{
  "feature_importance": [
    {"feature": "feature1", "importance": 0.35, "tree_importance": 0.32, "permutation_importance": 0.38},
    {"feature": "feature2", "importance": 0.28, "tree_importance": 0.30, "permutation_importance": 0.26}
  ],
  "model_performance": {
    "accuracy": 0.89,
    "f1_score": 0.88,
    "roc_auc": 0.92
  },
  "top_features": ["feature1", "feature2", "..."],
  "message": "成功评估15个特征的重要性"
}
```

---

### 5. 全流程特征处理接口
**POST /api/v1/feature/pipeline**

一站式特征工程全流程处理，包含特征抽取、转换、选择、评估四个步骤。

#### 请求参数
```json
{
  "data": [
    {
      "id": 1,
      "age": 25,
      "gender": "男",
      "register_time": "2023-01-01",
      "description": "新用户",
      "is_paid": 0
    }
  ],
  "target": "is_paid",
  "text_features": ["description"],
  "id_columns": ["id"],
  "select_top_k": 20,
  "evaluate_method": "all",
  "config": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | array[object] | 是 | 输入原始数据集 |
| target | string | 是 | 目标列名 |
| text_features | array[string] | 否 | 文本特征列名列表 |
| id_columns | array[string] | 否 | ID列名列表 |
| select_top_k | integer | 否 | 特征选择保留的特征数量 |
| evaluate_method | string | 否 | 特征评估方法，默认all |
| config | object | 否 | 额外配置参数 |

#### 响应示例
```json
{
  "final_features": [
    {
      "age": 0.23,
      "gender_target_enc": 0.45,
      "register_time_month": 1,
      "description_length": 3,
      "is_paid": 0
    }
  ],
  "feature_names": ["age", "gender_target_enc", "..."],
  "feature_importance": [
    {"feature": "age", "importance": 0.35},
    {"feature": "gender_target_enc", "importance": 0.28}
  ],
  "model_performance": {
    "accuracy": 0.89,
    "f1_score": 0.88
  },
  "message": "全流程处理完成，最终得到18个优质特征"
}
```

---

## 错误码说明
| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

## 调用示例
### Python调用示例
```python
import requests
import pandas as pd

# 准备数据
data = pd.read_csv("your_data.csv").to_dict(orient='records')

# 调用全流程接口
response = requests.post(
    "http://localhost:8000/api/v1/feature/pipeline",
    json={
        "data": data,
        "target": "is_paid",
        "text_features": ["description"],
        "select_top_k": 20
    }
)

result = response.json()
print(f"处理结果: {result['message']}")
print(f"最终特征数量: {len(result['feature_names'])}")
print(f"模型准确率: {result['model_performance']['accuracy']}")
```
