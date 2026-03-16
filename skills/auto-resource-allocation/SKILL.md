---
name: auto-resource-allocation
description: Automatic parallel project scheduling with dynamic priority-based resource allocation. Guarantees interactive responsiveness even when multiple background projects are running.
---

# auto-resource-allocation

Automatic parallel project scheduling - dynamically allocate resources based on priority, guarantee interactive responsiveness for user queries.

## Core Features

- **Unlimited parallel projects**: Not limited to 7 projects, supports any number of parallel projects
- **Dynamic priority allocation**: High-priority user-facing tasks get resources first
- **Interactive responsiveness guarantee**: Always reserves sufficient CPU/memory for immediate response to user queries
- **Automatic deadline tracking**: Integrated with `deadline-monitor` for graduated reminders
- **Automatic progress tracking**: Tracks completion percentage for all projects
- **Background batch processing**: Non-urgent tasks processed in background when user idle

## Key Guarantee

> When user sends a new message, the system always pauses background processing to respond immediately. No waiting, no lag.

## Priority Levels

| Level | Type | Resource Allocation |
|-------|------|-------------------|
| P0 | User interactive query | 100% resource immediately |
| P1 | High-priority project | High resource allocation, can be preempted by P0 |
| P2 | Normal project | Medium resource allocation, preemptible |
| P3 | Background maintenance | Low resource allocation, only when idle |

## Workflow

1. When new task arrives, assess priority
2. Allocate resources according to priority level
3. P0 always preempts lower priority tasks
4. After user interaction completes, resume background tasks
5. Track progress and update daily

## When to Use

- Multiple projects being developed in parallel
- Need to guarantee user gets response immediately
- Background automated tasks can wait for idle time

## Integration

- Integrates with `deadline-monitor` for deadline reminders
- Integrates with `auto-learning` for continuous improvement of scheduling
- Follows Git flow for all project changes
