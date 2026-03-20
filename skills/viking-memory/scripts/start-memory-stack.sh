#!/bin/bash
# viking-memory: 启动完整记忆栈

set -e

# 加载环境变量
if [ -f .env.memory ]; then
    export $(grep -v '^#' .env.memory | xargs)
fi

echo "🚀 启动 viking-memory 记忆栈"
echo "======================"

# 验证所有服务
echo "🧪 验证服务连接..."

node skills/viking-memory/scripts/health-check.js
