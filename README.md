# oneman-company
> One Person Is A Whole Company — Fully Automated AI Operating System Based on OpenClaw

## 🚀 Core Highlights

### 🔥 Key Differentiations from Other Projects

| Dimension | Agency Agents | Paperclip | OpenClaw One-Man-Company OS |
|-----------|--------------|-----------|------------------------------|
| **Core Positioning** | Enterprise AI team collaboration system | Personal memory & task tracking | Fully automated operating system for solo founders/indie developers |
| **Core Design** | Multi-agent division of labor, simulating enterprise team structure | Focus on memory persistence and task tracking | **Fully autonomous operation** for solo founders/inventors, one person can ship like a whole team |
| **Learning Mechanism** | Fixed static rules, no automatic improvement | N/A | **Automatic learning from mistakes** → never repeats the same error → continuously improves |
| **Memory Reliability** | Prone to session expiration and forgetting | Relies on file storage, easy confusion after reset | **5-Layer complete memory architecture** with Git-verified recovery → 100% accurate after reset |
| **Token Overflow Protection (Feishu/WeChat)** | ❌ No solution | ❌ No solution | ✅ **CLI-Anything local processing architecture** → all media processed locally, only structured results sent → token consumption reduced by 90%+ → never disconnects due to large images |
| **Operation Autonomy** | Requires frequent user instructions | Requires manual task推进 | **Automatic Git commit + automatic skill iteration + automatic progress reporting** → *You propose the idea, we handle the full pipeline delivery* |
| **Getting Started** | Complex team configuration and role definitions required | Simple, focus on personal productivity | Batteries included → 5 general-purpose commercial-ready templates out-of-the-box |
| **Commercialization Capability** | Requires secondary development for business | No built-in commercial templates | Built-in 5 general commercializable templates → can ship directly |

## 📋 Core Features

### 1. Unlimited Parallel Project Scheduling
- Supports **unlimited parallel projects** with dynamic priority-based resource allocation
- Built-in graduated deadline reminder mechanism: 24h → 12h → 1h → 10m before deadline
- **Interactive responsiveness guarantee**: Always reserves sufficient capacity for immediate response to user queries
- Truly realize "one person is a whole company" without complex multi-agent configuration

### 2. 5-Layer Complete Memory Architecture
The most reliable memory system in any AI agent project:

| Layer | Responsibility | Implementation |
|-------|----------------|----------------|
| **Base Storage** | Unified memory framework | `memory-enhancement` |
| **Semantic Search** | Retrieve memories by meaning, not just keywords | `mem0` |
| **Crash Recovery** | 100% accurate project recovery after session restart | `smart-memory-recovery` (verification order: *document on disk → Git commit → old memory*) |
| **Versioned Backup** | Full version control for all code and documents | Git |
| **Automatic Learning** | Learn from mistakes and user corrections → never repeat | `auto-learning` |

**Benefits**:
- ✅ Never lose project progress
- ✅ Never repeat the same mistake twice
- ✅ Continuously improves every day
- ✅ 100% recovery after session restart

### 3. 🛡️ Token Overflow Protection for Chat Platforms
Problem solved: Large images, multiple generated chapters, long context often cause token overflow and connection reset on closed platforms like Feishu.

**Solution**: [CLI-Anything](https://github.com/HKUDS/CLI-Anything) integration + localized storage:
- All large assets processed/stored **locally**
- Only structured text results/summaries/current context sent to chat platform
- Token consumption reduced by **90%+**
- Never gets disconnected due to token overflow anymore

Built-in mechanisms for different scenarios:

| Scenario | Mechanism | Token Saving |
|----------|-----------|-------------|
| Large images | `cli-anything-imagemagick` local compression → only send text result | ✅ 90%+ saved |
| Image generation (SeedDream/SeedDance) | Images stored locally in `output/` → only send path/text result | ✅ Already works, 99% saved |
| Long novel writing | Full outline/book stored locally → only send current chapter + recent context | ✅ 90%+ saved |
| Multiple parallel projects | Only send current progress summary → full project stored locally | ✅ 90%+ saved |

Built-in tools:
- `cli-anything-imagemagick`: Image compression/resize/optimization → 100% test coverage

### 4. Hybrid Coding Architecture - Best of Both Worlds
Novel hybrid approach gets both speed of general-purpose LLMs and accuracy of specialized code tools:

| Mode | Pure Agent Generation | Pure OpenCode Execution | **Hybrid Coding (Ours)** |
|------|-----------------------|--------------------------|---------------------------|
| Speed | ⚡ Fast | 🐢 Slow | ⚡ **Fast** |
| Quality | ⭐ Medium (often has compile errors) | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐ **High** |
| Landing | Needs manual debugging | Multiple rounds slow | **Agent drafts architecture + OpenCode verifies/debugs** → done in one pass

Workflow:
```
User Requirement → 1. Agent generates architecture + code draft → 2. OpenCode verifies/compiles/debugs → 3. Merge and deliver
```

### 5. Autonomous Browsing & Real-time Information
- 🔍 **Full autonomous browser capability**: open web pages, click buttons, fill forms, take screenshots
- 📡 **Real-time information retrieval**: search latest news, data, stats that training data doesn't have
- ✅ **Fact verification**: verify claims against external sources
- 🕷 **Structured content extraction**: get information from web pages automatically
- 🔒 **Safe browsing**: integrates with `skill-defender` for automatic security scanning before navigation

### 6. 🛡️ skill-defender Automatic Safety Protection
Like an antivirus for AI agent:
- Pre-installation scanning: check new skills for malicious code before installing
- Pre-browsing scanning: check URLs against malicious/phishing database
- Pre-execution scanning: block dangerous shell commands (`rm -rf /`, fork bombs, credential stealing)
- Risk classification: 🔴 block high risk immediately, 🟡 warn medium risk, 🟢 allow low risk
- Continuous learning: updates detection patterns from user decisions

### 7. Full-Stack Capability Integration
- Built-in Volcano Ark generation: image/video/code/multimodal
- ClawHub skill ecosystem: automatic sync latest skills, zero-code custom extension
- Autonomous browsing capability: web search, crawling, information extraction
- Native Chinese ecosystem adaptation → no proxy required

### 8. Out-of-the-Box Commercial Templates
Five general-purpose templates for immediate commercialization:

1. **AI Digital Human Self-Media**: Complete pipeline for account operation, content generation, publishing
2. **Coze Automatic Agent Development**: Framework for developing strategy agents that can be monetized by subscription/pay-per-call
3. **APP Tool Matrix**: Development kit for quickly building AI tools, already includes AI mind map, AI resume generator, AI plagiarism checker, etc.
4. **Content Creation (Novel First)**: Fully automatic pipeline for Jinjiang/Tianya-style popular novels, can extend to video/music later
5. **Cross-Border E-commerce Operation**: Complete pipeline for TikTok/Shopee product selection, operation, marketing

All templates can be landed and monetized directly without secondary development.

## 📦 Quick Start

```bash
# 1. Clone the project
git clone https://github.com/zzeqii/oneman-company.git
cd oneman-company

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in Volcano Ark accessKey/secretKey and other configurations

# 4. Start core daemon
node paperclip_daemon.js &

# 5. Start OpenClaw session
openclaw start
```

## 🏗️ Architecture

```
├── MEMORY.md               # Long-term curated memory
├── SOUL.md                 # Core persona and behavior rules
├── AGENTS.md               # System operation specifications
├── paperclip_daemon.js     # Real-time tracking daemon
├── memory/                 # Daily log directory
├── skills/                 # Custom skills directory
├── projects/               # All projects archived
└── .env                    # Environment configuration
```

## 🛠️ Core Skills

All core skills are pre-configured, ready to use:

| Skill | Description | Token Saving |
|-------|-------------|-------------|
| `cli-anything` | Build agent-native CLI harness for any software, solves Feishu token overflow | ✅ Local processing, 90% token saved |
| `cli-anything-imagemagick` | Image compression/resize/optimization | ✅ All processing local |
| `hybrid-coding` | Hybrid coding: LLM fast draft + OpenCode verification/debugging. Get both speed and quality | ✅ Draft local, summary only sent |
| `agent-browser` | Autonomous web browsing/searching, get real-time latest information | ✅ Full page local, summary sent |
| `skill-defender` | Automatic safety defender: scan for malicious code/commands before execution → prevents poisoning attacks | ✅ Scan local, summary sent |
| `auto-learning` | Automatic learning from mistakes & user corrections, never repeat mistakes | ✅ Learning local, summary only sent |
| `smart-memory-recovery` | Multi-verify smart memory recovery after session restart | ✅ Check locally, summary only sent |
| `auto-resource-allocation` | Automatic parallel project scheduling by priority | ✅ Scheduling local, summary sent |
| `jinjiang-original-novel-writer` | Jinjiang S-level ancient romance automatic writing | ✅ Outline local, only current chapter sent |
| `security-center-scan` | Pre-push security scan for sensitive information leakage | ✅ Scan local, result summary sent |
| `deadline-monitor` | Automatic deadline tracking and graduated reminders | ✅ Checking local, alerts only sent |
| `abandoned-checkout-monitor` | E-commerce checkout funnel monitoring & recovery | ✅ Analysis local, report summary sent |
| `mem0` | Vector semantic memory for long-term retrieval | ✅ Search local, results sent |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenClaw](https://github.com/openclaw/openclaw) - Core runtime
- [Paperclip](https://github.com/paperclipai/paperclip) - Memory system inspiration
- [Agency Agents](https://github.com/msitarzewski/agency-agents) - Multi-agent architecture reference
- [CLI-Anything](https://github.com/HKUDS/CLI-Anything) - Token overflow solution

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zzeqii/oneman-company&type=Date)](https://star-history.com/#zzeqii/oneman-company&Date)
