# auto-resource-allocation

> Automatic parallel project scheduling with dynamic priority-based resource allocation. Guarantees interactive responsiveness even when multiple background projects are running.

## Key Features

- **Full parallel execution** - Configurable max parallel tasks, all slots filled for maximum utilization
- **Dynamic priority-based allocation** - Higher priority projects get earlier slots and more resources
- **⚡ Interactive responsiveness guarantee** - **Always reserves 1 slot for immediate user response**
  - User interaction always gets priority, background processing never blocks
  - Your query always gets answered immediately
- **✅ Automatic milestone reporting** - Every small milestone (each novel chapter / each code file) completes → automatically triggers progress report to user
  - No need to ask for progress, you get notified immediately when something completes
  - Aggregated progress push keeps you updated without frequent checks
- **Automatic deadline tracking** - Integrated with `deadline-monitor` for graduated reminders (24h → 12h → 1h → 10m)
- **Automatic progress tracking** - Tracks completion percentage for all projects
- **Background batch processing** - Keeps CPU busy all the time, no idle capacity wasted

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
