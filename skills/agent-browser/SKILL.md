---
name: agent-browser
description: Autonomous browser capability - open web pages, click buttons, fill forms, take screenshots, search online for real-time information, verify facts, fetch latest data. Inspired by Tavily/AgentBrowser.
---

# agent-browser

Autonomous browser capability for AI agent - search the web autonomously, interact with web pages, get real-time up-to-date information.

## Core Features

- 🔍 **Autonomous web search**: Search for any information, get latest results
- 🖱️ **Interactive navigation**: Open web pages, click buttons, fill forms, navigate between pages
- 📸 **Screenshot capability**: Capture webpage screenshots for visual information
- 📡 **Real-time information**: Get up-to-date news, data, stats that training data doesn't have
- ✅ **Fact verification**: Verify claims against latest online sources
- 🕷 **Content extraction**: Extract structured information from web pages
- 🔒 **Safe browsing**: Integrates with `skill-defender` to scan for malicious content before execution

## Workflow

```
User asks for information → 
1. Check if we already have latest information in memory → if yes, answer directly
2. If not, or need real-time/latest data → open browser/search → 
3. Navigate to relevant pages → extract information → 
4. Verify from multiple sources → 
5. Summarize and answer user with citations
```

## Capabilities

- Search Google/Bing for information
- Open specific URLs
- Click elements by selector/text
- Fill and submit forms
- Scroll pages
- Take screenshots
- Extract text/content from pages
- Follow links and navigate

## When to Use

- Need real-time/latest information (news, prices, stats, current events)
- Verify facts against external sources
- Fetch documentation from official websites
- Check latest versions of software
- Research market trends
- any other information that's not in our memory

## Integration

- Integrates with `skill-defender` for automatic safety scanning before browsing/execute
- Integrates with `auto-learning` - learn what information sources are most reliable
- Results stored in memory - next time same query answered faster
- Follows token saving principle - full pages stored locally, only summary sent to chat

## Safety

- All external content scanned by `skill-defender` before processing
- Block known malicious domains
- No automatic downloads without user confirmation
- Sandboxed browsing environment where possible
