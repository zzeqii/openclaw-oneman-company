/**
 * mem9-db9 记忆系统配置
 * 整合 mem9 + db9 + OpenViking + QMD
 */

require('dotenv').config({ path: '.env.memory' });

module.exports = {
  // mem9 主记忆引擎配置
  mem9: {
    dataDir: process.env.MEM9_DATA_DIR || '~/.local/openclaw/mem9',
    embeddingModel: process.env.MEM9_EMBEDDING_MODEL || 'text-embedding-3-small',
    enabled: true,
    // Hybrid search settings
    hybrid: {
      enableKeyword: true,
      enableVector: true,
      fusionWeight: 0.7, // vector weight vs keyword
    },
  },

  // db9 监控数据库配置
  db9: {
    connectionString: process.env.DB9_CONNECTION_STRING || 'postgresql://localhost:5432/openclaw_memory',
    autoStart: process.env.DB9_AUTO_START !== 'false',
    enabled: true,
    // What to log
    logging: {
      operations: true,
      performance: true,
      errors: true,
      consistencyChecks: true,
    },
    // Retention period (days)
    retention: {
      operations: 30,
      errors: 90,
      metrics: 365,
    },
  },

  // OpenViking 代码上下文索引配置
  openviking: {
    indexDir: process.env.OPENVIKING_INDEX_DIR || '~/.local/openclaw/openviking',
    enabled: process.env.OPENVIKING_ENABLED !== 'false',
    // Which directories to index
    include: [
      '**/*.js',
      '**/*.ts',
      '**/*.md',
      '**/*.json',
    ],
    exclude: [
      'node_modules/**',
      '.git/**',
      '~/.local/**',
      '*.db',
      '*.sqlite',
    ],
    // Rebuild index on startup if changed
    autoRebuild: true,
  },

  // QMD Markdown文档搜索配置
  qmd: {
    indexPath: process.env.QMD_INDEX_PATH || '~/.local/openclaw/qmd/index.db',
    embeddingEnabled: process.env.QMD_EMBEDDING_ENABLED !== 'false',
    enabled: true,
    // Search algorithm
    search: {
      // Enable BM25 keyword search
      bm25: true,
      // Enable vector search
      vector: true,
      // Enable LLM reranking
      reranking: true,
      // Result limit
      defaultLimit: 10,
    },
    // Which markdown files to index
    include: [
      'memory/*.md',
      '**/*.md',
      '!node_modules/**/*.md',
    ],
  },

  // 一致性检查配置
  consistency: {
    // Automatically check on startup
    checkOnStartup: true,
    // Automatically repair minor inconsistencies
    autoRepair: false,
    // Notify if inconsistencies found
    notifyOnFailure: true,
  },

  // 架构设计：本地优先，不依赖Git作为唯一真相
  storage: {
    // All binary indexes go here, excluded from Git
    localDataRoot: '~/.local/openclaw/',
    // Text content still tracked in Git for collaboration
    trackedContent: [
      'memory/*.md',
      'MEMORY.md',
      'AGENTS.md',
      'SOUL.md',
      'USER.md',
    ],
    // Never commit these to Git (security)
    excludedFromGit: [
      '~/.local/openclaw/',
      '*.db',
      '*.sqlite',
      '*.vec',
      '*.env',
      '*.env.*',
    ],
  },

  // 性能配置
  performance: {
    // Cache frequently accessed memories
    cacheEnabled: true,
    cacheSize: 100, // number of items
    // Timeout for searches (ms)
    searchTimeout: 5000,
    // Preload common memories on startup
    preload: true,
  },
};
