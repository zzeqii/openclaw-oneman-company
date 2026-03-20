# 集成指南

## AGENTS.md 启动流程更新

更新后的启动顺序如下（第四步替换为新的一致性检查）:

```
1. 读取 AGENTS.md ✅
2. 读取 SOUL.md ✅
3. 读取 USER.md ✅
4. 🚨 运行内存一致性检查 (mem9验证)
   node skills/mem9-db9-upgrade/scripts/consistency-check.js
5. 读取 memory/YYYY-MM-DD.md (今天+昨天) ✅
6. 如果主会话：读取 MEMORY.md 并导入到mem9 ✅
7. 语义搜索 mem9 获取相关上下文
8. 开始处理用户请求
```

## Git 最佳实践：本地优先，避免信息泄漏

### `.gitignore` 配置

更新你的 `.gitignore` 包含以下内容：

```gitignore
# mem9-db9 本地存储 - 二进制索引和敏感数据都存在本地，不提交Git
~/.local/openclaw/
*.db
*.sqlite
*.sqlite3
*.vec
data/
memory/index/
.env
.env.*

# 例外：保留纯文本markdown日志在Git中用于协作
!memory/*.md
!*.md
```

### 设计理念

**Git 不再是唯一真相源**：

- ✅ **纯文本内容**（日记、计划、笔记）依然可以提交Git用于协作
- ✅ **二进制索引、向量数据** 全部存在本地 `~/.local/openclaw/`，不进Git
- ✅ **敏感信息、API密钥** 存在 `.env` 文件，被 .gitignore 排除，不会泄漏
- ✅ 即使Git仓库被共享，也不会泄露敏感数据和个人隐私

### 对比传统方案

| 传统方案 | 本方案 |
|---------|--------|
| 所有数据都进Git | 分层存储，文本进Git，二进制本地 |
| Git成为唯一真相 | Git+本地存储双层架构 |
| 容易泄漏敏感信息 | 敏感数据永远本地，彻底避免泄漏 |
| 仓库体积增长快 | 仓库保持小巧，大文件本地 |

## 启动流程完整示例

```bash
# 首次安装
npm run memory:install

# 初始化数据库
npm run memory:init

# 迁移旧mem0数据
npm run memory:migrate

# 启动记忆栈
npm run memory:start

# 检查健康状态
npm run memory:health

# 查看统计
npm run memory:stats
```

## 日常使用示例

```bash
# 存储新记忆
node skills/mem9-db9-upgrade/scripts/memory.js store "用户偏好：喜欢简洁回答，不需要开场白" --tags="preference,style"

# 语义搜索
node skills/mem9-db9-upgrade/scripts/memory.js search "回答偏好" --limit=3

# 混合搜索（跨mem9+文档+代码）
node skills/mem9-db9-upgrade/scripts/memory.js hybrid-search "记忆升级" --limit=10

# 一致性检查
node skills/mem9-db9-upgrade/scripts/memory.js check-consistency

# 修复不一致
node skills/mem9-db9-upgrade/scripts/memory.js check-consistency --repair
```

## 监控查询示例

使用db9查询监控数据：

```sql
-- 查询最近24小时的操作统计
SELECT operation_type, COUNT(*), AVG(latency_ms) 
FROM memory_operations 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY operation_type;

-- 查询最慢的10个查询
SELECT query_text, latency_ms 
FROM memory_operations 
ORDER BY latency_ms DESC 
LIMIT 10;

-- 查询最近的错误
SELECT error_type, error_message, created_at 
FROM error_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

## 故障排除

### 服务无法启动

**问题**: db9-server 端口被占用

**解决**:
```bash
pkill -f db9-server
npm run memory:start
```

### 一致性错误

**问题**: 检查发现不一致

**解决**:
```bash
node skills/mem9-db9-upgrade/scripts/memory.js check-consistency --repair
```

### 索引损坏

**问题**: QMD或OpenViking索引损坏

**解决**:
```bash
rm -rf ~/.local/openclaw/qmd
rm -rf ~/.local/openclaw/openviking
npm run memory:init
```

### 性能低下

**优化方案**:
1. 检查 `config/memory-config.js` 中缓存是否启用
2. 减少每次搜索返回结果数量
3. 确认向量嵌入模型本地可用

## 安全注意事项

1. **永远不要** 将 `~/.local/openclaw/` 目录提交到Git
2. **永远不要** 将 `.env` 文件提交到Git
3. **定期** 运行一致性检查
4. **定期** 清理旧的监控数据（db9会自动按保留策略清理）

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                       用户请求入                               │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    统一记忆API (memory.js)                  │
└─────────────────────────────┬────────────────────────────────┘
      ┌───────────────┬────────┼───────────┬───────────────────┐
      ▼               ▼        ▼           ▼                   ▼
┌──────────┐  ┌────────────┐ ┌────────┐ ┌────────────┐  ┌──────────┐
│  mem9    │  │ OpenViking │ │  QMD   │ │    db9     │  │  Git     │
│ (语义)   │  │ (代码上下文)│ │(文档搜) │ │ (监控日志) │  │ (文本记录)│
└──────────┘  └────────────┘ └────────┘ └────────────┘  └──────────┘
      │               │            │            │                │
      └───────────────┴────────────┴────────────┴────────────────┘
                              │
                              ▼
                    合并结果 -> 排序 -> 返回给用户
                    
            存储位置: ~/.local/openclaw/ (本地，不进Git)
            文本日志: memory/*.md (进Git，协作)
```

## 性能指标

在Apple Silicon M1/M2上：

- 语义搜索: < 100ms
- 混合搜索: < 500ms
- 内存占用: ~100-200MB (取决于索引大小)
- 支持存储: 数十万条记忆

## 扩展阅读

- [mem9 GitHub](https://github.com/mem9-ai/mem9)
- [db9 GitHub](https://github.com/c4pt0r/db9-backend)
- [OpenViking GitHub](https://github.com/volcengine/OpenViking)
- [QMD GitHub](https://github.com/tobi/qmd)
