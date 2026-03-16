# auto-learning

> Automatic self-improvement - learn from mistakes and user corrections, continuously improve behavior, avoid repeating the same mistakes.

## Core Idea

AI agents often repeat the same mistakes. This skill solves that:

1. **Record every mistake and correction**
2. **Generalize into rules** for similar scenarios
3. **Retrieve learned rules** before acting next time
4. **Never repeat** the same mistake twice

## Structure

```
skills/auto-learning/
├── SKILL.md          # Skill specification
├── README.md         # This file
├── ERROR_LOG.md      # Detailed error log - what went wrong, how fixed
├── LEARNINGS.md      # Generalized learnings and rules
└── REFLECTIONS/      # Daily/weekly self-reflections
    └── template.md
```

## Workflow

### When Something Goes Wrong

1. **Capture**: Error happens → capture error message + context
2. **Fix**: Find the correct way (or get corrected by user)
3. **Record**: Write to `ERROR_LOG.md` with:
   - Date
   - Scenario
   - What went wrong
   - Error message
   - How it was fixed
4. **Generalize**: If it's a general problem, add rule to `LEARNINGS.md` and update `AGENTS.md` if needed

### When User Corrects You

1. **Listen**: Understand user's correction and preference
2. **Record**: Write to `ERROR_LOG.md` or `LEARNINGS.md`
3. **Update Rules**: If it's a general behavior rule, update `AGENTS.md`
4. **Persist**: Commit to Git so learning persists across sessions

### Daily Self-Reflection

At the end of day/session:

1. Review what happened today
2. What went well? What went wrong?
3. What can be improved tomorrow?
4. Write reflection to `REFLECTIONS/YYYY-MM-DD.md`
5. Weekly: Summarize frequent mistakes and update general rules

## Integration with Memory Architecture

Our complete memory architecture now:

| Layer | Responsibility | Skill |
|-------|----------------|-------|
| **Base Storage** | Unified memory framework | `memory-enhancement` |
| **Semantic Search** | Find memories by meaning, not just keywords | `mem0` |
| **Crash Recovery** | 100% accurate recovery after session restart | `smart-memory-recovery` |
| **Git Backup** | Version control for all code/docs | Git |
| **🚀 Auto Learning** | Learn from mistakes, continuously improve | ✅ `auto-learning` (this skill) |

This is the **complete 5-layer memory architecture**:

```
Base → Semantic → Recovery → Backup → Learning
```

Every layer does what it does best, together they give you:
- ✅ Never lose progress
- ✅ Never repeat the same mistake
- ✅ Continuously get better every day
- ✅ 100% recovery after restart

## Example Entry in ERROR_LOG.md

```markdown
### 2026-03-16 - Token Overflow on Feishu

**Scenario**: Sending large image as base64 directly to Feishu

**What went wrong**: Token count exceeded Feishu limit → connection rejected → session restart

**How fixed**: Use `cli-anything-imagemagick` to compress image locally, only send text result with path to Feishu. Token consumption reduced by 90%.

**General rule**: Always compress large images locally before sending text to Feishu. Never send full base64.
```

## Benefits

- ❌ Before: Same mistakes repeated over and over
- ✅ Now: Learn once → never repeat → continuously improve
- ❌ Before: User has to correct the same thing every time
- ✅ Now: Corrected once → remembered forever → user happier

## Author

One-Man Company AI Agent
