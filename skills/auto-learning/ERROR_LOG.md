# Error Log

Record of all errors, mistakes, and how they were fixed.

## Legend

- ✅ Fixed - Learned, won't repeat
- 🔄 In progress - Still learning
- ❌ Won't fix - Accepted as wontfix

---

## 2026-03-16

### Token Overflow on Feishu when sending images

**Scenario:** Sending large image as full base64 directly in Feishu message

**What went wrong:** 
- Total token count exceeded Feishu single request limit
- Feishu server rejected the request
- Session disconnected and needed restart

**Root cause:** 
- Didn't consider Feishu token limit
- Sending full binary as base64 wastes a lot of tokens

**How fixed:**
- Integrated [CLI-Anything](https://github.com/HKUDS/CLI-Anything)
- Built `cli-anything-imagemagick` for local image compression
- All large images processed locally, only text result sent to Feishu
- Token consumption reduced by ~90%

**General rule:** 
> Always compress large images locally with `cli-anything-imagemagick` before sending results to Feishu. Never send full base64 images directly.

**Status:** ✅ Fixed

---

### Git commit - forgot to push after commit

**Scenario:** Committed changes locally but forgot to push to remote, PR didn't have latest code

**What went wrong:** User had to remind me to push

**Root cause:** I only committed, stopped before push step

**How fixed:** 
- Added auto-push to workflow: after commit, automatically push to remote feature branch
- Always do commit + push together now

**General rule:**
> After committing changes to local Git, always push immediately to remote branch. Don't wait for user to remind.

**Status:** ✅ Fixed

---

### Did not create README for all new skills

**Scenario:** Added new skills but didn't add README, repo incomplete

**What went wrong:** User had to remind to add READMEs

**Root cause:** Forgot the requirement that all skills need README

**How fixed:** Now every new skill gets both SKILL.md and README.md

**General rule:**
> Every new skill must have:
> 1. `SKILL.md` - skill specification for OpenClaw
> 2. `README.md` - documentation for users
> 3. Both must be git added, committed, pushed

**Status:** ✅ Fixed

---

### Did not update project total README when adding new features

**Scenario:** Added new features but didn't update the main README, project documentation out of date

**Root cause:** Forgot to update total README

**How fixed:** Now after adding new core feature, always update main `README.md`

**General rule:**
> When adding a new core skill/feature, always update the project level `README.md` to document it.

**Status:** ✅ Fixed

---

### 2026-03-17 - Memory counting error misreported novel progress

**Scenario:** User asked for current novel progress, I incorrectly reported being at chapter 19 when actual progress was only 15 chapters

**What went wrong:**
- Misinterpreted git commit message "完成《金枝囚》第11-14章" as cumulative count to 19
- Didn't follow triple verification principle (check actual files first)
- Relied on fuzzy memory instead of actual file system check

**Root cause:**
- Didn't strictly follow the established rule: "session重启后三重校验原则 → 第一步必须核对项目最新大纲/需求原文，然后核对Git实际提交 > 项目最新大纲原文 > 旧报告文件，永远以项目文档原文为准"
- Counting error when parsing interval commit messages

**How fixed:**
- Already corrected by checking actual file count in chapters directory
- Enforced rule: **every time progress is reported, must count actual files before replying**
- Never rely on memory alone for progress counts

**General rule:**
> Always check actual file system to count completed chapters/files before reporting progress. Never rely on accumulated memory or parsed commit messages alone. Strictly follow triple verification: actual files > project document > Git commit > memory.

**Status:** ✅ Fixed
