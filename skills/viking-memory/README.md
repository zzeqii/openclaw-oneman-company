# 🧠 mem9-db9 新一代记忆机制升级

完整升级方案，整合 **mem9 + db9 + OpenViking + QMD**，本地优先存储架构，不依赖Git作为唯一真相，彻底避免信息泄漏。

## 🚀 一键安装

```bash
# 安装所有依赖
npm run memory:install

# 初始化数据库
npm run memory:init

# 迁移旧mem0数据
npm run memory:migrate

# 启动服务检查
npm run memory:start
```

## 📋 架构

| 组件 | 用途 |
|------|------|
| **mem9** | 主记忆引擎，混合向量+关键词搜索 |
| **db9** | PostgreSQL监控数据库，记录操作日志 |
| **OpenViking** | 代码上下文索引 |
| **QMD** | Markdown文档混合搜索 |

## 💡 核心特性

- ✅ **完全本地存储** - 敏感数据永远不泄漏
- ✅ **Git不再是唯一真相** - 文本进Git，二进制本地
- ✅ **分层记忆架构** - 多层级混合搜索，准确率更高
- ✅ **内置监控** - db9记录所有操作，便于排查问题
- ✅ **零敏感数据泄漏风险** - .gitignore自动排除本地存储

## 🔧 常用命令

```bash
# 存储记忆
node skills/mem9-db9-upgrade/scripts/memory.js store "内容" --tags=tag1,tag2

# 混合搜索
node skills/mem9-db9-upgrade/outback search "查询"

# 健康检查
npm run memory:health

# 查看统计
npm run memory:stats

# 一致性检查
npm run memory:check
```

## 🔒 安全设计

1. **数据分层：
   - `memory/*.md` 纯文本笔记 → Git (可协作
   - `~/.local/openclaw/` 二进制索引 → 本地，永远不进Git
   - `.env*` 配置 → 本地，不进Git

2. 即使Git仓库共享，也不会泄漏敏感信息

## 📖 详细文档

- [SKILL.md](./SKILL.md) - 完整方案文档
- [references/integration-guide.md](./references/integration-guide.md) - 集成指南
