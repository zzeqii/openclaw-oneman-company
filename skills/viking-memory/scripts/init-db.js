#!/usr/bin/env node
/**
 * viking-memory: 初始化db9数据库，创建监控表
 */

import { instantDatabase } from 'get-db9';

async function init() {
  console.log('🚀 Creating or getting database...');
  
  // 使用instantDatabase，幂等操作，如果已存在会直接返回
  const db = await instantDatabase({
    name: 'openclaw_memory',
    seed: `
      CREATE TABLE IF NOT EXISTS memory_operations (
        id SERIAL PRIMARY KEY,
        operation_type VARCHAR(50) NOT NULL,
        query_text TEXT,
        result_count INTEGER,
        latency_ms DOUBLE PRECISION,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DOUBLE PRECISION NOT NULL,
        labels JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consistency_checks (
        id SERIAL PRIMARY KEY,
        check_type VARCHAR(50) NOT NULL,
        total_items INTEGER,
        inconsistent_items INTEGER,
        repaired_items INTEGER,
        passed BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS error_logs (
        id SERIAL PRIMARY KEY,
        error_type VARCHAR(100) NOT NULL,
        error_message TEXT,
        stack_trace TEXT,
        context JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  });

  console.log('✅ Database initialized successfully');
  console.log('   Database ID:', db.databaseId);
  console.log('   Connection String:', db.connectionString);
}

init().then(() => {
  console.log('🎉 db9 initialization complete');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error initializing db9:', err);
  process.exit(1);
});
