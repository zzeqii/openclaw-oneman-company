# smart-memory-recovery

Four-way smart memory recovery mechanism for session restarts - guarantees 100% accurate project progress recovery after reset/restart.

## Methodology

1. **四重备份**：长时记忆 (MEMORY.md) + 当日记忆 (memory/) + Git + 向量数据库 (mem0)
2. **优先级校验**：项目文档原文 > Git 实际提交 > 旧记忆，永远以最新文档为准
3. **项目专项规则**：不同项目类型有专项校验
   - 小说写作：强制重读大纲，逐章核对剧情点位保证不错位
   - 代码开发：核对实际代码行数、Git提交记录
   - 商业项目：核对最新需求文档

## Token Saving

All recovery/checking done locally, only summary sent to chat - very low token usage.
