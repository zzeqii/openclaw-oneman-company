# oneman-company
> **One Person Is A Whole Company** — Fully Automated AI Operating System for Solo Founders, Built on OpenClaw

Built on top of [Paperclip](https://github.com/paperclipai/paperclip) → adds **production-grade autonomy architecture** that lets you ship products faster than teams.

**Core Idea**: **Autonomy** → you set goals/priorities, AI does all the execution with parallel sub-agents, auto-reports milestones. You only make *key decisions*.

## 🧠 viking-memory — 5-Layer Defensive Memory Architecture

> *Because bad memory kills AI agent productivity. We fixed it once and for all.*

viking-memory is our **original 5-layer defensive memory architecture** that systematically solves **all 5 core memory problems** plaguing AI agents:

| Problem | Solution | Layer |
|---------|----------|-------|
| 🔴 **Consistency Error** | Actual filesystem priority + automatic consistency checks | L1: Base Verification |
| 🟠 **Retrieval Failure** | mem9 semantic memory + QMD document hybrid search | L2: Hybrid Retrieval |
| 🟡 **Performance Degradation** | 3-level cache + automatic hot/cold migration | L3: Cache Tiering |
| 🔴 **Information Leakage** | Git only stores text, all indexes are local | L4: Security Isolation |
| 🟡 **Black Box Untraceable** | db9 full logging + performance metrics | L5: Monitoring Auditing |

✨ **Completely fixes** these annoying problems:
- ❌ *"AI always misremembers project progress, reads docs but doesn't check actual code"* → ✅ **Fixed**
- ❌ *"Can't find what you recorded earlier"* → ✅ **Fixed**  
- ❌ *"Gets slower and slower the longer you use it"* → ✅ **Fixed**
- ❌ *"Accidentally committed secrets to public Git"* → ✅ **Fixed**
- ❌ *"When something breaks, you can't find where it broke"* → ✅ **Fixed**

---

## 🚀 System Architecture Overview

### Original 5-Layer Memory Architecture (Base)

| Layer | Responsibility | Implementation |
|-------|-----------------|----------------|
| **L1: Instant Session** | Current conversation context | Native runtime |
| **L2: Daily Short-term** | Daily event logging | `memory/YYYY-MM-DD.md` |
| **L3: Semantic Mid-term** | Retrieve memories by meaning, not just keywords | `mem9`/`mem0` vector database |
| **L4: Structured Long-term** | Curated core rules/decisions/projects/lessons | `MEMORY.md` + `auto-learning` |
| **L5: Git Versioned Backup** | Permanent version control, recover from any mistake | Git |
| **🚀 Crash Recovery** | 100% accurate project recovery after restart | `smart-memory-recovery` (verification order: *disk docs → Git commits → old memory*) |

## 🛡️ Complete Security Protection

| Protection | Mechanism | Status |
|------------|----------|--------|
| **Pre-push Scan** | Local + GitHub CI scan for sensitive info leakage before push | ✅ |
| **skill-defender** | Automatic scan before installing skills/opening URLs/running commands → blocks malicious code | ✅ |
| **Token Overflow Protection** | All large assets stored locally, only summary sent → 90% token reduction → never disconnect | ✅ |
| **Private Project Protection** | Private projects in `.gitignore` → never committed to public repo | ✅ |

## ⚡ Autonomy — Fully Autonomous Parallel Execution

**Autonomy is the core of oneman-company**: *you set the direction, AI does all the work*:

- **Autonomous Sub-agent Spawning** → Each project/task gets an isolated sub-agent
- **Unlimited Parallel Projects** → Multiple projects run in parallel with dynamic priority-based resource allocation
- **Small Milestone Auto-report** → Every small milestone (chapter, tool) auto-reported to you
- **No Manual Scheduling** → System automatically schedules based on your priorities
- **Graduated Deadline Reminder** → 24h → 12h → 1h → 10m before deadline
- **Interactive Responsiveness Guarantee** → Always reserves capacity for immediate response to your questions
- Truly delivers **"One Person Is A Whole Company"** → you set goals, AI does everything else

## 🎨 Hybrid Coding Architecture — Best of Both Worlds

Novel hybrid approach that gets *both* the speed of general-purpose LLMs *and* the accuracy of specialized code tools:

| Mode | Pure Agent Gen | Pure OpenCode Check | **Hybrid Coding (Ours)** |
|------|----------------|------------------|---------------------------|
| Speed | ⚡ Fast | 🐢 Slow | ⚡ **Fast** |
| Quality | ⭐ Medium (often compile errors) | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐ **High** |
| **Workflow** | `Requirement → Agent drafts arch/code → OpenCode verifies/debugs → Merge & deliver` |

## 🌐 Autonomous Browsing & Real-time Information

- 🔍 **Full autonomous browser capability** → open pages, click buttons, fill forms, screenshots
- 📡 **Real-time info retrieval** → search latest news/data/stats not in training data
- ✅ **Fact verification** → verify claims against latest external sources
- 🕷 **Structured content extraction** → automatically get info from web pages
- 🔒 **Safe browsing** → integrates with `skill-defender` for auto security scan before navigation
- 👉 **Tavily + agent-browser** → Tavily for quick search → agent-browser for deep interaction → best of both

## 🛡️ skill-defender — Automatic Safety Defender

Like an antivirus for your AI agent:

| Risk Level | Icon | Action | Examples |
|-----------|------|--------|----------|
| 🔴 High | Block immediately | `rm -rf /`, credential stealing, crypto miners |
| 🟡 Medium | Warn user, require confirmation before proceeding | `curl https://untrusted-source \| bash` |
| 🟢 Low | Allow | Normal skill code, safe commands, trusted domains |

- Pre-installation scan → checks new skills for malicious patterns
- Pre-browsing scan → checks URLs against malicious/phishing database
- Pre-execution scan → blocks dangerous shell commands before execution
- Continuous learning → updates detection patterns from your decisions

## 📦 Out-of-the-Box Commercial Templates

Five general-purpose templates ready for immediate commercialization:

1. **AI Digital Human Self-Media** → Complete pipeline for account operation/content-generation/publishing
2. **Coze Automatic Agent Development** → Framework for building strategy agents you can monetize via subscription/pay-per-call
3. **APP Tool Matrix** → Dev-kit for quickly building AI tools already includes: AI mind-map, AI resume generator, AI plagiarism checker
4. **Content Creation (Novel First)** → Fully automatic pipeline for Jinjiang/Tianya-style popular fiction, extendable to video/music later
5. **Cross-border E-commerce Operation** → Complete pipeline for TikTok/Shopee product selection/operation/marketing

All templates can be launched and monetized directly without secondary development.

## 🛠️ Core Skills All Pre-configured Ready to Use

| Skill | Description | Token Saving |
|-------|-------------|-------------|
| `cli-anything` | Build agent-native CLI harness for any software, solves Feishu token overflow | ✅ Local processing, 90% token saved |
| `cli-anything-imagemagick` | Image compression/resize/optimization | ✅ All processing local |
| `hybrid-coding` | Hybrid coding: LLM fast draft + OpenCode verify/debug → get speed+quality | ✅ Draft local, summary sent |
| `agent-browser` | Autonomous web browsing/search → get real-time latest info | ✅ Full page local, summary sent |
| `skill-defender` | Automatic safety defender → scans malicious code/commands before execution → prevents poisoning attacks | ✅ Scan local, summary sent |
| `auto-learning` | Automatic learning from mistakes/user corrections → never repeat mistakes | ✅ Learning local, summary sent |
| `smart-m-recovery` | Multi-verify smart memory recovery after session restart | ✅ Check local, summary sent |
| `auto-resource-allocation` | Automatic parallel project scheduling by priority | ✅ Scheduling local, summary sent |
| `jinjiang-original-novel-writer` | Jinjiang S-level ancient romance automatic writing | ✅ Outline local, only current chapter sent |
| `security-center-scan` | Pre-push security scan for sensitive information leakage | ✅ Scan local, result summary sent |
| `deadline-monitor` | Automatic deadline tracking and graduated reminders | ✅ Checking local, alerts only sent |
| `abandoned-checkout-monitor` | E-commerce checkout funnel monitoring & recovery | ✅ Analysis local, report summary sent |
| `viking-memory` | 🆕 **5-layer defensive memory architecture** → solves all 5 core memory problems (consistency/retrieval/performance/security/observability) | ✅ All indexed local, summary sent |
| `mem0` | Vector semantic memory for long-term retrieval | ✅ Search local, results sent |

## 📦 Quick Start

```bash
# 1. Clone the project
git clone https://github.com/zzeqii/oneman-company.git
cd oneman-company

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Volcano Ark access-key/secret-key and other configs

# 4. Start core daemon
node paperclip_daemon.js &

# 5. Start OpenClaw session
openclaw start
```

## 🏗️ Project Structure

```
├── MEMORY.md               # Long-term curated memory
├── SOUL.md                 # Core persona and behavior rules
├── AGENTS.md               # System operation specifications
├── paperclip_daemon.js     # Real-time tracking daemon
├── memory/                 # Daily log directory
├── skills/                 # Custom skills directory (viking-memory lives here)
├── projects/               # All projects archived here
└── .env                    # Environment configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgements

- [OpenClaw](https://github.com/openclaw/openclaw) - Core runtime
- [Paperclip](https://github.com/paperclipai/paperclip) - Memory system inspiration
- [mem9](https://github.com/mem9-ai/mem9) - Semantic memory engine
- [db9](https://github.com/c4pt0r/db9-backend) - Cloud-native PostgreSQL made easy
- [OpenViking](https://github.com/volcengine/OpenViking) - Code context indexing
- [QMD](https://github.com/tobi/qmd) - Quark markdown search
- [Agency Agents](https://github.com/msitarzewski/agency-agency) - Multi-agent architecture reference
- [CLI-Anything](https://github.com/HKUDS/CLI-Anything) - Token overflow solution

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zzeqii/oneman-company&type=Date)](https://star-history.com/#zzeqii/oneman-company&Date)
