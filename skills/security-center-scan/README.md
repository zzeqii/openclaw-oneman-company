# security-center-scan

Security scanning before Git push - prevents sensitive information (API keys, access tokens, secrets) from being leaked to GitHub.

## Features

- Keyword scanning for API Key, App Secret, Access Token, etc.
- Open-source dependency vulnerability scanning
- Blocks push if leaks found before they happen
- Integrated with Git flow, runs automatically after commit before push

## Token Saving

All scanning runs locally, only scan results summary sent to chat - low token usage.
