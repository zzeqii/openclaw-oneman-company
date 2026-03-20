#!/bin/bash
# mem9-db9-memory-upgrade: 安装依赖

set -e

echo "🧠 mem9-db9 记忆机制升级 - 安装依赖"
echo "======================================"

# 创建必要目录
mkdir -p ~/.local/openclaw/{mem9,db9,openviking,qmd}
mkdir -p scripts

# 安装npm依赖
echo "📦 安装npm包..."
npm install \
  @mem9/mem9 \
  get-db9 \
  @kevinzhow/openclaw-memory-openviking \
  @tobilu/qmd

echo "✅ 依赖安装完成"
echo ""
echo "下一步: 运行 bash skills/mem9-db9-upgrade/scripts/init-databases.sh 初始化数据库"
