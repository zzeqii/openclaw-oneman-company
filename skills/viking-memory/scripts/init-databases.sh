#!/bin/bash
# viking-memory: 初始化数据库
# db9 是云托管服务，不需要本地启动server

set -e

echo "🗄️  viking-memory 初始化数据库"
echo "=================================="

# 检查npx
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found, please install node.js first"
    exit 1
fi

# 创建环境配置文件
if [ ! -f .env.memory ]; then
    echo "⚙️  创建环境配置文件 .env.memory"
    cat > .env.memory << 'EOF'
# mem9 配置
MEM9_DATA_DIR=~/.local/openclaw/mem9
MEM9_EMBEDDING_MODEL=text-embedding-3-small

# db9 配置
# 你需要在 https://db9.ai 注册账号，获取connection string后填入这里
# DB9_CONNECTION_STRING=postgresql://username:password@localhost:5432/openclaw_memory
DB9_CONNECTION_STRING=
DB9_TOKEN=

# OpenViking 配置
OPENVIKING_INDEX_DIR=~/.local/openclaw/openviking
OPENVIKING_ENABLED=true

# QMD 配置
QMD_INDEX_PATH=~/.local/openclaw/qmd/index.db
QMD_EMBEDDING_ENABLED=true

# OpenAI 配置（用于embedding）
OPENAI_API_KEY=
EOF
fi

# 加载环境变量
export $(grep -v '^#' .env.memory | xargs)

# 检查db9配置
if [ -z "$DB9_CONNECTION_STRING" ]; then
    echo "⚠️  请先在 .env.memory 中配置你的db9连接字符串"
    echo "   1. 使用 db9 create 创建数据库"
    echo "   2. 获取连接字符串填入 .env.memory"
    echo "   3. 重新运行此脚本"
    exit 1
fi

# 使用get-db9初始化监控表
echo "🚀 使用get-db9初始化监控表..."
node skills/viking-memory/scripts/init-db.js

# 初始化OpenViking
echo "🧗 初始化 OpenViking 上下文索引..."
node skills/viking-memory/scripts/init-openviking.js

# 初始化QMD
echo "🔍 初始化 QMD 文档索引..."
node skills/viking-memory/scripts/init-qmd.js

# 初始化mem9
echo "🧠 初始化 mem9 记忆引擎..."
node skills/viking-memory/scripts/init-mem9.js

echo ""
echo "🎉 所有数据库初始化完成！"
echo ""
echo "下一步: 运行 bash skills/viking-memory/scripts/start-memory-stack.sh 启动服务"
