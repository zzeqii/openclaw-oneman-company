#!/usr/bin/env node
/**
 * viking-memory: 初始化 mem9 数据目录
 * mem9 由 OpenClaw 插件管理，我们只需要创建数据目录
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

const dataDir = process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9';
const expandedDataDir = dataDir.replace(/^~/, os.homedir());

// 确保目录存在
if (!fs.existsSync(expandedDataDir)) {
  console.log('Creating mem9 data directory:', expandedDataDir);
  fs.mkdirSync(expandedDataDir, { recursive: true, mode: 0o755 });
}

console.log('✅ mem9 data directory initialized:', expandedDataDir);
console.log('   mem9 engine will be managed by OpenClaw plugin');
process.exit(0);
