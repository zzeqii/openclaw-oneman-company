#!/usr/bin/env node
/**
 * 内存一致性检查
 * 集成到AGENTS.md启动流程的第四步
 */

console.log('🚀 运行 mem9-db9 内存一致性检查...\n');

require('dotenv').config({ path: '.env.memory' });
const config = require('../config/memory-config');
const { Client } = require('get-db9');
const Mem9 = require('@mem9/mem9');

async function check() {
  const startTime = Date.now();
  const mem9 = new Mem9(config.mem9);
  await mem9.init();

  const db9 = new Client(config.db9.connectionString);
  await db9.connect();

  let inconsistencies = 0;
  let totalItems = 0;

  // 1. 检查mem9记忆完整性
  const memories = await mem9.getAll();
  totalItems += memories.length;
  console.log(`📊 mem9 总记忆数: ${memories.length}`);

  for (const memory of memories) {
    if (!memory.content || memory.content.trim().length === 0) {
      inconsistencies++;
      console.log(`   ⚠️  空内容记忆: ${memory.id}`);
    }
  }

  // 2. 检查存储目录存在
  const fs = require('fs');
  const path = require('path');
  const localRoot = config.storage.localDataRoot.replace(/^~/, require('os').homedir());

  if (!fs.existsSync(localRoot)) {
    console.log(`⚠️  本地存储目录不存在: ${localRoot}`);
    inconsistencies++;
  }

  // 3. 验证Git排除配置
  const gitignorePath = '/Users/bytedance/.openclaw/workspace/.gitignore';
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('~/.local/openclaw/')) {
      console.log(`⚠️  .gitignore 不包含本地存储目录，可能导致敏感数据泄漏`);
      inconsistencies++;
    }
  }

  // 记录结果
  await db9.query(
    `INSERT INTO consistency_checks (check_type, total_items, inconsistent_items, repaired_items, passed) VALUES ($1, $2, $3, $4, $5)`,
    ['startup-check', totalItems, inconsistencies, 0, inconsistencies === 0]
  );

  await db9.end();

  const latency = Date.now() - startTime;

  if (inconsistencies === 0) {
    console.log(`\n✅ 一致性检查通过 (${latency}ms)`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  发现 ${inconsistencies} 个不一致项，请运行:`);
    console.log(`   node skills/mem9-db9-upgrade/scripts/memory.js check-consistency --repair`);
    if (config.consistency.autoRepair) {
      console.log(`\n🔧 自动修复启用，正在尝试修复...`);
      // 这里可以添加自动修复逻辑
      process.exit(1);
    } else {
      process.exit(1);
    }
  }
}

check().catch(err => {
  console.error('❌ 一致性检查出错:', err);
  process.exit(1);
});
