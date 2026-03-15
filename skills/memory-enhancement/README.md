# OpenClaw记忆系统增强插件

集成MemOS和OpenViking的记忆优化机制，插件化接入现有系统，不覆盖原有记忆功能，重点提升长任务记忆能力和上下文关联能力。

## 核心特性

### 🧠 MemOS 记忆机制
- **分层记忆架构**：短时记忆（会话级）→ 长时记忆（持久化）
- **自动合并策略**：高频访问记忆自动合并到长时记忆库
- **访问频率优化**：根据访问次数智能调整记忆优先级
- **持久化存储**：所有记忆片段持久化到本地文件系统

### 🔍 OpenViking 上下文关联机制
- **语义相似度检索**：基于向量相似度查找相关历史记忆
- **任务上下文聚合**：自动聚合同一任务的所有历史上下文
- **关联分析**：智能分析当前上下文与历史记忆的关联
- **标签系统**：支持自定义标签分类管理记忆

## 功能列表

| 功能 | 描述 |
|------|------|
| 记忆存储 | 支持存储任务、上下文、决策、经验等多种类型记忆 |
| 语义检索 | 基于内容相似度检索相关历史记忆 |
| 任务上下文获取 | 自动聚合指定任务的完整上下文 |
| 上下文关联分析 | 分析当前上下文与历史记忆的关联度 |
| 长时记忆合并 | 定期将高频短时记忆合并到长时记忆库 |
| 统计信息 | 查看记忆系统的运行统计数据 |

## 安装使用

### 1. 安装插件
将插件放置在 OpenClaw 技能目录：`/Users/bytedance/.openclaw/workspace/skills/memory-enhancement/`

### 2. 初始化
插件会在首次使用时自动初始化，创建必要的目录结构：
- `memory/enhancement/`：存储增强记忆片段
- 自动加载历史记忆数据

### 3. API 使用

#### 存储记忆
```javascript
// 调用方式
skill.execute({
  action: 'store',
  type: 'task', // 类型：task|context|decision|lesson
  content: '完成记忆系统增强插件开发',
  taskId: 'task_001',
  tags: ['开发', '记忆系统']
});

// 返回结果
{
  success: true,
  data: {
    memoryId: 'xxxxxx',
    message: '记忆存储成功'
  }
}
```

#### 检索相关记忆
```javascript
skill.execute({
  action: 'retrieve',
  query: '记忆系统开发',
  taskId: 'task_001', // 可选，优先检索该任务下的记忆
  limit: 5, // 可选，返回数量限制，默认10
  threshold: 0.6 // 可选，相似度阈值，默认0.5
});
```

#### 获取任务上下文
```javascript
skill.execute({
  action: 'getTaskContext',
  taskId: 'task_001',
  maxTokens: 3000 // 可选，最大token数，默认2000
});
```

#### 上下文关联分析
```javascript
skill.execute({
  action: 'analyzeAssociation',
  context: '现在需要优化记忆系统的检索性能'
});
```

#### 长时记忆合并
```javascript
skill.execute({
  action: 'consolidate'
});
```

#### 获取统计信息
```javascript
skill.execute({
  action: 'stats'
});
```

## 与原有记忆系统的关系

### ✅ 不覆盖原有功能
- 原有 `MEMORY.md` 长时记忆文件继续使用
- 原有 `memory/YYYY-MM-DD.md` 日报机制保留
- 新增的增强记忆系统作为原有系统的补充

### ✅ 双向协同
- 增强记忆系统的高频记忆会自动合并到 `MEMORY.md`
- 原有记忆内容可以手动导入到增强记忆系统
- 两套系统独立运行，互不影响

## 性能优化

- 采用轻量级向量计算，无需依赖外部向量数据库
- 记忆检索时间复杂度 O(n)，适合万级以下记忆规模
- 自动清理已合并的短时记忆，减少存储空间占用
- 上下文聚合自动限制token数量，避免上下文溢出

## 适用场景

### 长任务处理
- 跨会话的长期项目开发
- 多步骤复杂任务执行
- 需要持续上下文关联的任务

### 知识沉淀
- 决策记录与复盘
- 经验教训沉淀
- 项目知识积累

### 上下文关联
- 跨任务的知识复用
- 相似问题解决方案匹配
- 历史经验参考

## 配置说明

无需额外配置，插件会自动适应现有 OpenClaw 工作空间。

默认存储路径：
- 记忆片段：`/Users/bytedance/.openclaw/workspace/memory/enhancement/`
- 长时记忆合并目标：`/Users/bytedance/.openclaw/workspace/MEMORY.md`

## 版本历史

### v1.0.0 (2026-03-14)
- 首次发布
- 集成 MemOS 分层记忆机制
- 集成 OpenViking 上下文关联机制
- 实现核心功能：存储、检索、上下文聚合、关联分析、长时记忆合并
