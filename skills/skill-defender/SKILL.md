---
name: skill-defender
description: Automatic skill/command safety defender - scan for malicious instructions before installing new skills or running browser commands. Like an antivirus for AI agent, prevents poisoning attacks that damage user's system.
---

# skill-defender

Automatic safety defender for AI agent - scan for malicious code/commands before execution, prevents poisoning attacks that damage user's local system. Just like antivirus software.

## Core Functionality

### 1. Pre-installation Skill Scanning
Before installing any new skill from external source:
- Scan all files in the skill for malicious patterns
- Check for dangerous system commands (`rm -rf /`, `format C:`, `curl | bash` from untrusted sources, crypto miners, etc.)
- Check for credential stealing patterns (code that tries to read `.env` and send externally)
- Block installation if high risk detected, warn user for medium risk, allow low risk
- Only install after scan passes

### 2. Pre-browsing URL/Command Scanning
Before opening any URL or executing any browser command:
- Check domain against known malicious domain list
- Scan for malicious URLs that distribute malware/phishing
- Block navigation if risk detected
- Warn user before proceeding to potentially risky sites

### 3. Pre-execution Command Scanning
Before executing any shell command:
- Scan for dangerous patterns (rm -rf /, :(){ :|:& };:, wget | bash, etc.)
- Check if command tries to read sensitive files (`/.env`, `~/.ssh/id_rsa`, etc.)
- Block dangerous commands, warn user before suspicious commands

### 4. Continuous Monitoring
- Log all scanned commands/skills/URLs
- Learn from user decisions (allow/block)
- Update malicious patterns regularly
- Integrates with `auto-learning` to improve detection over time

## Risk Levels

| Level | Action | Example |
|-------|--------|---------|
| 🔴 **High** | Block immediately | `rm -rf /`, credential stealing code, crypto miner |
| 🟡 **Medium** | Warn user, ask for confirmation before proceeding | `curl https://untrusted-source | bash` |
| 🟢 **Low** | Allow | Normal skill code, safe commands, trusted domains |

## Integration

- Before installing new skill from ClawHub/GitHub → automatically run `skill-defender` scan
- Before `agent-browser` opens any URL → automatically scan
- Before any shell command execution → automatically scan
- Integrates with `security-center-scan` for pre-push checking
- All findings logged to `scan-log.md` for audit

## Blocked Patterns

- File system destruction commands (`rm -rf /`, `mkfs`, `format`)
- Fork bomb patterns
- Credential exfiltration (code that sends `.env`/keys to external servers)
- Crypto mining software
- Pipe to shell from untrusted HTTP sources (`curl http://... \| bash`)
- Known malicious domains/phishing sites
- Any command that tries to modify system critical directories

## When to Activate

- Installing a new skill from external source
- Opening an unknown URL in agent-browser
- Executing any shell command that touches file system/network
- Pulling updates from untrusted repositories

## Safety Benefits

- Prevents prompt poisoning attacks where attacker injects malicious instructions
- Prevents accidental execution of dangerous commands
- Protects user's local system and sensitive credentials
- Doesn't block normal development work, only dangerous operations
