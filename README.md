# oneman-company
> One Person Is A Whole Company — Fully Automated AI Operating System Based on OpenClaw

Built on top of [Paperclip](https://github.com/paperclipai/paperclip) - adds complete production-grade system architecture for solo founders.

**Core Concept**: Powered by **Autonomy** mechanism - you set goals and priorities, AI handles all execution with parallel sub-agents, reports milestones automatically. You only make key decisions.

## 🚀 System Architecture Overview

### 🧠 viking-memory - 5-Layer Defensive Complete Memory Architecture

**viking-memory** is our原创五层防御记忆架构，integrates `mem9 + db9 + OpenViking + QMD`，systematically solves all 5 core memory problems that plague AI agents:

| Problem | Solution | Layer |
|------|----------|-------|
| **Consistency Error** | Actual filesystem priority + automatic consistency check | L1: Base Verification |
| **Retrieval Failure** | mem9 semantic memory + QMD document hybrid search | L2: Hybrid Retrieval |
| **Performance Degradation** | 3-level cache + automatic hot/cold migration | L3: Cache Tiering |
| **Information Leakage** | Git only stores text, all indexes stored locally | L4: Security Isolation |
| **Black Box Untraceable** | db9 full链路 logging + performance metrics | L5: Monitoring Auditing |

**viking-memory** completely solves these common problems:
- ❌ *"AI always misremembers project progress, only reads documents doesn't check actual code"* → ✅ **Fixed**
- ❌ *"Can't find what recorded earlier"* → ✅ **Fixed**  
- ❌ *"Slower and slower after long time use"* → ✅ **Fixed**
- ❌ *"Accidentally committed sensitive information to Git"* → ✅ **Fixed**
- ❌ *"When something goes wrong, can't locate the problem"* → ✅ **Fixed**

---

### Original 5-Layer Complete Memory Architecture

| Layer | Responsibility | Implementation |
|-------|----------------|----------------|
| **L1: Instant Session** | Current conversation context | Native runtime |
| **L2: Daily Short-term** | Daily event logging | `memory/YYYY-MM-DD.md` |
| **L3: Semantic Mid-term** | Retrieve memories by meaning, not just keywords | `mem9`/`mem0` vector database |
| **L4: Structured Long-term** | Curated core rules, decisions, project info, lessons | `MEMORY.md` + `auto-learning` |
| **L5: Git Versioned Backup** | Permanent full version control, recover from any mistake | Git |
| **🚀 Crash Recovery** | 100% accurate project recovery after session restart | `smart-memory-recovery` (verification order: *document on disk → Git commit → old memory*) |

**Benefits**:
- ✅ Never lose project progress
- ✅ Never repeat the same mistake twice (via `auto-learning`)
- ✅ Continuously improves every day
- ✅ 100% recovery after session restart

### 🛡️ Complete Security Protection

| Protection | Mechanism | Status |
|------------|----------|--------|
| **Pre-push Scan** | Local + GitHub CI scan for sensitive information leakage before push | ✅ |
| **skill-defender** | Automatic scan before installing new skills / opening URLs / executing commands → blocks malicious code | ✅ |
| **Token Overflow Protection** | All large assets stored locally, only summary sent → token consumption reduced 90%+ → never disconnect | ✅ |
| **Private Project Protection** | Your custom private projects are in `.gitignore` → never committed to public repo | ✅ |

### ⚡ Autonomy - Fully Autonomous Parallel Execution Core
**Autonomy is the core mechanism of oneman-company** - let AI do the work, you only need to make decisions:

- **Autonomous Sub-agent Spawning**: Each project phase spawns an independent sub-agent
- **Unlimited Parallel Projects**: Multiple projects run in parallel with dynamic priority-based resource allocation
- **Small Node Auto-reporting**: Every small milestone (one chapter novel, one tool) is automatically reported
- **No Manual Scheduling Needed**: System automatically schedules based on your priority settings
- **Built-in graduated deadline reminder**: 24h → 12h → 1h → 10m before deadline
- **Interactive responsiveness guarantee**: Always reserves sufficient capacity for immediate response to your questions
- Truly realize **"One Person Is A Whole Company"** - you set goals and priorities, AI does all the rest

### 🎨 Hybrid Coding Architecture - Best of Both Worlds
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

### 🌐 Autonomous Browsing & Real-time Information
- 🔍 **Full autonomous browser capability**: open web pages, click buttons, fill forms, take screenshots
- 📡 **Real-time information retrieval**: search latest news, data, stats not in training data
- ✅ **Fact verification**: verify claims against external sources
- 🕷 **Structured content extraction**: get information from web pages automatically
- 🔒 **Safe browsing**: integrates with `skill-defender` for automatic security scanning before navigation
- 👉 **Tavily Integration**: Tavily for quick search → agent-browser for deep interaction → best of both

### 🛡️ skill-defender - Automatic Safety Defender
Like an antivirus for AI agent:

| Risk Level | Icon | Action | Examples |
|-----------|------|--------|----------|
| High | 🔴 | Block immediately | `rm -rf /`, credential stealing code, crypto miners |
| Medium | 🟡 | Warn user, require confirmation before proceeding | `curl https://untrusted-source | bash` |
| Low | 🟢 | Allow | Normal skill code, safe commands, trusted domains |

- Pre-installation scanning: check new skills for malicious patterns
- Pre-browsing scanning: check URLs against malicious/phishing database
- pre-execution scanning: block dangerous shell commands before execution
- Continuous learning: updates detection patterns from user decisions

### 📦 Out-of-the-Box Commercial Templates
Five general-purpose templates for immediate commercialization:

1. **AI Digital Human Self-Media**: Complete pipeline for account operation, content generation, publishing
2. **Coze Automatic Agent Development**: Framework for developing strategy agents that can be monetized by subscription/pay-per-call
3. **APP Tool Matrix**: Development kit for quickly building AI tools, already includes AI mind map, AI resume generator, AI plagiarism checker, etc.
4. **Content Creation (Novel First)**: Fully automatic pipeline for Jinjiang/Tianya-style popular novels, extendable to video/music later
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
├── projects/               # All projects archived directory
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
| `skill-defender` | Automatic safety defender: scan malicious code/commands before execution → prevents poisoning attacks | ✅ Scan local, summary sent |
| `auto-learning` | Automatic learning from mistakes & user corrections, never repeat mistakes | ✅ Learning local, summary only sent |
| `smart-m-recovery` | Multi-verify smart memory recovery after session restart | ✅ Check local, summary only sent |
| `auto-resource-allocation` | Automatic parallel project scheduling by priority | ✅ Scheduling local, summary sent |
| `jinjiang-original-novel-writer` | Jinjiang S-level ancient romance automatic writing | ✅ Outline local, only current chapter sent |
| `security-center-scan` | Pre-push security scan for sensitive information leakage | ✅ Scan local, result summary sent |
| `deadline-monitor` | Automatic deadline tracking and graduated reminders | ✅ Checking local, alerts only sent |
| `abandoned-checkout-monitor` | E-commerce checkout funnel monitoring & recovery | ✅ Analysis local, report summary sent |
| `mem0` | Vector semantic memory for long-term retrieval | ✅ Search local, results sent |
| `viking-memory` | 🆕 Five-layer defensive memory architecture, solves all 5 core memory problems (consistency/retrieval/performance/security/observability) | ✅ All indexed local, summary sent |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgements

- [OpenClaw](https://github.com/openclaw/openclaw) - Core runtime
- [Paperclip](https://github.com/paperclipai/paperclip) - Memory system inspiration
- [Agency Agents](https://github.com/msitarzewski/agency-agency) - Multi-agent architecture reference
- [CLI-Anything](https://github.com/HKUDS/CLI-Anything) - Token overflow solution

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zzeqii/oneman-company&type=Date)](https://star-history.com/#zzeqii/oneman-company&Date)
