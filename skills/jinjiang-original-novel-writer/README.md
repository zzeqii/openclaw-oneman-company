# jinjiang-original-novel-writer

fully automatic original ancient romance novel writing skill that matches Jinjiang (晋江) platform audience preferences, with:

- S-level爆款 structure pacing that hits all popularity hot points
- Character consistency checking
- Chapter-by-chapter plot point verification against outline
- Built-in knowledge base of Jinjiang winning elements
- Full automation from outline to finished chapters

## Token Saving Strategy

**This is the key fix for token overflow:**
- Full outline stored locally, only current chapter context sent to chat
- Each chapter written locally incrementally
- Only final chapter text + verification result sent to Feishu
- **Token consumption reduced by ~90%** compared to sending full outline + all history every time

## Workflow

1. Full outline stored in project folder locally
2. Session restart → smart-memory-recovery verifies chapter position against outline
3. Only current chapter's previous 1-2 chapters + outline points sent
4. Write new chapter → save locally → send only new chapter to Feishu
