# hybrid-coding

> Hybrid coding pattern - combines LLM fast draft generation + OpenCode validation/debugging. Get both speed and quality.

## Workflow

```
User Requirement → 1. Agent LLM generates code draft + architecture → 2. OpenCode validates/compiles/debugs/fixes → 3. Merge and deliver
```

## Phases

### 1. Agent Draft Generation
- Quick architecture design based on requirement
- Generate all code files following project conventions
- Write README and usage documentation
- Output complete compilable code framework

### 2. OpenCode Validation & Fix
- Compile checking, find syntax/dependency errors
- Auto fix compilation issues
- Verify function correctness
- Add missing edge case handling
- Run unit tests
- Fix failing tests

### 3. Merge & Deliver
- Agent merges OpenCode fixes
- Generate final delivery documentation
- Security scan for sensitive info
- Git commit and push

## When to Use

- APP tool matrix development (app_matrix project)
- Coze automatic strategy Agent development
- Any coding project that needs both speed and landing quality
- Projects that need compiled verification after generation

## Benefits

| Mode | Speed | Quality | Landing |
|------|-------|---------|----------|
| Pure Agent | ⚡ Fast | ⭐ Medium | May have compile/debug issues |
| Pure OpenCode | 🐢 Slow | ⭐⭐⭐⭐ High | Needs more rounds |
| **Hybrid** | ⚡ Fast | ⭐⭐⭐⭐ High | Perfect balance - Agent architecture + OpenCode verification |

## Example

```
@hybrid-coding build a new todo app with react + go backend
```

## Author

One-Man Company AI Agent
