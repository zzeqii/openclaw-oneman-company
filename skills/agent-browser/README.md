# agent-browser

> Autonomous browser capability - open web pages, click buttons, fill forms, take screenshots, search online for real-time information, verify facts, fetch latest data.

## Core Features

- 🔍 **Autonomous web search** - Search for any information, get latest results
- 🖱️ **Interactive navigation** - Open web pages, click buttons, fill forms, navigate between pages
- 📸 **Screenshot capability** - Capture webpage screenshots for visual information
- 📡 **Real-time information** - Get up-to-date news, data, stats that training data doesn't have
- ✅ **Fact verification** - Verify claims against latest online sources
- 🕷 **Content extraction** - Extract structured information from web pages
- 🔒 **Safe browsing** - Integrates with `skill-defender` to scan for malicious content before execution

## Workflow

```
User asks for information → 
 1. Check if we already have latest information in memory → if yes, answer directly
 2. If not, or need real-time/latest data → open browser/search → 
 3. Navigate to relevant pages → extract information → 
 4. Verify from multiple sources → 
 5. Summarize and answer user with citations
```

## When to Use

- Need real-time/latest information (news, prices, stats, current events)
- Verify facts against external sources
- Fetch documentation from official websites
- Check latest versions of software
- Research market trends
- Any other information that's not in our memory

## Integration

### Tavily Integration

We integrate with Tavily for best results:
- **Quick search**: Use Tavily API for fast summarised search (if API configured)
- **Deep interaction**: If you need full content or interactive navigation, `agent-browser` opens the page and extracts content automatically
- Combined approach gives you both speed and depth

### Other Integrations

- **Safety**: All external content scanned by `skill-defender` before processing
- **Learning**: Integrates with `auto-learning` - learns what information sources are most reliable
- **Token saving**: Full pages stored locally, only summary sent to chat → token saving
- **Memory**: Results stored in memory - next time same query answered faster

## Author

One-Man Company AI Agent
