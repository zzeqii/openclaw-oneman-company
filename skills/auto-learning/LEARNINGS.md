# General Learnings

Generalized rules and best practices learned from mistakes and user corrections.

---

## Git Workflow

1. **Always commit + push together** - After committing locally, immediately push to remote. Don't wait for user reminder.
2. **All new skills need two files**:
   - `SKILL.md` - OpenClaw skill specification
   - `README.md` - User documentation
3. **When adding new core features, always update project level `README.md`**
4. **Follow the Git flow**: Never push directly to main, always use feature branch → PR → merge
5. **Always run `security-center-scan` before pushing** to check for sensitive info leaks

## Feishu Token Limit

1. **Never send full base64 images directly to Feishu** - Always compress locally with `cli-anything-imagemagick` first
2. **Large files processed locally, only send structured text results to Feishu** - keeps token usage under 90%
3. **For long documents, send summary first, full content stored locally**

## Coding

1. **Use `hybrid-coding` for all coding projects**: 
   - Agent creates architecture and draft code
   - OpenCode does verification, compilation, debugging
   - Gets both speed and quality
2. **Always include unit tests** for new modules
3. **Always include README** for new tools

## Memory & Recovery

1. **session restart → always run `smart-memory-recovery` first** - verify all project positions against Git + docs before continuing
2. **Memory check order: `actual files on disk > Git log > documentation > old memory`** - always trust actual files first
3. **Before reporting progress, always count actual files on disk** - never rely on memory or commit message parsing alone
4. **Code projects MUST follow the triple verification rule**:
   - Always check actual file structure + code lines before reporting progress
   - Never trust old memory or outdated documentation alone
   - If in doubt, `find .` + `wc -l` immediately to confirm
5. **Startup reading order is mandatory**:
   - (1) yesterday's daily log → (2) today's daily log → (3) MEMORY.md (main session only)
   - Daily log always has the latest actual status, always trust daily log over old summaries in MEMORY
   - Never skip reading daily logs
6. **Four-layer memory + learning**:
   - Base Storage: `memory-enhancement`
   - Semantic Search: `mem0`
   - Crash Recovery: `smart-memory-recovery`
   - Git Backup: Git version control
   - Auto Learning: `auto-learning` - this file

## Behavior

1. **When user says you're wrong, don't argue - learn it** - record the correction and don't repeat
2. **Be concise when answering - skip filler words like "Great question!" - just help** (from SOUL.md)
3. **Only speak when you can add value** - in group chats, don't comment every message
4. **Write things down - no mental notes** - everything important goes to a file
### Pre-push Security Scan Now Enabled
