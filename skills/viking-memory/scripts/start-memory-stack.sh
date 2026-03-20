#!/bin/bash
# mem9-db9-memory-upgrade: 启动完整记忆栈

set -e

# 加载环境变量
if [ -f .env.memory ]; then
    export $(cat .env.memory | xargs)
fi

echo "🚀 启动 mem9-db9 记忆栈"
echo "======================"

# 启动db9
if [ "$DB9_AUTO_START" = "true" ]; then
    echo "🐘 启动 db9-server..."
    if ! pgrep -f "db9-server" > /dev/null; then
        db9-server start --port 5432 --db openclaw_memory &
        sleep 2
        echo "✅ db9-server 已启动"
    else
        echo "✓ db9-server 已经在运行"
    fi
fi

# 验证所有服务
echo "🧪 验证服务连接..."

node -e "
const checkAll = async () => {
  const Mem9 = require('@mem9/mem9');
  const { Client } = require('get-db9');
  const OpenViking = require('@kevinzhow/openclaw-memory-openviking');
  const QMD = require('@tobilu/qmd');
  
  const results = [];
  
  // Check mem9
  try {
    const mem9 = new Mem9({
      dataDir: process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9',
    });
    await mem9.init();
    results.push({name: 'mem9', ok: true});
  } catch (e) {
    results.push({name: 'mem9', ok: false, error: e.message});
  }
  
  // Check db9
  try {
    const client = new Client(process.env.DB9_CONNECTION_STRING || 'postgresql://localhost:5432/openclaw_memory');
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    results.push({name: 'db9', ok: true});
  } catch (e) {
    results.push({name: 'db9', ok: false, error: e.message});
  }
  
  // Check OpenViking
  try {
    const viking = new OpenViking({
      indexDir: process.env.OPENVIKING_INDEX_DIR || '~/.local/openclaw/openviking',
    });
    await viking.init();
    results.push({name: 'OpenViking', ok: true});
  } catch (e) {
    results.push({name: 'OpenViking', ok: false, error: e.message});
  }
  
  // Check QMD
  try {
    const qmd = new QMD({
      indexPath: process.env.QMD_INDEX_PATH || '~/.local/openclaw',
      embedding: process.env.QMD_EMBEDDING_ENABLED !== 'false',
    });
    await qmd.init();
    results.push({name: 'QMD', ok: true});
  } catch (e) {
    results.push({name: 'QMD', ok: false, error: e.message});
  }
  
  console.log('\n🔍 健康检查结果:');
  results.forEach(r => {
    if (r.ok) {
      console.log(`  ✅ ${r.name}: OK`);
    } else {
      console.log(`  ❌ ${r.name}: FAILED - ${r.error}`);
    }
  });
  
  const allOk = results.every(r => r.ok);
  if (allOk) {
    console.log('\n🎉 所有服务启动成功！记忆栈已就绪。');
  } else {
    console.log('\n⚠️  部分服务启动失败，请检查配置。');
    process.exit(1);
  }
};

checkAll();
"
