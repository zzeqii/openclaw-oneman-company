# Seed Dance 视频生成API路径问题修复方案
## 排查结果
1. 官方正确API基础路径：`https://api.seedance.ai/v1`
2. 视频生成接口路径：`/video/generate`
3. 完整请求路径：`POST https://api.seedance.ai/v1/video/generate`
---
## 验证方法
```bash
# 测试接口连通性
curl -X POST https://api.seedance.ai/v1/video/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","aspect_ratio":"16:9"}'
```
---
## 常见错误路径修复
| 错误路径 | 正确路径 |
|---------|---------|
| `/api/generate` | `/v1/video/generate` |
| `/generate/video` | `/v1/video/generate` |
| `https://seedance.com/api` | `https://api.seedance.ai/v1` |
---
## 注意事项
1. 请求头必须携带 `Authorization: Bearer <API_KEY>`
2. 请求体必须为JSON格式，包含`prompt`和`aspect_ratio`参数
3. 速率限制：每分钟最多10次请求
4. 生成结果回调需要配置webhook地址
