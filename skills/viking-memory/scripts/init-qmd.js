#!/usr/bin/env node
/**
 * viking-memory: 初始化 QMD
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { createStore } from '@tobilu/qmd';

const indexPath = process.env.QMD_INDEX_PATH || '~/.local/openclaw/qmd/index.db';
const embeddingEnabled = process.env.QMD_EMBEDDING_ENABLED !== 'false';
const expandedIndexPath = indexPath.replace(/^~/, os.homedir());

async function init() {
  console.log('Initializing QMD...');
  // 确保目录存在
  const dir = path.dirname(expandedIndexPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
  }
  
  // 创建QMD store
  const store = await createStore({
    dbPath: expandedIndexPath,
    config: {
      collections: {
        docs: { 
          path: '/Users/bytedance/.openclaw/workspace', 
          pattern: '**/*.md' 
        }
      }
    },
  });
  
  console.log('✅ QMD initialized');
  await store.close();
}

init().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Error initializing QMD:', err);
  process.exit(1);
});
