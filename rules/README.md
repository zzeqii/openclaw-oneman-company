# OpenClaw 规则引擎配置

## 概述
规则引擎基于 JSON Rules Engine 实现，支持自定义业务规则、安全策略、工作流控制等。

## 目录结构
```
rules/
├── policies/           # 规则策略文件目录
│   └── default.json    # 默认规则集
└── README.md           # 本文档
```

## 规则编写规范
每个规则文件为 JSON 格式，包含一个 rules 数组，每个规则结构如下：
```json
{
  "id": "规则唯一标识",
  "name": "规则名称",
  "description": "规则描述",
  "conditions": {
    // 规则条件，支持 all/any 组合
    "all": [
      {
        "fact": "事实字段名",
        "operator": "操作符",
        "value": "匹配值"
      }
    ]
  },
  "event": {
    "type": "事件类型（block/log/set-parameter/alert等）",
    "params": {
      // 事件参数
    }
  }
}
```

## 支持的操作符
- 比较操作符：equal, notEqual, lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual
- 包含操作符：in, notIn, contains, doesNotContain
- 正则操作符：regexMatch, regexNotMatch
- 时间操作符：between, notBetween
- 逻辑操作符：all, any

## 内置事实字段
| 字段名 | 类型 | 描述 |
|--------|------|------|
| action-type | string | 操作类型（shell-command/skill-execution/external-message等） |
| user-locale | string | 用户区域设置（zh-CN/en-US等） |
| current-time | string | 当前时间（HH:mm格式） |
| weekday | number | 星期几（1-5代表周一到周五，6-7代表周末） |
| task-priority | string | 任务优先级（high/medium/low） |
| skill-category | string | 技能分类（business/productivity/utility等） |
| command | string | 执行的Shell命令 |
| content | string | 消息/内容文本 |

## 事件类型
| 类型 | 描述 |
|------|------|
| block | 阻止操作执行 |
| log | 记录日志 |
| alert | 发送告警通知 |
| set-parameter | 设置运行时参数 |
| redirect | 重定向操作 |
| approve | 自动审批操作 |

## 规则加载
- 系统启动时自动加载 `policies/` 目录下所有 `.json` 规则文件
- 规则修改后无需重启，实时生效
- 规则冲突时按优先级执行（可在规则中添加 priority 字段设置优先级，数值越大优先级越高）

## 最佳实践
1. 规则粒度要小，每个规则只做一件事
2. 规则命名清晰，见名知意
3. 敏感操作规则优先设置高优先级
4. 定期审计规则执行日志，优化规则
5. 规则变更前先在测试环境验证
