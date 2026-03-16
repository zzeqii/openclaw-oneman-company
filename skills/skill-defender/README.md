# skill-defender

> Automatic safety defender for AI agent - like an antivirus, scans for malicious instructions before installation/browsing/execution, prevents poisoning attacks that damage your system.

## Core Idea

AI agents can be instructed to execute arbitrary code/commands. This creates a risk:
- Malicious actors can inject malicious instructions through poisoned prompts
- Accidental dangerous commands can destroy your system data
- Stolen credentials can leak to third parties

`skill-defender` provides **automatic protection** before any dangerous operation.

## Core Features

### 1. Pre-installation Skill Scanning
Before installing any new skill from external source:
- Scan all files for malicious patterns
- Check for dangerous system commands, credential stealing, crypto miners
- Block high-risk, warn for medium-risk, allow low-risk
- Only install after scan passes

### 2. Pre-browsing URL Scanning
Before opening any URL in autonomous browser:
- Check domain against known malicious/phishing domain list
- Block navigation to risky sites
- Warn user before proceeding to unknown sites

### 3. Pre-execution Command Scanning
Before running any shell command:
- Scan for dangerous patterns (`rm -rf /`, fork bombs, credential stealing, etc.)
- Check if command accesses sensitive files (`.env`, `~/.ssh/id_rsa`)
- Block dangerous commands, warn before suspicious ones

### 4. Continuous Improvement
- All scans logged to `scan-log.md` for audit
- Learns from user decisions (allow/block)
- Updates malicious patterns automatically via `auto-learning`

## Risk Levels

| Level | Icon | Action | Examples |
|-------|------|--------|----------|
| High | 🔴 | Block immediately | `rm -rf /`, credential stealing code, crypto miners |
| Medium | 🟡 | Warn user, require confirmation | `curl https://untrusted-source | bash` |
| Low | 🟢 | Allow | Normal skill code, safe commands, trusted domains |

## Blocked Patterns

- File system destruction commands (`rm -rf /`, `mkfs`, `format`)
- Fork bomb patterns (`:(){ :|:& };:`)
- Credential exfiltration (code that sends `.env`/keys to external servers)
- Crypto mining software
- Pipe to shell from untrusted HTTP sources (`curl http://... | bash`)
- Known malicious domains/phishing sites
- Any command that tries to modify system critical directories

## Integration with Whole System

```
Install new skill → skill-defender scan → pass → install
Open URL → skill-defender scan → pass → browse
Execute command → skill-defender scan → pass → execute
```

- Integrates with `agent-browser` → automatic scan before browsing
- Integrates with `security-center-scan` → pre-push security check
- Integrates with `auto-learning` → continuously improves detection
- Follows token saving principle → scan done locally, only summary sent to chat

## Safety Benefits

- ✅ Prevents prompt poisoning attacks
- ✅ Prevents accidental execution of dangerous commands
- ✅ Protects user's local system and sensitive credentials
- ✅ Doesn't block normal development work, only dangerous operations
- ✅ Automatic protection, user only needs to confirm medium risks

## Author

One-Man Company AI Agent
