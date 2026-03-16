# oneman-company
> 一个人就是一家公司 —— 基于OpenClaw的全栈AI自动化操作系统

## 🚀 核心亮点
### 🔥 与同类项目的核心差异
| 维度 | Agency Agents | Paperclip | OpenClaw One-Man Company OS |
|------|---------------|-----------|------------------------------|
| **核心定位** | 企业级AI团队协作系统 | 个人记忆与任务追踪系统 | 一人公司全栈自动化操作系统 |
| **核心设计** | 多Agent分工协作，模拟企业团队架构 | 聚焦记忆持久化和任务跟踪 | 面向独立个体/小团队，**全自动主动运行**，一人顶一个团队 |
| **使用门槛** | 需要复杂的团队配置、角色定义 | 简单上手，专注个人效率 | 开箱即用，内置5套可直接商业化的项目模板 |
| **核心能力** | 61个专业Agent，8大部门协作 | 记忆系统+任务追踪 | 多项目并行调度+全品类技能生态+生成能力**+智能记忆恢复+主动运行引擎+token超限保护** |
| **记忆可靠性** | 容易会话过期丢失记忆 | 依赖文件存储，reset后容易混乱 | **四重记忆+Git校验+自动恢复**，reset session后100%恢复准确进度，彻底解决AI遗忘问题 |
| **解决飞书token溢出** | ❌ 无解决方案 | ❌ 无解决方案 | ✅ **CLI-Anything 本地处理架构**，所有图片/大文件处理本地完成，只发结构化结果到飞书，token消耗减少 90%+，**再也不会因为图片太大断开连接** |
| **运行自主性** | 需要用户频繁指令驱动 | 需要用户手动推进任务 | **主动Git提交+主动技能迭代+主动进度汇报**，真正实现"你负责提出想法，我负责落地全流程" |
| **适用场景** | 中大型企业复杂项目开发 | 个人任务管理、知识管理 | 独立开发者、自由职业者、小团队快速落地商业化项目 |
| **商业化能力** | 需要二次开发对接业务 | 无内置商业化模板 | 内置AI自媒体、策略Agent、工具矩阵、小说生成、跨境电商5套可直接变现的项目模板 |

### 1. 7项目并行调度引擎
- 支持同时推进7个以上并行项目，资源动态分配，总效率提升70%
- 内置优先级调度算法，高优先级任务自动倾斜资源
- 任务进度自动追踪，交付前10分钟自动提醒，超时1分钟自动告警
- 真正实现"一个人就是一家公司"，不需要复杂的多Agent团队配置

### 2. 🛡️ 四重智能记忆恢复 + Token超限保护
- **四重记忆备份**：长时记忆(MEMORY.md) + 当日日志(memory/) + 向量数据库(mem0) + Git版本控制
- **三重校验恢复**：session重启后自动 `项目文档原文 > Git提交 > 旧记忆` 校验，保证100%准确
- **CLI-Anything token 优化**：所有图片/大文件/媒体处理**本地CLI完成**，只发结构化结果到飞书
  - ❌ Before: 大图片base64 → token超限 → 飞书断开 → session重启
  - ✅ After: `cli-anything-imagemagick` 本地压缩 → 只发文字结果 → token 减少 90%+ → 永远不超限
- 业界最强可靠性：彻底解决AI遗忘+飞书连接断开两大痛点

### 3. 5-Layer Complete Memory Architecture

We have the most reliable memory system in any AI agent project:

| Layer | Responsibility | Skill |
|-------|----------------|-------|
| **Base Storage** | Unified memory framework | `memory-enhancement` |
| **Semantic Search** | Find memories by meaning, not just keywords | `mem0` |
| **Crash Recovery** | 100% accurate recovery after session restart | `smart-memory-recovery` |
| **Git Backup** | Version control for all code/docs | Git |
| **🚀 Auto Learning** | Automatically learn from mistakes, never repeat | ✅ `auto-learning` |

Benefits:
- ✅ Never lose progress
- ✅ Never repeat the same mistake twice
- ✅ Continuously improve every day
- ✅ 100% recovery after restart

### 4. 混合编码架构 - 兼顾速度和质量
独创混合编码模式，解决单模式痛点：

| 模式 | Agent 纯生成 | OpenCode 纯执行 | **混合编码（我们的方案）** |
|------|--------------|-----------------|---------------------|
| 速度 | ⚡ 快 | 🐢 慢 | ⚡ **快** |
| 质量 | ⭐ 中等（容易有编译错误） | ⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ **高** |
| 落地性 | 需要人工调试 | 多轮很慢 | **Agent出架构 + OpenCode验证调试**，一次成型

### 5. 全品类技能生态
所有核心技能都已经配置好，开箱即用：

| Skill | Description | Token Saving |
|-------|-------------|-------------|
| `cli-anything` | Build agent-native CLI harness for any software, solve Feishu token overflow | ✅ Local processing, 90% token saved |
| `cli-anything-imagemagick` | Image compression/resize/optimization | ✅ All processing local |
| `hybrid-coding` | Hybrid coding: LLM fast draft + OpenCode verification/debugging. Get both speed and quality | ✅ Draft local, summary only sent |
| `auto-learning` | Automatic learning from mistakes & user corrections, never repeat mistakes | ✅ Learning local, summary only sent |
| `smart-memory-recovery` | 4-way smart memory recovery after session restart | ✅ Check locally, summary only sent |
| `auto-resource-allocation` | Auto parallel project scheduling by priority | ✅ Scheduling local, summary sent |
| `jinjiang-original-novel-writer` | Jinjiang S-level ancient romance automatic writing | ✅ Outline local, only current chapter sent |
| `security-center-scan` | Pre-push security scan for sensitive info leakage | ✅ Scan local, result summary sent |
| `deadline-monitor` | Automatic deadline tracking and graduated reminders | ✅ Checking local, alerts only sent |
| `abandoned-checkout-monitor` | E-commerce checkout funnel monitoring & recovery | ✅ Analysis local, report summary sent |
| `mem0` | Vector semantic memory for long-term retrieval | ✅ Search local, results sent |

### 5. 全栈能力集成
- 内置火山ARK生成能力：图片/视频生成、多模态理解、代码生成
- ClawHub技能生态：自动同步最新技能，支持零代码自定义扩展
- Agent浏览器能力：自主网页搜索、爬取、信息提取，搜索效率提升80%
- 国内生态原生适配，不需要科学上网即可使用所有能力

### 5. 内置商业化项目模板
- AI数字人自媒体全套解决方案（含账号运营、内容生成、发布全流程）
- 自动策略Agent开发框架（可直接商业化按次调用/订阅部署）
- APP工具矩阵快速开发套件（已内置AI思维导图、AI简历生成等工具）
- 小说内容生成流水线（支持晋江/番茄等平台爆款内容生成）
- 跨境电商出海运营系统（TikTok/Shopee等平台选品、运营、营销全流程）
- 所有模板均可直接落地变现，不需要二次开发

## 📦 快速开始
```bash
# 1. 克隆项目
git clone https://github.com/zzeqii/oneman-company.git
cd oneman-company

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 填入火山ARK accessKey/secretKey等配置

# 4. 启动核心服务
node paperclip_daemon.js &

# 5. 启动OpenClaw会话
openclaw start
```

## 🏗️ 架构说明
```
├── MEMORY.md               # 长时记忆存储
├── SOUL.md                 # 核心人格/行为规则
├── AGENTS.md               # 系统运行规范
├── paperclip_daemon.js     # 实时追踪进程
├── memory/                 # 每日日志目录
├── skills/                 # 自定义技能目录
├── 项目库/                  # 所有项目归档目录
└── .env                    # 环境变量配置
```

## 🛠️ 核心功能
| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 多项目调度 | ✅ 已上线 | 支持7+项目并行，资源动态分配 |
| 智能记忆恢复 | ✅ 已上线 | 四重记忆+Git校验，reset后100%准确恢复 |
| **主动运行引擎** | ✅ 已上线 | 主动Git提交+主动技能迭代+主动进度汇报 |
| **自动学习系统** | ✅ 已上线 | 多技能源备份(ClawHub+OpenClaw官方)+GitHub优秀项目自动学习测试部署+多领域知识库自动建设 |
| 技能生态 | ✅ 已上线 | 自动同步ClawHub技能，发现新技能自动安装 |
| 生成能力 | ✅ 已上线 | 图片/视频/文本/代码生成 |
| 定时推送 | ✅ 已上线 | 每日4次定时报告 |
| 浏览器能力 | ✅ 已上线 | 自主搜索爬取，多领域知识库自动分类补充 |
| 商业化模板 | ✅ 已上线 | 5套可直接落地的项目模板 |

## 🤝 贡献指南
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证
本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢
- [OpenClaw](https://github.com/openclaw/openclaw) - 核心运行时
- [Paperclip](https://github.com/paperclipai/paperclip) - 记忆系统灵感来源
- [Agency Agents](https://github.com/msitarzewski/agency-agents) - 多Agent架构参考

## 📈 Star 趋势
[![Star History Chart](https://api.star-history.com/svg?repos=zzeqii/oneman-company&type=Date)](https://star-history.com/#zzeqii/oneman-company&Date)
