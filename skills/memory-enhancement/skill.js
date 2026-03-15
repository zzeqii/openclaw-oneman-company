/**
 * OpenClaw记忆增强技能
 * 集成MemOS和OpenViking记忆优化机制
 */

const { getMemoryEnhancement } = require('./index');

const memoryEnhancement = getMemoryEnhancement();

module.exports = {
  name: 'memory-enhancement',
  description: '记忆系统增强插件，提升长任务记忆和上下文关联能力',
  version: '1.0.0',
  author: 'OpenClaw Team',
  
  /**
   * 技能初始化
   */
  async init() {
    console.log('[记忆增强插件] 初始化完成');
    console.log('[记忆增强插件] 统计信息:', memoryEnhancement.getStats());
    return true;
  },

  /**
   * 存储记忆
   * @param {object} params 参数
   * @param {string} params.type 记忆类型：task|context|decision|lesson
   * @param {string} params.content 记忆内容
   * @param {string} [params.taskId] 关联任务ID
   * @param {string[]} [params.tags] 标签
   * @returns {object} 结果
   */
  async store(params) {
    const { type, content, taskId, tags } = params;
    
    if (!type || !content) {
      return {
        success: false,
        error: '缺少必要参数：type和content为必填项'
      };
    }

    const memoryId = memoryEnhancement.storeMemory({
      type,
      content,
      taskId,
      tags
    });

    return {
      success: true,
      data: {
        memoryId,
        message: '记忆存储成功'
      }
    };
  },

  /**
   * 检索相关记忆
   * @param {object} params 参数
   * @param {string} params.query 查询内容
   * @param {string} [params.taskId] 关联任务ID
   * @param {number} [params.limit=10] 返回数量限制
   * @param {number} [params.threshold=0.5] 相似度阈值
   * @returns {object} 结果
   */
  async retrieve(params) {
    const { query, taskId, limit = 10, threshold = 0.5 } = params;
    
    if (!query) {
      return {
        success: false,
        error: '缺少必要参数：query为必填项'
      };
    }

    const results = memoryEnhancement.retrieveRelevant(query, {
      taskId,
      limit,
      threshold
    });

    return {
      success: true,
      data: {
        count: results.length,
        results: results.map(r => ({
          id: r.id,
          type: r.type,
          content: r.content,
          taskId: r.taskId,
          tags: r.tags,
          timestamp: new Date(r.timestamp).toLocaleString(),
          similarity: r.similarity,
          accessCount: r.accessCount
        }))
      }
    };
  },

  /**
   * 获取任务上下文
   * @param {object} params 参数
   * @param {string} params.taskId 任务ID
   * @param {number} [params.maxTokens=2000] 最大token数
   * @returns {object} 结果
   */
  async getTaskContext(params) {
    const { taskId, maxTokens = 2000 } = params;
    
    if (!taskId) {
      return {
        success: false,
        error: '缺少必要参数：taskId为必填项'
      };
    }

    const context = memoryEnhancement.getTaskContext(taskId, maxTokens);

    return {
      success: true,
      data: {
        taskId,
        context,
        estimatedTokens: context.length * 1.5
      }
    };
  },

  /**
   * 上下文关联分析
   * @param {object} params 参数
   * @param {string} params.context 当前上下文
   * @returns {object} 结果
   */
  async analyzeAssociation(params) {
    const { context } = params;
    
    if (!context) {
      return {
        success: false,
        error: '缺少必要参数：context为必填项'
      };
    }

    const analysis = memoryEnhancement.analyzeContextAssociation(context);

    return {
      success: true,
      data: analysis
    };
  },

  /**
   * 长时记忆合并
   * @returns {object} 结果
   */
  async consolidate() {
    memoryEnhancement.consolidateLongTermMemory();
    return {
      success: true,
      data: {
        message: '长时记忆合并完成'
      }
    };
  },

  /**
   * 获取记忆系统统计信息
   * @returns {object} 结果
   */
  async stats() {
    const stats = memoryEnhancement.getStats();
    return {
      success: true,
      data: stats
    };
  },

  /**
   * 技能执行入口
   * @param {object} args 参数
   * @returns {object} 结果
   */
  async execute(args) {
    const { action, ...params } = args;
    
    switch (action) {
      case 'store':
        return this.store(params);
      case 'retrieve':
        return this.retrieve(params);
      case 'getTaskContext':
        return this.getTaskContext(params);
      case 'analyzeAssociation':
        return this.analyzeAssociation(params);
      case 'consolidate':
        return this.consolidate();
      case 'stats':
        return this.stats();
      default:
        return {
          success: false,
          error: `不支持的操作：${action}，支持的操作：store, retrieve, getTaskContext, analyzeAssociation, consolidate, stats`
        };
    }
  }
};
