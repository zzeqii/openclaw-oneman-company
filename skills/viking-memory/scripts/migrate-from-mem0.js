#!/usr/bin/env node
/**
 * 从旧mem0迁移到mem9
 */

console.log('🔄 从mem0迁移到mem9...\n');

const fs = require('fs');
const path = require('path');

// 检查mem0是否存在
const mem0Path = '/Users/bytedance/.openclaw/workspace/skills/mem0';
if (!fs.existsSync(mem0Path)) {
  console.log('⚠️  mem0 技能目录不存在，跳过迁移');
  process.exit(0);
}

// 加载环境变量
require('dotenv').config({ path: '.env.memory' });

const Mem9 = require('@mem9/mem9');
const Mem0 = require('/Users/bytedance/.openclaw/workspace/skills/mem0/scripts/mem0-config');

const config = {
  mem9: {
    dataDir: process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9',
  },
};

async function migrate() {
  // 初始化
  const mem9 = new Mem9(config.mem9);
  await mem9.init();

  // 获取所有mem0记忆
  console.log('📖 读取mem0记忆...');
  const mem0Memories = await Mem0.listMemories();
  console.log(`找到 ${mem0Memories.length} 条记忆\n`);

  if (mem0Memories.length === 0) {
    console.log('✅ 迁移完成（没有需要迁移的记忆）');
    return;
  }

  let migrated = 0;
  let failed = 0;

  // 逐个迁移
  for (const memory of mem0Memories) {
    try {
      await mem9.store(memory.content, {
        tags: memory.tags || [],
        originalId: memory.id,
        migratedAt: new Date().toISOString(),
      });
      migrated++;
      process.stdout.write(`\r⏳ 已迁移: ${migrated}/${mem0Memories.length}`);
    } catch (e) {
      failed++;
      console.error(`\n❌ 迁移失败 ID ${memory.id}: ${e.message}`);
    }
  }

  console.log(`\n\n🎉 迁移完成:`);
  console.log(`   成功: ${migrated}`);
  console.log(`   失败: ${failed}`);

  // 迁移完成后，更新.gitignore确保本地存储不被提交
  const gitignorePath = '/Users/bytedance/.openclaw/workspace/.gitignore';
  let gitignore = '';
  if (fs.existsSync(gitignorePath)) {
    gitignore = fs.readFileSync(gitignorePath, 'utf8');
  }

  const memoryIgnore = `
# Local memory storage (keep sensitive data and indexes local)
# See mem9-db9-upgrade architecture - local-first design
~/.local/openclaw/
*.db
*.sqlite
*.sqlite3
*.vec
data/
memory/index/
# Keep only markdown logs in Git, not binary indexes
!memory/*.md
!*.md
`;

  if (!gitignore.includes('~/.local/openclaw/')) {
    console.log('\n📝 更新 .gitignore 以避免本地存储被提交到Git...');
    fs.appendFileSync(gitignorePath, memoryIgnore);
    console.log('✅ .gitignore 更新完成');
  }

  console.log('\n🚀 迁移完成！现在可以使用新的记忆系统了。');
}

migrate().catch(err => {
  console.error('❌ 迁移出错:', err);
  process.exit(1);
});
