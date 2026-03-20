---
name: viking-memory
description: 🧠 维京记忆 —— 五层防御原创记忆架构，mem9 + db9 + OpenViking + QMD 全本地存储，解决Agent五大核心记忆问题，避免错乱和泄漏
version: 1.0.0
author: 酱紫（基于mem9/db9/OpenViking/QMD整合创新）
license: MIT
---

# 🧠 viking-memory 维京记忆 —— 五层防御原创分层记忆架构

解决Agent五大核心记忆问题：一致性错误、检索失效、性能衰减、信息泄漏、黑盒不可观测。

## 问题背景：Agent常见记忆问题分类

从第一性原理分析，Agent记忆问题可分为五大类：

| 问题类别 | 根本原因 | 严重程度 |
|----------|----------|----------|
| **一致性问题** | 多个存储源数据不同步，记忆与实际文件不匹配 | 🔴 最高 |
| **检索失效问题** | 无法从海量记忆中找到当前相关信息 | 🟠 高 |
| **性能衰减问题** | 记忆增长后查询越来越慢，资源占用持续增长 | 🟡 中 |
| **安全性问题** | 敏感信息误提交到Git，依赖第三方云存储存在泄漏风险 | 🔴 最高 |
| **可观测性问题** | 记忆系统黑盒，问题无法定位调试 | 🟡 中 |

本架构通过**五层防御设计**，系统性解决所有五类问题。

## 架构概述

### 核心设计原则
1. **问题驱动分层**：每一层解决一类明确问题
2. **职责清晰分离**：四个组件各司其职，无重叠冗余
3. **完全本地优先**：所有数据存储在用户本地，不依赖第三方云服务
4. **Git责任分离**：Git仅做代码版本控制，不存储敏感数据和二进制索引
5. **全自动化运维**：一致性检查、冷热迁移、健康检查自动化

### 分层记忆架构设计

| 层级 | 技术 | 解决问题 | 核心用途 | 存储位置 |
|------|------|----------|----------|----------|
| **语义记忆层** | mem9 | 一致性 + 检索失效 | 混合向量+关键词搜索，长期记忆存储，文件时间戳索引 | 本地TiDB向量存储 |
| **监控分析层** | db9 | 可观测性 + 性能衰减 | 性能指标监控、操作日志、审计追踪、访问频率统计 | PostgreSQL (serverless) |
| **代码上下文层** | OpenViking | 代码检索失效 | 代码仓库语义索引，快速检索相关代码 | 本地上下文数据库 |
| **文档检索层** | QMD | 文档检索失效 | Markdown文档混合搜索(BM25+向量) | 本地SQLite索引 |

## 核心优势

### 🛡️ 安全性 (解决一致性+安全性问题)
- **完全本地存储**：敏感数据永远不会上传到第三方服务器
- **Git责任分离**：Git仅做代码版本控制，不存储索引和敏感内容
- **自动Git保护**：安装脚本自动更新.gitignore，防止误提交
- **避免信息泄漏**：个人隐私和商业机密保持在用户本地设备

### 🔍 检索精准 (解决检索失效问题)
- **分层索引**：不同类型内容使用专用检索引擎
- **混合搜索**：关键词+向量双路检索，比单一方法准确率更高
- **结果融合**：并行查询多层级，自动加权排序去重

### ⚡ 性能稳定 (解决性能衰减问题)
- **三级缓存架构**：L1进程内存 + L2本地SSD + L3全量存储
- **自动冷热迁移**：按访问频率自动分层，热点快速响应
- **增量更新**：索引只更新变更内容，不需要全量重建

### ✅ 一致性保证 (解决一致性问题)
- **文件系统优先**：实际文件总是比记忆文档更权威
- **自动化验证**：每次会话启动强制一致性检查
- **自动修复**：检测到不一致自动更新索引，无需人工干预

### 🔧 可观测性 (解决可观测性问题)
- **db9全链路审计**：所有内存操作都有日志记录
- **性能指标**：查询延迟、命中率持续统计
- **自动化健康检查**：每日自动验证索引完整性

## 安装步骤

### 1. 安装依赖包

```bash
bash scripts/install-deps.sh
```

这会安装以下npm包：
- `@mem9/mem9` - mem9核心记忆引擎
- `get-db9` - db9 PostgreSQL客户端
- `@kevinzhow/openclaw-memory-openviking` - OpenViking适配
- `@tobilu/qmd` - QMD markdown混合搜索

### 2. 初始化数据库

```bash
bash scripts/init-databases.sh
```

这会：
- 启动db9-server本地实例
- 创建memory监控数据库
- 初始化OpenViking上下文索引
- 构建QMD文档索引

### 3. 配置环境变量

编辑 `.env.memory`：

```env
# mem9配置
MEM9_DATA_DIR=~/.local/openclaw/mem9
MEM9_EMBEDDING_MODEL=text-embedding-3-small

# db9配置
DB9_CONNECTION_STRING=postgresql://localhost:5432/openclaw_memory
DB9_AUTO_START=true

# OpenViking配置
OPENVIKING_INDEX_DIR=~/.local/openclaw/openviking
OPENVIKING_ENABLED=true

# QMD配置
QMD_INDEX_PATH=~/.local/openclaw/qmd/index.db
QMD_EMBEDDING_ENABLED=true
```

### 4. 启动服务

```bash
bash scripts/start-memory-stack.sh
```

## 使用方式

### 统一记忆API

所有记忆操作通过 `scripts/memory.js` 统一入口：

```bash
# 存储记忆
node scripts/memory.js store "用户偏好：喜欢简洁回答，不啰嗦" --tags="preference"

# 语义搜索
node scripts/memory.js search "用户回答偏好" --limit=5

# 混合搜索 (mem9 + QMD)
node scripts/memory.js hybrid-search "记忆机制升级" --limit=10

# 获取健康状态
node scripts/memory.js health
```

## 标准工作流程

### 会话启动流程（强制执行）

```
1. 读取 AGENTS.md (行为规则)
2. 读取 SOUL.md (身份设定)
3. 读取 USER.md (用户信息)
4. 🚨 运行一致性检查 (mem9验证)
   → node scripts/memory.js check-consistency
   → 发现不一致自动修复
   → 严重不一致报告用户确认
5. 读取 memory/YYYY-MM-DD.md (今日+昨日)
6. 如果是主会话：读取 MEMORY.md
7. 预热L1缓存（当前项目相关记忆）
8. 语义检索mem9获取相关上下文
9. 就绪，接受用户请求
```

### 记忆存储流程

```
用户提供信息 → 判断内容类型
   ├─ 语义记忆/用户偏好/决策 → mem9存储
   ├─ Markdown文档/笔记 → QMD索引 + mem9存储摘要
   ├─ 代码文件/仓库 → OpenViking索引
   └─ 所有操作 → db9记录日志
```

### 记忆检索流程

```
用户查询 → 解析查询类型
   ├─ 并行查询相关层级：
   │  ├─ 语义问题 → mem9搜索
   │  ├─ 文档查找 → QMD搜索
   │  ├─ 代码问题 → OpenViking搜索
   │  └─ 历史操作 → db9查询
   ├─ 合并所有结果
   ├─ 按相关性加权排序
   ├─ 去重过滤
   ├─ 记录查询到db9
   └─ 返回Top-N结果
```

### 自动化运维（每日自动运行）

```
一致性检查 → 修复不一致索引
访问频率统计 → 冷热迁移优化
性能指标收集 → 生成健康报告
错误日志分析 → 反馈优化检索
```

## 文件结构

```
skills/mem9-db9-upgrade/
├── SKILL.md                      # 本文档
├── scripts/
│   ├── install-deps.sh          # 安装依赖
│   ├── init-databases.sh        # 初始化数据库
│   ├── start-memory-stack.sh    # 启动服务
│   ├── memory.js                # 统一记忆API入口
│   ├── health-check.js          # 健康检查
│   ├── consistency-check.js     # 一致性验证
│   ├── migrate-from-mem0.js     # 从mem0迁移数据
│   └── rebuild-index.js         # 重建索引
├── config/
│   └── memory-config.js         # 配置文件
├── references/
│   ├── architecture.svg         # 架构图
│   ├── memory-problems-classification.md  # 记忆问题分类分析
│   ├── solution-layer-design.md  # 分层解决方案设计
│   └── full-architecture-integration.md  # 完整架构整合
```

## 迁移指南

### 从旧mem0迁移

```bash
node scripts/migrate-from-mem0.js
```

这个脚本会：
1. 导出所有现有mem0记忆
2. 导入到mem9
3. 重建QMD索引
4. 验证一致性

### Git配置更新

更新 `.gitignore` 避免大文件和敏感数据进入Git：

```gitignore
# Local memory storage (large, sensitive)
~/.local/openclaw/
*.db
*.sqlite
*.sqlite3
*.vec
data/
memory/index/
# Keep only the markdown daily logs, not indexes
!memory/*.md
```

这样Git只存储文本日记，不存储二进制索引和向量数据，既保持版本控制又避免泄漏。

## 监控仪表板

db9存储以下监控数据：

| 表名 | 用途 |
|------|------|
| `memory_operations` | 所有内存操作日志 |
| `performance_metrics` | 查询延迟、命中率统计 |
| `consistency_checks` | 一致性检查结果 |
| `error_logs` | 错误追踪 |

可以通过 `node scripts/monitoring-dashboard.js` 查看实时监控。

## 故障排除

### 端口被占用
```bash
pkill -f db9-server
bash scripts/start-memory-stack.sh
```

### 索引损坏
```bash
node scripts/rebuild-index.js --all
```

### 一致性错误
```bash
node scripts/memory.js check-consistency --repair
```

## 参考资料

- [mem9 GitHub](https://github.com/mem9-ai/mem9)
- [db9 GitHub](https://github.com/c4pt0r/db9-backend)
- [OpenViking GitHub](https://github.com/volcengine/OpenViking)
- [QMD GitHub](https://github.com/tobi/qmd)

## 许可证

Apache 2.0
