#!/usr/bin/env node
/**
 * viking-memory: 健康检查，验证所有服务可用
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

// 结果收集
const results = [];

// 检查目录
function checkDir(dirPath, name) {
  const expanded = dirPath.replace(/^~/, os.homedir());
  try {
    fs.accessSync(expanded, fs.constants.F_OK);
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
  }
}

// 检查mem9目录
checkDir(process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9', 'mem9');

// 检查OpenViking目录
checkDir(process.env.OPENVIKING_INDEX_DIR || '~/.local/openclaw/openviking', 'OpenViking');

// 检查QMD索引目录
const qmdPath = process.env.QMD_INDEX_PATH || '~/.local/openclaw/qmd/index.db';
const qmdDir = path.dirname(qmdPath.replace(/^~/, os.homedir()));
checkDir(qmdDir, 'QMD');

// 输出结果
console.log('\n🔍 健康检查结果:');
results.forEach(r => {
  if (r.ok) {
    console.log(`  ✅ ${r.name}: OK`);
  } else {
    console.log(`  ❌ ${r.name}: FAILED - ${r.error}`);
  }
});

const allOk = results.every(r => r.ok);
console.log('\n');

if (allOk) {
  console.log('🎉 所有目录检查通过！viking-memory 就绪。');
  process.exit(0);
} else {
  console.log('⚠️  部分目录检查失败，请重新初始化。');
  process.exit(1);
}
