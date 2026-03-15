# GitHub 自动提交配置指南

## 方式一：使用GitHub Token（推荐）
1. 前往 https://github.com/settings/tokens 创建个人访问令牌（PAT）
   - 勾选 `repo` 权限
   - 勾选 `workflow` 权限（如果需要触发GitHub Actions）
   - 有效期建议设置为90天
2. 将Token添加到环境变量：
   ```bash
   export GITHUB_TOKEN=your_personal_access_token
   ```
3. 配置远程仓库地址：
   ```bash
   git remote set-url origin https://${GITHUB_TOKEN}@github.com/zzeqii/openclaw-one-man-company.git
   ```
4. 测试推送：
   ```bash
   git push -u origin main
   ```

## 方式二：使用SSH密钥
1. 生成SSH密钥（如果还没有）：
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```
2. 将公钥添加到GitHub账号：https://github.com/settings/keys
3. 配置远程仓库地址：
   ```bash
   git remote set-url origin git@github.com:zzeqii/openclaw-one-man-company.git
   ```
4. 测试推送：
   ```bash
   git push -u origin main
   ```

## 自动同步配置
配置完成后，将Token添加到`.env`文件：
```env
GITHUB_TOKEN=your_personal_access_token
GITHUB_REPO=zzeqii/openclaw-one-man-company
```

系统会自动在每次功能更新、任务完成后执行以下操作：
1. 自动生成更新日志
2. 提交变更到本地仓库
3. 推送到GitHub远程仓库
4. 定期生成版本标签和Release说明
