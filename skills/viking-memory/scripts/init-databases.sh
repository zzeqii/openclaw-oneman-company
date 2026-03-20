#!/bin/bash
# mem9-db9-memory-upgrade: 初始化数据库

set -e

echo "🗄️  初始化数据库"
echo "================"

# 检查db9是否安装
if ! command -v db9-server &> /dev/null; then
    echo "🚀 安装 db9-server..."
    npm install -g db9-server
fi

# 创建环境配置文件
if [ ! -f .env.memory ]; then
    echo "⚙️  创建环境配置文件 .env.memory"
    cat > .env.memory << 'EOF'
# mem9 配置
MEM9_DATA_DIR=~/.local/openclaw/mem9
MEM9_EMBEDDING_MODEL=text-embedding-3-small

# db9 配置
DB9_CONNECTION_STRING=postgresql://localhost:5432/openclaw_memory
DB9_AUTO_START=true

# OpenViking 配置
OPENVIKING_INDEX_DIR=~/.local/openclaw/openviking
OPENVIKING_ENABLED=true

# QMD 配置
QMD_INDEX_PATH=~/.local/openclaw/qmd/index.db
QMD_EMBEDDING_ENABLED=true
EOF
fi

# 启动db9并创建数据库
echo "🚀 启动 db9-server 并创建监控数据库..."
db9-server start &
sleep 3

# 使用get-db9初始化监控表
node -e "
const { Client } = require('get-db9');
const client = new Client(process.env.DB9_CONNECTION_STRING || 'postgresql://localhost:5432/openclaw_memory');

client.connect().then(async () => {
  console.log('Connected to db9');
  
  // 创建监控表
  await client.query(`
    CREATE TABLE IF NOT EXISTS memory_operations (
      id SERIAL PRIMARY KEY,
      operation_type VARCHAR(50) NOT NULL,
      query_text TEXT,
      result_count INTEGER,
      latency_ms DOUBLE PRECISION,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS performance_metrics (
      id SERIAL PRIMARY KEY,
      metric_name VARCHAR(100) NOT NULL,
      metric_value DOUBLE PRECISION NOT NULL,
      labels JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS consistency_checks (
      id SERIAL PRIMARY KEY,
      check_type VARCHAR(50) NOT NULL,
      total_items INTEGER,
      inconsistent_items INTEGER,
      repaired_items INTEGER,
      passed BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS error_logs (
      id SERIAL PRIMARY KEY,
      error_type VARCHAR(100) NOT NULL,
      error_message TEXT,
      stack_trace TEXT,
      context JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('✅ All tables created successfully');
  await client.end();
  process.exit(0);
}).catch(err => {
  console.error('Error initializing db9:', err);
  process.exit(1);
});
"

# 初始化OpenViking
echo "🧗 初始化 OpenViking 上下文索引..."
node -e "
const OpenViking = require('@kevinzhow/openclaw-memory-openviking');
const viking = new OpenViking({
  indexDir: process.env.OPENVIKING_INDEX_DIR || '~/.local/openclaw/openviking',
});
viking.init().then(() => {
  console.log('✅ OpenViking initialized');
  process.exit(0);
});
"

# 初始化QMD
echo "🔍 初始化 QMD 文档索引..."
node -e "
const QMD = require('@tobilu/qmd');
const qmd = new QMD({
  indexPath: process.env.QMD_INDEX_PATH || '~/.local/openclaw/qmd/index.db',
  embedding: process.env.QMD_EMBEDDING_ENABLED !== 'false',
});
qmd.init().then(() => {
  console.log('✅ QMD initialized');
  process.exit(0);
});
"

# 初始化mem9
echo "🧠 初始化 mem9 记忆引擎..."
node -e "
const Mem9 = require('@mem9/mem9');
const mem9 = new Mem9({
  dataDir: process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9',
  embeddingModel: process.env.MEM9_EMBEDDING_MODEL || 'text-embedding-3-small',
});
mem9.init().then(() => {
  console.log('✅ mem9 initialized');
  process.exit(0);
});
"

echo ""
echo "🎉 所有数据库初始化完成！"
echo ""
echo "下一步: 运行 bash skills/mem9-db9-upgrade/scripts/start-memory-stack.sh 启动服务"
