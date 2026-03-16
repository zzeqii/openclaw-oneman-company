# auto-resource-allocation

> Automatic parallel project scheduling with dynamic priority-based resource allocation. Guarantees interactive responsiveness even when multiple background projects are running.

## Key Features

- **Unlimited parallel projects** - Not limited to any fixed number, scales to any number of projects
- **Dynamic priority-based allocation** - Higher priority projects get more resources
- **⚡ Interactive responsiveness guarantee** - **Always reserves capacity for immediate user response**
  - When user sends a message, background tasks are paused immediately
  - User gets instant response, no waiting
  - After interaction completes, background processing resumes automatically
- **Automatic deadline tracking** - Integrated with `deadline-monitor` for graduated reminders (24h → 12h → 1h → 10m)
- **Automatic progress tracking** - Tracks completion percentage for all projects
- **Background batch processing** - Non-urgent maintenance tasks run when user is idle

## Priority Levels

| Level | Type | Resource Allocation | Preemptible |
|-------|------|-------------------|-------------|
| **P0** | User interactive query | 100% immediately | ❌ No |
| **P1** | High-priority project | High allocation | ✅ Yes (by P0) |
| **P2** | Normal project | Medium allocation | ✅ Yes |
| **P3** | Background maintenance | Low allocation, idle only | ✅ Yes |

## Guarantee

> **User experience always comes first** - background processing never blocks user interaction. Your query always gets answered immediately.

## Integration

- `deadline-monitor` - Deadline tracking and reminders
- `auto-learning` - Continuous improvement of scheduling based on past experience
- `security-center-scan` - Security scan before Git push
- Follows standard Git flow - feature branch → PR → merge

## When to Use

- Multiple projects under development in parallel
- Need to guarantee immediate response to user
- Have background automated tasks that can wait for idle time

## Author

One-Man Company AI Agent
