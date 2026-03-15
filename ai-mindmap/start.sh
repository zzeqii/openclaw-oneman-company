#!/bin/bash

echo "🚀 启动 AI 思维导图工具开发环境"

echo ""
echo "📦 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install
fi

echo ""
echo "🔧 配置后端环境..."
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "⚠️  已创建 .env 文件，如需真实AI生成请配置 OpenAI API Key"
fi

echo ""
echo "📦 安装前端依赖..."
cd ../frontend
if [ ! -d "node_modules" ]; then
  npm install
fi

echo ""
echo "🎉 环境准备完成！"
echo ""
echo "📋 启动命令："
echo "  1. 启动后端服务: cd backend && npm start"
echo "  2. 启动前端服务: cd frontend && npm run dev"
echo ""
echo "🌐 访问地址："
echo "  前端页面: http://localhost:3000"
echo "  后端API: http://localhost:3001"
echo ""
echo "💡 提示：默认使用Mock数据，无需配置API Key即可体验完整功能"
