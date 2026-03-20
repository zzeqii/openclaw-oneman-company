#!/usr/bin/env node
/**
 * viking-memory: 初始化 OpenViking 索引目录
 * OpenViking 是代码上下文索引，我们只需要创建目录结构，后续由OpenClaw管理
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

const indexDir = process.env.OPENVIKING_INDEX_DIR || '~/.local/openclaw/openviking';
const expanded = indexDir.replace(/^~/, os.homedir());

// 确保目录存在
if (!fs.existsSync(expanded)) {
  console.log('Creating OpenViking index directory:', expanded);
  fs.mkdirSync(expanded, { recursive: true, mode: 0o755 });
}

console.log('✅ OpenViking index directory initialized:', expanded);
console.log('   OpenViking service will be managed by OpenClaw plugin');
process.exit(0);
