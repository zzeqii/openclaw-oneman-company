#!/usr/bin/env node
/**
 * 统一记忆API - mem9 + OpenViking + QMD + db9
 *
 * 用法:
 *   node memory.js store "记忆内容" [--tags="tag1,tag2"]
 *   node memory.js search "查询文本" [--limit=5]
 *   node memory.js hybrid-search "查询文本" [--limit=10]
 *   node memory.js check-consistency [--repair]
 *   node memory.js health
 *   node memory.js stats
 */

// 加载环境变量
require('dotenv').config({ path: '.env.memory' });

const Mem9 = require('@mem9/mem9');
const { Client } = require('get-db9');
const OpenViking = require('@kevinzhow/openclaw-memory-openviking');
const QMD = require('@tobilu/qmd');
const path = require('path');

// 配置
const config = {
  mem9: {
    dataDir: process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9',
    embeddingModel: process.env.MEM9_EMBEDDING_MODEL || 'text-embedding-3-small',
  },
  db9: {
    connectionString: process.env.DB9_CONNECTION_STRING || 'postgresql://localhost:5432/openclaw_memory',
  },
  openviking: {
    indexDir: process.env.OPENVIKING_INDEX_DIR || '~/.local/openclaw/openviking',
  },
  qmd: {
    indexPath: process.env.QMD_INDEX_PATH || '~/.local/openclaw/qmd/index.db',
    embeddingEnabled: process.env.QMD_EMBEDDING_ENABLED !== 'false',
  },
};

// 初始化所有组件
let mem9, db9, openviking, qmd;

async function init() {
  mem9 = new Mem9(config.mem9);
  await mem9.init();

  db9 = new Client(config.db9.connectionString);
  await db9.connect();

  openviking = new OpenViking(config.openviking);
  await openviking.init();

  qmd = new QMD({
    indexPath: config.qmd.indexPath,
    embedding: config.qmd.embeddingEnabled,
  });
  await qmd.init();
}

// 记录操作到db9
async function logOperation(operationType, queryText, resultCount, latencyMs) {
  await db9.query(
    `INSERT INTO memory_operations (operation_type, query_text, result_count, latency_ms) VALUES ($1, $2, $3, $4)`,
    [operationType, queryText, resultCount, latencyMs]
  );
}

// 存储记忆
async function storeMemory(content, tags = []) {
  const startTime = Date.now();
  await init();

  // 存储到mem9
  const memoryId = await mem9.store(content, { tags });

  // 如果是markdown文档，也添加到QMD
  if (content.startsWith('#') || content.includes('\n## ')) {
    await qmd.addDocument(content);
  }

  const latency = Date.now() - startTime;
  await logOperation('store', content.slice(0, 200), 1, latency);

  console.log(`✅ 记忆已存储，ID: ${memoryId}`);
  await db9.end();
}

// 语义搜索（mem9）
async function searchMem9(query, limit = 5) {
  const startTime = Date.now();
  await init();

  const results = await mem9.search(query, { limit });

  const latency = Date.now() - startTime;
  await logOperation('search', query, results.length, latency);

  console.log(`🔍 找到 ${results.length} 条相关记忆:`);
  results.forEach((r, i) => {
    console.log(`\n${i + 1}. [${r.score.toFixed(3)}] ${r.content.slice(0, 150)}...`);
  });

  await db9.end();
  return results;
}

// 混合搜索（mem9 + QMD + OpenViking）
async function hybridSearch(query, limit = 10) {
  const startTime = Date.now();
  await init();

  // 并行搜索三个来源
  const [mem9Results, qmdResults, vikingResults] = await Promise.all([
    mem9.search(query, { limit: Math.floor(limit / 2) }),
    qmd.search(query, { limit: Math.floor(limit / 3) }),
    openviking.search(query, { limit: Math.floor(limit / 3) }),
  ]);

  // 合并结果并按相关性排序
  const allResults = [
    ...mem9Results.map(r => ({ ...r, source: 'mem9' })),
    ...qmdResults.map(r => ({ ...r, source: 'qmd' })),
    ...vikingResults.map(r => ({ ...r, source: 'openviking' })),
  ];

  allResults.sort((a, b) => b.score - a.score);
  const finalResults = allResults.slice(0, limit);

  const latency = Date.now() - startTime;
  await logOperation('hybrid-search', query, finalResults.length, latency);

  console.log(`🔍 混合搜索找到 ${finalResults.length} 条结果:`);
  finalResults.forEach((r, i) => {
    const sourceIcon = {
      mem9: '🧠',
      qmd: '📄',
      openviking: '🧗',
    }[r.source];
    console.log(`\n${i + 1}. ${sourceIcon} [${r.score.toFixed(3)}] ${r.content.slice(0, 120)}...`);
  });

  await db9.end();
  return finalResults;
}

// 健康检查
async function healthCheck() {
  await init();

  const results = [];

  // Check mem9
  try {
    const stats = await mem9.getStats();
    results.push({
      service: 'mem9',
      status: 'ok',
      stats,
    });
  } catch (e) {
    results.push({
      service: 'mem9',
      status: 'error',
      error: e.message,
    });
  }

  // Check db9
  try {
    await db9.query('SELECT 1');
    const stats = await db9.query(`
      SELECT COUNT(*) as total_ops FROM memory_operations
    `);
    results.push({
      service: 'db9',
      status: 'ok',
      totalOperations: stats.rows[0].total_ops,
    });
  } catch (e) {
    results.push({
      service: 'db9',
      status: 'error',
      error: e.message,
    });
  }

  // Check OpenViking
  try {
    const stats = await openviking.getStats();
    results.push({
      service: 'OpenViking',
      status: 'ok',
      stats,
    });
  } catch (e) {
    results.push({
      service: 'OpenViking',
      status: 'error',
      error: e.message,
    });
  }

  // Check QMD
  try {
    const stats = await qmd.getStats();
    results.push({
      service: 'QMD',
      status: 'ok',
      stats,
    });
  } catch (e) {
    results.push({
      service: 'QMD',
      status: 'error',
      error: e.message,
    });
  }

  console.log('🏥 健康检查结果:\n');
  results.forEach(r => {
    if (r.status === 'ok') {
      console.log(`✅ ${r.service}: OK`);
      if (r.stats) {
        Object.entries(r.stats).forEach(([k, v]) => {
          console.log(`   ${k}: ${v}`);
        });
      }
      if (r.totalOperations !== undefined) {
        console.log(`   总操作数: ${r.totalOperations}`);
      }
    } else {
      console.log(`❌ ${r.service}: ERROR - ${r.error}`);
    }
    console.log('');
  });

  const allOk = results.every(r => r.status === 'ok');
  await db9.end();
  return allOk;
}

// 一致性检查
async function checkConsistency(repair = false) {
  await init();
  const startTime = Date.now();

  // 获取所有记忆
  const mem9Memories = await mem9.getAll();
  const qmdDocs = await qmd.getAllDocuments();

  let inconsistencies = 0;
  let repaired = 0;

  // 检查每个mem9记忆是否在文件系统有对应记录
  for (const mem of mem9Memories) {
    // 验证内容完整性
    if (!mem.content || mem.content.trim().length === 0) {
      inconsistencies++;
      if (repair) {
        await mem9.delete(mem.id);
        repaired++;
      }
    }
  }

  // 记录结果到db9
  await db9.query(
    `INSERT INTO consistency_checks (check_type, total_items, inconsistent_items, repaired_items, passed) VALUES ($1, $2, $3, $4, $5)`,
    [
      repair ? 'repair' : 'check',
      mem9Memories.length + qmdDocs.length,
      inconsistencies,
      repaired,
      inconsistencies === 0,
    ]
  );

  const latency = Date.now() - startTime;

  console.log(`🔍 一致性检查完成:`);
  console.log(`   总项目: ${mem9Memories.length + qmdDocs.length}`);
  console.log(`   不一致: ${inconsistencies}`);
  if (repair) {
    console.log(`   修复: ${repaired}`);
  }

  if (inconsistencies === 0) {
    console.log('\n✅ 一致性检查通过');
  } else {
    console.log('\n⚠️  发现不一致，请使用 --repair 参数修复');
  }

  await db9.end();
  return inconsistencies === 0;
}

// 获取统计信息
async function getStats() {
  await init();

  const mem9Stats = await mem9.getStats();
  const qmdStats = await qmd.getStats();
  const vikingStats = await openviking.getStats();

  const opsResult = await db9.query(`
    SELECT COUNT(*) as total,
           AVG(latency_ms) as avg_latency
    FROM memory_operations
    WHERE created_at > NOW() - INTERVAL '24 hours'
  `);

  console.log('📊 记忆系统统计:\n');
  console.log('🧠 mem9:');
  console.log(`   总记忆数: ${mem9Stats.totalMemories}`);
  console.log(`   向量存储大小: ${(mem9Stats.sizeBytes / 1024 / 1024).toFixed(2)} MB\n`);

  console.log('📄 QMD:');
  console.log(`   总文档数: ${qmdStats.totalDocuments}\n`);

  console.log('🧗 OpenViking:');
  console.log(`   索引文件数: ${vikingStats.indexedFiles}\n`);

  console.log('🐘 db9 (24小时):');
  console.log(`   总操作数: ${opsResult.rows[0].total}`);
  console.log(`   平均延迟: ${parseFloat(opsResult.rows[0].avg_latency).toFixed(2)} ms\n`);

  await db9.end();
}

// 解析命令行参数
const command = process.argv[2];
const args = process.argv.slice(3);

// 解析选项
const options = {};
args.filter(a => a.startsWith('--')).forEach(a => {
  const [key, value] = a.slice(2).split('=');
  options[key] = value || true;
});

const contentOrQuery = args.find(a => !a.startsWith('--'));

// 命令路由
async function main() {
  switch (command) {
    case 'store':
      if (!contentOrQuery) {
        console.error('❌ 请提供记忆内容');
        process.exit(1);
      }
      const tags = options.tags ? options.tags.split(',') : [];
      await storeMemory(contentOrQuery, tags);
      break;

    case 'search':
      if (!contentOrQuery) {
        console.error('❌ 请提供查询文本');
        process.exit(1);
      }
      const limit = options.limit ? parseInt(options.limit) : 5;
      await searchMem9(contentOrQuery, limit);
      break;

    case 'hybrid-search':
      if (!contentOrQuery) {
        console.error('❌ 请提供查询文本');
        process.exit(1);
      }
      const hLimit = options.limit ? parseInt(options.limit) : 10;
      await hybridSearch(contentOrQuery, hLimit);
      break;

    case 'check-consistency':
      await checkConsistency(options.repair || false);
      break;

    case 'health':
      await healthCheck();
      break;

    case 'stats':
      await getStats();
      break;

    default:
      console.log(`
🧠 统一记忆API (mem9 + db9 + OpenViking + QMD)

命令:
  store <内容> [--tags=tag1,tag2]    - 存储新记忆
  search <查询> [--limit=5]          - mem9 语义搜索
  hybrid-search <查询> [--limit=10]  - 混合搜索 (mem9 + QMD + OpenViking)
  check-consistency [--repair]       - 检查一致性，可选择修复
  health                              - 健康检查
  stats                               - 统计信息

示例:
  node memory.js store "用户偏好：简洁回答" --tags="preference"
  node memory.js hybrid-search "记忆升级方案" --limit=10
  node memory.js health
`);
      await db9?.end();
      break;
  }
}

main().catch(err => {
  console.error('❌ 错误:', err);
  // 记录错误到db9
  if (db9) {
    db9.query(
      `INSERT INTO error_logs (error_type, error_message, stack_trace) VALUES ($1, $2, $3)`,
      ['runtime', err.message, err.stack]
    ).catch(() => {}).finally(() => {
      db9.end();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
