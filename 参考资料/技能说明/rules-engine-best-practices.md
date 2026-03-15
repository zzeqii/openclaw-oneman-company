# OpenClaw 规则引擎增强最佳实践

## 1. 架构设计
### 1.1 核心架构
- 规则引擎：JSON Rules Engine v6.1.0
- 规则存储：本地JSON文件，按业务领域分类存储
- 执行模式：同步执行 + 异步审计
- 优先级机制：支持0-1000优先级设置，数值越大优先级越高

### 1.2 目录结构
```
rules/
├── policies/               # 规则策略目录
│   ├── default.json        # 默认通用规则
│   ├── security.json       # 安全相关规则
│   ├── business.json       # 业务流程规则
│   ├── productivity.json   # 生产力相关规则
│   └── compliance.json     # 合规审计规则
├── logs/                   # 规则执行日志
├── tests/                  # 规则测试用例
└── README.md               # 规则引擎文档
```

## 2. 规则分类
### 2.1 安全规则（优先级最高）
- 敏感数据保护：阻止密钥、密码、个人信息等敏感数据外传
- 危险操作拦截：阻止`rm -rf /`、格式化磁盘等危险命令执行
- 权限控制：基于用户角色的操作权限校验
- 访问审计：记录所有高风险操作日志

### 2.2 业务规则
- 工作流自动化：自动处理重复业务流程
- 数据校验：业务数据格式、逻辑正确性校验
- 路由规则：根据业务场景自动选择最优处理路径
- 通知策略：基于场景的智能通知分发

### 2.3 生产力规则
- 时间管理：工作时间/非工作时间智能任务调度
- 优先级排序：自动调整任务执行优先级
- 资源分配：智能分配计算资源和执行配额
- 效率优化：基于使用习惯的个性化优化建议

### 2.4 合规规则
- 内容合规：自动检测和过滤违规内容
- 审计日志：记录所有需要审计的操作
- 数据留存：符合监管要求的数据留存策略
- 定期巡检：自动执行合规检查和报告生成

## 3. 开发规范
### 3.1 规则编写规范
```json
{
  "id": "rule-unique-id",           // 全局唯一ID，使用小写字母+连字符
  "name": "规则名称",                // 中文名称，简洁明了
  "description": "规则详细描述",     // 说明规则用途、适用场景、边界条件
  "priority": 100,                  // 优先级，0-1000，默认500
  "conditions": {                   // 规则条件
    "all": [                        // all表示所有条件都满足，any表示满足任意一个
      {
        "fact": "字段名",
        "operator": "操作符",
        "value": "匹配值",
        "path": "可选，嵌套字段路径"
      }
    ]
  },
  "event": {                        // 触发事件
    "type": "事件类型",             // block/log/alert/set-parameter等
    "params": {                     // 事件参数
      "key": "value"
    }
  }
}
```

### 3.2 操作符列表
| 操作符 | 描述 | 示例 |
|--------|------|------|
| equal | 等于 | `{"operator": "equal", "value": "zh-CN"}` |
| notEqual | 不等于 | `{"operator": "notEqual", "value": "admin"}` |
| lessThan | 小于 | `{"operator": "lessThan", "value": 100}` |
| greaterThan | 大于 | `{"operator": "greaterThan", "value": 18}` |
| in | 在列表中 | `{"operator": "in", "value": [1,2,3,4,5]}` |
| notIn | 不在列表中 | `{"operator": "notIn", "value": ["admin", "root"]}` |
| contains | 包含 | `{"operator": "contains", "value": "敏感词"}` |
| regexMatch | 正则匹配 | `{"operator": "regexMatch", "value": "^1[3-9]\\d{9}$"}` |
| between | 在区间内 | `{"operator": "between", "value": ["09:00", "18:00"]}` |

### 3.3 事件类型
| 类型 | 描述 | 参数 |
|------|------|------|
| block | 阻止操作执行 | message: 阻止原因 |
| log | 记录日志 | level: 日志级别，message: 日志内容 |
| alert | 发送告警 | level: 告警级别，channel: 通知渠道，message: 告警内容 |
| set-parameter | 设置运行时参数 | key: 参数名，value: 参数值 |
| redirect | 重定向操作 | target: 目标处理路径 |
| approve | 自动审批 | approver: 审批人，comment: 审批意见 |

## 4. 内置事实字段
| 字段名 | 类型 | 描述 |
|--------|------|------|
| action_type | string | 操作类型：shell-command/skill-execution/external-message/file-operation |
| user_id | string | 用户ID |
| user_role | string | 用户角色：admin/user/guest |
| user_locale | string | 用户区域：zh-CN/en-US |
| current_time | string | 当前时间，HH:mm格式 |
| weekday | number | 星期几：1-5工作日，6-7周末 |
| task_priority | string | 任务优先级：high/medium/low |
| skill_id | string | 执行的技能ID |
| skill_category | string | 技能分类：business/productivity/utility/security |
| command | string | 执行的Shell命令 |
| content | string | 消息内容或文件内容 |
| file_path | string | 操作的文件路径 |
| file_size | number | 文件大小，字节 |
| external_channel | string | 外部消息渠道：feishu/email/wechat/sms |

## 5. 最佳实践
### 5.1 规则设计原则
- 单一职责：每个规则只做一件事，避免复杂逻辑
- 粒度适中：规则粒度既不过粗也不过细，方便维护
- 可测试：每个规则都有对应的测试用例
- 可监控：规则执行情况可追踪、可审计
- 松耦合：规则之间尽量独立，避免依赖

### 5.2 性能优化
- 高优先级规则先执行，快速拦截高风险操作
- 频繁触发的规则优先优化条件判断逻辑
- 正则表达式尽量简洁，避免回溯
- 规则数量控制在1000条以内，超过时考虑拆分

### 5.3 运维管理
- 规则变更必须经过测试环境验证
- 定期审计规则执行日志，优化规则
- 无用规则及时清理，避免冗余
- 规则配置纳入版本管理，变更可追溯
- 定期备份规则文件，防止数据丢失

### 5.4 安全注意事项
- 规则文件权限设置为只读，防止篡改
- 敏感规则使用加密存储
- 规则执行日志定期备份，至少留存6个月
- 禁止在规则中硬编码敏感信息
- 规则变更必须有审批流程

## 6. 实施路径
1. ✅ 基础架构搭建，目录结构初始化（已完成）
2. ✅ 默认规则集配置（已完成）
3. ⏳ 规则执行引擎集成到OpenClaw核心
4. ⏳ 日志和监控系统建设
5. ⏳ 规则测试框架开发
6. ⏳ 规则管理界面开发
