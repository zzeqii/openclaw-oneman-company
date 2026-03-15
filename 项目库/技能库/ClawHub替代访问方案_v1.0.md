# ClawHub替代访问方案_v1.0
---
## 🔍 核心发现
### 官方ClawHub主站（暂不可用）
- 官方域名为 `clawhub.com`，目前直接访问不可达
- 备用域名 `clawhub.org`/`clawhub.dev`/`clawhub.xyz` 均无法连接

## 📋 可用技能获取路径（按优先级排序）
| 优先级 | 类型 | 地址 | 内容 | 优势 |
|--------|------|------|------|------|
| 1 | 官方镜像 | https://github.com/openclaw/skills | ClawHub全量技能归档备份，1分钟前更新 | 内容与主站完全同步，访问稳定 |
| 2 | 官方镜像 | https://github.com/openclaw/clawhub | OpenClaw官方技能目录 | 分类清晰，更新及时 |
| 3 | 社区精选 | https://github.com/LeoYeAI/openclaw-master-skills | 339+精选技能合集，每周同步ClawHub+社区贡献 | 经过人工筛选，质量更高 |
| 4 | 垂直领域 | https://github.com/FreedomIntelligence/OpenClaw-Medical-Skills | 医疗领域专属技能库 | 行业专项技能专业 |

## 💡 技能安装方式
```bash
# 从官方镜像安装技能
openclaw skill install https://github.com/openclaw/clawhub/skills/<skill-name>

# 从社区合集安装
openclaw skill install https://github.com/LeoYeAI/openclaw-master-skills/skills/<skill-name>
```

## 🔄 后续维护
官方ClawHub主站恢复后，可优先使用官方渠道，GitHub镜像会持续同步更新。
