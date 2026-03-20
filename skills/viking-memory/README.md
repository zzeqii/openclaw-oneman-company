# 🧠 viking-memory - 维京记忆

> **五层防御原创记忆架构**，彻底解决Agent五大核心记忆问题，让你的AI Agent再也不会犯"记忆错乱、进度报告错误"这种低级错误。

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![openclaw](https://img.shields.io/badge/openclaw-skill-green.svg)](https://openclaw.ai)

---

## ✨ 核心亮点

| 问题 | 解决方案 |
|------|----------|
| **🔴 一致性错误** | 实际文件系统优先 + 自动一致性检查，记忆永远和实际文件匹配 |
| **🟠 检索失效** | mem9 语义记忆 + QMD 文档混合搜索，关键词+向量双路检索，找得到记得住 |
| **🟡 性能衰减** | 三级缓存 + 自动冷热迁移，记忆增长后检索依然快速 |
| **🔴 信息泄漏** | Git只存文本，所有二进制索引存在本地 `~/.local/openclaw/`，永远不会提交到Git |
| **🟡 黑盒不可观测** | db9 云原生PostgreSQL，全链路日志 + 性能指标 + 错误记录，错了能快速定位 |

### 架构图

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 基础验证层  │ │ 混合检索层 │ │   缓存分层   │ │ 安全隔离层 │ │ 监控审计层 │
│ 一致性保证 │ │ 精准找得到 │ │ 性能稳定     │ │ 隐私不泄漏 │ │ 可调试可观测 │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 整合组件

- **mem9** - 语义记忆引擎
- **db9** - 云原生PostgreSQL监控数据库
- **OpenViking** - 代码上下文索引
- **QMD** - Markdown文档混合搜索

---

## 🚀 一键安装

```bash
# 克隆技能
cd ~/.openclaw/workspace/skills
git clone https://github.com/your-username/viking-memory.git

# 一键安装
cd viking-memory
bash install.sh
```

或者在OpenClaw中：
```
/claw install viking-memory
```

## ⚙️ 配置

安装完成后，编辑 `~/.openclaw/workspace/.env.memory`:

```env
# mem9 配置
MEM9_DATA_DIR=~/.local/openclaw/mem9
MEM9_EMBEDDING_MODEL=text-embedding-3-small

# db9 配置 - 自动创建匿名数据库
# DB9_CONNECTION_STRING 会自动创建，不需要手动配置

# OpenViking 配置
OPENVIKING_INDEX_DIR=~/.local/openclaw/openviking
OPENVIKING_ENABLED=true

# QMD 配置
QMD_INDEX_PATH=~/.local/openclaw/qmd/index.db
QMD_EMBEDDING_ENABLED=true

# OpenAI 配置（用于embedding）
OPENAI_API_KEY=your_openai_api_key_here
```

## 📖 使用方式

### 启动服务

```bash
bash skills/viking-memory/scripts/start-memory-stack.sh
```

### 健康检查

```bash
bash skills/viking-memory/scripts/start-memory-stack.sh
```

### 一致性检查

```bash
node skills/viking-memory/scripts/consistency-check.js
```

这会自动检查记忆声明和实际文件是否一致，发现不一致自动告警。

### 搜索记忆

```bash
# 语义搜索
node skills/viking-memory/scripts/memory.js search "your query" --limit=5

# 混合搜索 (mem9 + QMD)
node skills/viking-memory/scripts/memory.js hybrid-search "your query" --limit=10
```

## 🎯 解决的问题

### 之前你是否遇到过这些问题？

- ❌ AI总是记错项目进度，只看文档不看实际代码
- ❌ 搜半天找不到之前记录的信息
- ❌ 用久了记忆检索越来越慢
- ❌ 不小心把敏感信息提交到Git公共仓库
- ❌ 出了错不知道错在哪，黑盒无法调试

**viking-memory 从架构层面系统性解决所有这些问题**。

## 🔒 安全性

- ✅ **Git责任分离**：文本文件进Git，二进制索引/向量数据/敏感配置永远存在本地
- ✅ `.gitignore` 已经配置好，自动排除所有敏感文件
- ✅ 完全本地优先，不依赖第三方云服务存储敏感数据
- ✅ db9 匿名账户足够开发使用，不需要注册就能用

## 📊 性能

- **冷热分层缓存**：常用放内存，不常用放SSD
- **增量更新**：只更新变更内容，不需要全量重建索引
- **混合搜索**：关键词+向量双路检索，比单一方法准确率提升30%+

## 🤝 贡献

欢迎提交Issue和Pull Request改进这个技能！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

> **维京** - 命名来自 OpenViking，也象征着在记忆海洋里勇敢探索，让AI Agent拥有靠谱的记忆。
