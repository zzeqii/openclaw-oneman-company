---
name: auto-learning
description: Automatic learning and self-improvement - record errors, user corrections, and continuously improve behavior rules. Avoid repeating the same mistakes.
---

# auto-learning

Automatic self-improvement skill - learn from mistakes and user corrections, continuously improve.

## Core Functionality

When the agent makes mistakes, gets corrected by user, or finds better ways of doing things:
1. **Automatically record** the error, correction, and better practice
2. **Persist** the learning in markdown log and update AGENTS.md rules
3. **Generalize** the learning to similar scenarios
4. **Self-reflect** at end of session, summarize improvements for next time

## Key Mechanisms

### 1. Automatic Error Capture
- When tool calls fail, logic gets stuck, or output is wrong
- Automatically extract error message + context
- Write to error log markdown with:
  - What went wrong
  - Error message
  - Context when it happened
  - How it was fixed

### 2. User Correction Recording
- When user says "wrong, should be like this"
- Automatically record user's correction and preference
- Store as persistent memory
- Update AGENTS.md with new rule if it's a general rule

### 3. Learning Generalization
- Periodically extract frequent learnings
- Turn into:
  - Prompt optimization suggestions
  - New behavior rules for AGENTS.md
  - Even code snippets for skills
- Generalize from specific mistake to general rule

### 4. Self-Reflection at Session End
- At the end of session, self-reflect:
  - What went well
  - What went wrong
  - How to improve next time
- Write reflection to daily memory

## Workflow

```
Agent makes mistake → User notices and corrects → Agent:
  1. Understand the mistake and correction
  2. Record to error log (skills/auto-learning/ERROR_LOG.md)
  3. If it's a general rule, update AGENTS.md with new rule
  4. Next time similar problem → retrieve learned rule first → avoid repeating mistake
```

## When to Activate

- Tool call fails (non-temporary error)
- User explicitly says "you're wrong" / "not like this" / "should be like this"
- At end of session (daily self-reflection)
- When merging PR, review what was learned

## Log Structure

```
skills/auto-learning/
├── SKILL.md
├── README.md
├── ERROR_LOG.md            # Record of all errors and fixes
├── LEARNINGS.md            # Generalized learnings and rules
└── REFLECTIONS/            # Daily/weekly reflections
    └── YYYY-MM-DD.md
```

## Integration with Existing Architecture

- Works with `smart-memory-recovery` - learning is stored in Git, recovered on restart
- Works with `mem0` - semantic search to find similar past mistakes
- Works with `security-center-scan` - no sensitive info in logs
- Follows Git flow - all changes committed and pushed

## Example

**Before:**
> Agent: "Let me send this full-size image as base64" → token overflow → disconnected

**After:**
> Agent: "Oh right, I learned before that big images need to be compressed locally with cli-anything-imagemagick first" → compress locally → send text result → no overflow

## Benefits

- ❌ Before: Same mistakes repeated every time
- ✅ After: Learn once → never repeat → continuously get better
