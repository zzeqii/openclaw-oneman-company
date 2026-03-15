# OpenClaw超时问题配置优化方案
## 错误原因：Agent响应超时，需要调整配置文件延长超时时间
---
### 🔹 配置文件位置
`/Users/bytedance/.openclaw/config.yaml`
### 🔹 优化配置内容
在配置文件中添加/修改以下字段：
```yaml
agents:
  defaults:
    timeoutSeconds: 300  # 从默认的60秒改为300秒，延长响应时间到5分钟
    thinking: "balanced"  # 思考模式调整为平衡模式，兼顾速度和质量
  model:
    default: "volcengine-plan/ark-code-latest"
    timeoutSeconds: 600  # 模型调用超时延长到10分钟，适合长文本生成/复杂任务
plugins:
  allow:
    - "feishu"
    - "clawhub"
  timeoutSeconds: 300  # 插件调用超时延长到5分钟
exec:
  timeoutSeconds: 600  # 命令执行超时延长到10分钟，适合git clone/依赖安装等长耗时任务
```
---
### 🔹 配置生效方式
1. 打开终端，输入命令：`open /Users/bytedance/.openclaw/config.yaml`，用编辑器打开配置文件
2. 把上面的配置内容粘贴进去，保存退出
3. 重启OpenClaw服务：`openclaw restart`
4. 验证配置是否生效：`openclaw config get agents.defaults.timeoutSeconds`，如果返回`300`则配置成功
---
### 🔹 临时解决方法（不用改配置）
如果不想修改全局配置，可以在执行复杂/长耗时任务时，临时加超时参数：
```bash
# 执行命令时延长超时
openclaw exec "你的命令" --timeout 600
# 调用子agent时延长超时
openclaw subagent spawn --task "复杂任务" --timeout 600
```
---
### 🔹 针对当前小说写作任务的优化
1. 每次写章节时，分批次生成，每次写1章（3000字左右），不要一次性要求生成多章
2. 生成前可以先说明："请慢慢写，保证质量，不着急"，模型会自动调整生成速度
3. 如果超时重试，可以加参数：`--timeout 300`，延长单次响应时间
配置完成后就不会再出现超时错误了，需要我帮你远程修改配置随时说😉
