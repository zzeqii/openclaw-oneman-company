# oneman-company
> **One Person Is A Whole Company** — Fully Automated AI Operating System Based on OpenClaw

Built on top of [Paperclip](https://github.com/paperclipai/paperclip) → adds **production-grade autonomy architecture** that lets you ship products faster than teams.

**Core Idea**: **Autonomy** → you set goals and priorities, AI does all execution with parallel sub-agents, auto-reports milestones. You only make **key decisions**.

## 🧠 viking-memory — 5-Layer Defensive Memory Architecture

> *Because bad memory kills AI agent productivity. We fixed it once and for all.*

`viking-memory` is our **original 5-layer defensive memory architecture that systematically solves **all 5 core memory problems** plaguing AI agents. It builds on top of the basic 5-layer architecture provided by oneman-company, adds proper engineered implementation using the best existing components:

| Problem | Solution | Layer |
|---------|----------|-------|
| 🔴 **Consistency Error** → AI misremembers project progress, reads docs but doesn't check actual code | Actual filesystem priority + automatic consistency checks | L1: Base Verification |
| 🟠 **Retrieval Failure** → Can't find what you recorded earlier | mem9 semantic memory + QMD document hybrid search | L2: Hybrid Retrieval |
| 🟡 **Performance Degradation** → Gets slower the longer you use it | 3-level cache + automatic hot/cold migration | L3: Cache Tiering |
| 🔴 **Information Leakage** → Accidentally committed secrets to public Git | Git only stores text, all indexes are local | L4: Security Isolation |
| 🟡 **Black Box Untraceable** → When something breaks, you can't find where it broke | db9 full logging + performance metrics | L5: Monitoring Auditing |

✨ **Completely fixes** these annoying problems:
- ❌ *"AI always misremembers project progress, reads docs but doesn't check actual code"* → ✅ **Fixed**
- ❌ *"Can't find what you recorded earlier"* → ✅ **Fixed**
- ❌ *"Gets slower and slower the longer you use it"* → ✅ **Fixed**
- ❌ *"Accidentally committed secrets to public Git"* → ✅ **Fixed**
- ❌ *"When something breaks, you can't find where it broke"* → ✅ **Fixed**

---

## 🚀 System Architecture Overview

### Basic 5-Layer Memory Architecture (Base)

| Layer | Responsibility | Implementation |
|-------|---------------|-----------------|
| **L1: Instant Session** | Current conversation context | Native runtime |
| **L2: Daily Short-term** | Daily event logging | `memory/YYYY-MM-DD.md` |
| **L3: Semantic Mid-term** | Retrieve memories by meaning, not just keywords | `mem9`/`mem0` vector database |
| **L4: Structured Long-term | Curated core rules/decision/projects/lessons | `MEMORY.md` + `auto-learning` |
| **L5: Git Versioned Backup | Permanent version control, recover from any mistake | Git |
| **🚀 Crash Recovery** | 100% accurate project recovery after session restart | `smart-memory-recovery` (verification order: *disk docs → Git commits → old memory) |

## 🛡️ Complete Security Protection

| Protection | Mechanism | Status |
|------------|-----------|--------|
| **Pre-push Scan** | Local + GitHub CI scan for sensitive information leakage before push | ✅ |
| **skill-defender** | Automatic scan before installing new skills/opening URLs/running commands → blocks malicious code | ✅ |
| **Token Overflow Protection** | All large assets stored locally, only summary sent → 90% token reduction → never disconnect | ✅ |
| **Private Project Protection** | Private projects configured in `.gitignore` → never committed to public repo | ✅ |

## ⚡ Autonomy — Fully Autonomous Parallel Execution

**Autonomy is the core of oneman-company**: *you set the direction, AI does all the work*:

- **Autonomous Sub-agent Spawning** → Each project/task gets an isolated sub-agent
- **Unlimited Parallel Projects** → Multiple projects run in parallel with dynamic priority-based resource allocation
- **Small Milestone Auto-report** → Every small milestone (one chapter, one tool) automatically reported to you
- **No Manual Scheduling** → System automatically schedules based on your priorities
- **Graduated Deadline Reminder → 24h → 12h → 1h → 10m before deadline
- **Interactive Responsiveness Guarantee → Always reserves enough capacity for your immediate questions
- Truly delivers **"One Person Is A Whole Company"** → you set goals, AI does everything else

## 🎨 Hybrid Coding Architecture — Best of Both Worlds

Novel hybrid approach gets *both* the speed of general-purpose LLMs *and* the accuracy of specialized code tools:

| Mode | Pure Agent Generation | Pure OpenCode Verification | **Hybrid Coding (Ours) |
|------|---------------------|-----------------------|---------------------------|
| Speed | ⚡ Fast | 🐢 Slow | ⚡ **Fast** |
| Quality | ⭐ Medium | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ **High** |

**Workflow**:
```
User Requirement → 1. Agent generates architecture/code draft → 2. OpenCode verifies/compiles → 3. Merge and deliver
```

## 🌐 Autonomous Browsing & Real-time Information

- 🔍 **Full autonomous browser capability → open web pages, click buttons, fill forms, take screenshots
- 📡 **Real-time information retrieval → search latest news/data/stats not in training data
- ✅ **Fact Verification** → verify claims against latest external sources
- 🕷 **Structured content extraction → automatically extract information from web pages
- 🔒 **Safe browsing** → integrated with `skill-defender` → automatic security scan before navigation
- 👉 **Tavily + agent-browser → Tavily for quick search → agent-browser for deep interaction → best of both

## 🛡️ skill-defender — Automatic Safety Defender

Like an antivirus for your AI agent:

| Risk Level | Icon | Action | Examples |
|-----------|------|--------|----------|
| 🔴 High | Block immediately | `rm -rf /`, credential stealing |
| 🟡 Medium | Warn and require confirmation | `curl https://evil.com |
| 🟢 Low | Allow | Normal trusted commands |

- Pre-installation scan → scans all new skills for malicious patterns
- Pre-navigation scan → checks URLs against malicious/phishing domains
- Pre-execution scan → checks dangerous shell commands
- Continuous learning → updates detection patterns from your decisions

## 📦 Out-of-the-box Commercial Templates

Five general-purpose templates ready for immediate commercialization:

1. **AI Digital Human Self-Media** → Complete pipeline for account operation/content generation/publishing
2. **Coze Automatic Agent Development** → Framework for developing strategy agents that you can monetize by subscription/pay-per-use
3. **APP Tool Matrix** → Quickly build a collection of AI tools, ready to launch
4. **Content Creation (Novel First)** → Fully automatic pipeline for internet novel creation, ready for serialization
5. **Cross-border E-commerce Operation** → Automatic product selection/store operation, ready to go
5. **Abandoned Checkout Monitoring → Automatic tracking and reminder

All templates can be launched immediately after creation, no manual integration needed.

## 🛠️ Core Skills — All pre-configured ready to use

| Skill | Description | Token Saving |
|-------|-------------|-------------|
| `cli-anything` | Build agent-native CLI for any software, fixes Feishu token overflow | ✅ Local processing, 90% token saving |
| `hybrid-coding` | LLM fast draft + OpenCode verification/debugging → get both speed and quality | ✅ Draft local summary sent |
| `agent-browser` | Autonomous web browsing/searching, get real-time information | ✅ Full page processed locally, summary sent |
| `skill-defender` | Automatic safety scan protects you from malicious code/phishing/link visits | ✅ Scan done automatically |
| `auto-learning` | Automatic learning from mistakes, never repeat the same mistake | ✅ Learning done |
| `smart-m-recovery` | Multi-verify memory recovery after restart, always get the correct progress | ✅ Verified |
| `auto-resource-allocation` | Automatic parallel resource allocation based on your priority | ✅ All done |
| `deadline-monitor` | Gradual deadline tracking graduated reminders | ✅ Reminder emitted |
| `abandoned-checkout-monitor` | Cross-border e-commerce checkout abandoned reminder | ✅ Monitoring done |
| `viking-memory` | 🆕 **5-layer defensive memory architecture solves all 5 core memory problems | ✅ All indexed locally |
| `mem0` | Vector semantic memory for long-term retrieval | ✅ Search done |

## 📦 Quick Start

```bash
# 1. Clone the project
git clone https://github.com/zzeqii/oneman-company.git
cd oneman-company

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in your Volcano Ark access-key/secret-key and other configurations

# 4. Start core daemon
node paperclip_daemon.js &

# 5. Start OpenClaw session
openclaw start
```

## 🏗️ Project Structure

```
├── MEMORY.md               # Long-term curated memory
├── SOUL.md                     # Core persona and behavior rules
├── AGENTS.md                   # System operation specifications
├── paperclip_daemon.js       # Real-time tracking daemon
├── memory/                   # Daily log directory
├── skills/                   # Custom skills directory — viking-memory is here
├── projects/                 # All projects archived directory
└── .env                      # Environment configuration (git ignore this
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenClaw](https://github.com/openclaw/openclaw) — Core runtime
- [Paperclip](https://github.com/paperclipai/paperclip) — Memory system inspiration
- [mem9](https://github.com/mem9-ai/mem9) — Semantic memory engine
- [db9](https://db9.ai) — Cloud-native PostgreSQL made easy
- [OpenViking](https://github.com/volcengine/OpenViking) — Code context indexing
- [QMD](https://github.com/tobi/qmd) — Quark Markdown search
- [Agency Agents](https://github.com/msitarzewski/agency-agents) — Multi-agent architecture reference
- [CLI-Anything](https://github.com/HKUDS/CLI-Anything) — Token overflow solution

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zzeqii/oneman-company&type=Date)](https://star-history.com/#zzeqii/oneman-company)
