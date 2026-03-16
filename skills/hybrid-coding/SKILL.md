---
name: hybrid-coding
description: Hybrid coding pattern that combines LLM fast draft generation + OpenCode validation/compilation/debugging. Get both speed of general-purpose LLMs and accuracy of specialized code tools.
---

# hybrid-coding

混合编码模式：兼顾大模型的生成速度和专业代码工具的落地准确性

## 工作流程

```
用户需求 → 第一步：Agent（我）生成完整代码草稿 + 架构设计 → 第二步：交给 OpenCode 验证/编译/调试/自动修复 → 第三步：验收合并 → 交付
```

### 阶段 1：Agent 草稿生成（我来做）
- 快速理解需求，生成完整架构设计
- 生成全部代码文件，符合项目规范
- 编写README和使用说明
- 输出完整可编译的代码框架

**输出：**
- 完整目录结构
- 所有代码文件
- 架构说明文档

### 阶段 2：OpenCode 验证修复（交给 OpenCode）
- OpenCode 编译检查，发现语法/依赖错误
- 自动修复编译错误
- 验证功能正确性
- 补充缺失的边界处理
- 运行单元测试
- 修复失败测试

### 阶段 3：合并验收
- Agent 合并 OpenCode 修复
- 生成最终交付文档
- 安全扫描检查敏感信息
- 提交 Git

## 使用场景

- APP工具矩阵项目开发
- Coze自动策略Agent开发
- 任何需要编码+验证的项目
- 兼顾开发速度和落地质量

## 优势

| 模式 | 速度 | 质量 | 落地性 |
|------|------|------|--------|
| 纯Agent生成 | ⚡ 快 | ⭐ 中等 | 可能有编译/调试问题 |
| 纯 OpenCode | 🐢 慢 | ⭐⭐⭐⭐ 高 | 需要更多轮次 |
| **混合模式** | ⚡ 快 | ⭐⭐⭐⭐ 高 | 完美兼顾，Agent架构+OpenCode验证 |

## 调用方式

```
@hybrid-coding build a new [project-name] with description [description]
```

## 输出规范

1. **架构设计文档**：清晰说明模块划分、接口定义、依赖关系
2. **完整代码**：所有代码文件按目录结构生成
3. **交付检查清单**：
   - [ ] 代码可编译
   - [ ] 单元测试通过
   - [ ] 无敏感信息泄漏
   - [ ] Git 提交完成
   - [ ] README 更新
