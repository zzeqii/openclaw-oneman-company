/**
 * OpenClaw记忆系统增强插件
 * 集成MemOS和OpenViking记忆优化机制
 * 不覆盖原有记忆功能，插件化接入
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class MemoryEnhancement {
  constructor() {
    this.workspace = process.env.OPENCLAW_WORKSPACE || '/Users/bytedance/.openclaw/workspace';
    this.memoryDir = path.join(this.workspace, 'memory');
    this.longTermMemoryFile = path.join(this.workspace, 'MEMORY.md');
    this.contextCache = new Map(); // 上下文缓存
    this.taskAssociation = new Map(); // 任务关联映射
    this.vectorStore = new Map(); // 简易向量存储（后续可替换为实际向量数据库）
    
    // 初始化目录
    this._initDirectories();
  }

  /**
   * 初始化必要目录
   */
  _initDirectories() {
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
    const enhancementDir = path.join(this.memoryDir, 'enhancement');
    if (!fs.existsSync(enhancementDir)) {
      fs.mkdirSync(enhancementDir, { recursive: true });
    }
  }

  /**
   * 生成内容哈希
   * @param {string} content 内容
   * @returns {string} 哈希值
   */
  _generateHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * 简单文本向量化（实际使用时可替换为embedding接口）
   * @param {string} text 文本
   * @returns {number[]} 向量
   */
  _vectorize(text) {
    const hash = this._generateHash(text);
    const vector = [];
    for (let i = 0; i < 32; i += 2) {
      vector.push(parseInt(hash.substr(i, 2), 16) / 255);
    }
    return vector;
  }

  /**
   * 计算余弦相似度
   * @param {number[]} vec1 向量1
   * @param {number[]} vec2 向量2
   * @returns {number} 相似度
   */
  _cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (mag1 * mag2);
  }

  /**
   * 存储记忆片段
   * @param {object} memory 记忆对象
   * @param {string} memory.type 类型：task|context|decision|lesson
   * @param {string} memory.content 内容
   * @param {string} [memory.taskId] 关联任务ID
   * @param {string[]} [memory.tags] 标签
   * @returns {string} 记忆ID
   */
  storeMemory(memory) {
    const memoryId = this._generateHash(Date.now() + memory.content);
    const vector = this._vectorize(memory.content);
    
    const memoryObj = {
      id: memoryId,
      type: memory.type,
      content: memory.content,
      taskId: memory.taskId || null,
      tags: memory.tags || [],
      timestamp: Date.now(),
      vector,
      accessCount: 0,
      lastAccess: null
    };

    // 存储到向量库
    this.vectorStore.set(memoryId, memoryObj);

    // 关联到任务
    if (memory.taskId) {
      if (!this.taskAssociation.has(memory.taskId)) {
        this.taskAssociation.set(memory.taskId, []);
      }
      this.taskAssociation.get(memory.taskId).push(memoryId);
    }

    // 持久化存储
    const memoryFile = path.join(this.memoryDir, 'enhancement', `${memoryId}.json`);
    fs.writeFileSync(memoryFile, JSON.stringify(memoryObj, null, 2), 'utf8');

    return memoryId;
  }

  /**
   * 检索相关记忆
   * @param {string} query 查询内容
   * @param {object} options 选项
   * @param {string} [options.taskId] 关联任务ID
   * @param {number} [options.limit=10] 返回数量限制
   * @param {number} [options.threshold=0.5] 相似度阈值
   * @returns {object[]} 相关记忆列表
   */
  retrieveRelevant(query, options = {}) {
    const { taskId = null, limit = 10, threshold = 0.5 } = options;
    const queryVector = this._vectorize(query);
    const results = [];

    // 优先检索同一任务的记忆
    if (taskId && this.taskAssociation.has(taskId)) {
      const taskMemoryIds = this.taskAssociation.get(taskId);
      for (const memoryId of taskMemoryIds) {
        const memory = this.vectorStore.get(memoryId);
        if (memory) {
          const similarity = this._cosineSimilarity(queryVector, memory.vector);
          if (similarity >= threshold) {
            results.push({ ...memory, similarity });
          }
        }
      }
    }

    // 检索全局记忆
    for (const [memoryId, memory] of this.vectorStore.entries()) {
      if (taskId && memory.taskId === taskId) continue; // 已检索过任务内记忆
      
      const similarity = this._cosineSimilarity(queryVector, memory.vector);
      if (similarity >= threshold) {
        results.push({ ...memory, similarity });
      }
    }

    // 按相似度排序，限制返回数量
    results.sort((a, b) => b.similarity - a.similarity);
    
    // 更新访问计数
    results.slice(0, limit).forEach(memory => {
      memory.accessCount++;
      memory.lastAccess = Date.now();
      this.vectorStore.set(memory.id, memory);
    });

    return results.slice(0, limit);
  }

  /**
   * 获取任务上下文
   * @param {string} taskId 任务ID
   * @param {number} [maxTokens=2000] 最大token数（简易估算：1汉字≈2token，1英文≈1token）
   * @returns {string} 上下文内容
   */
  getTaskContext(taskId, maxTokens = 2000) {
    if (!this.taskAssociation.has(taskId)) {
      return '';
    }

    const memoryIds = this.taskAssociation.get(taskId);
    const memories = memoryIds
      .map(id => this.vectorStore.get(id))
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp); // 按时间倒序

    let context = '';
    let tokenCount = 0;

    for (const memory of memories) {
      const memoryText = `[${new Date(memory.timestamp).toLocaleString()}] [${memory.type}] ${memory.content}\n\n`;
      const estimatedTokens = memoryText.length * 1.5; // 简易估算
      
      if (tokenCount + estimatedTokens > maxTokens) {
        break;
      }

      context += memoryText;
      tokenCount += estimatedTokens;
    }

    return context;
  }

  /**
   * 长时记忆合并（MemOS机制）
   * 定期将高频访问的短时记忆合并到长时记忆
   */
  consolidateLongTermMemory() {
    // 获取高频访问的记忆
    const highFrequencyMemories = Array.from(this.vectorStore.values())
      .filter(memory => memory.accessCount >= 3 && memory.timestamp < Date.now() - 86400000) // 访问≥3次且超过24小时
      .sort((a, b) => b.accessCount - a.accessCount);

    if (highFrequencyMemories.length === 0) {
      return;
    }

    // 读取现有长时记忆
    let longTermContent = '';
    if (fs.existsSync(this.longTermMemoryFile)) {
      longTermContent = fs.readFileSync(this.longTermMemoryFile, 'utf8');
    }

    // 追加新的长时记忆内容
    const newContent = highFrequencyMemories.map(memory => 
      `### ${new Date(memory.timestamp).toLocaleDateString()} 自动合并记忆\n**类型：** ${memory.type}\n**标签：** ${memory.tags.join(', ')}\n**内容：**\n${memory.content}\n\n`
    ).join('');

    // 写入长时记忆文件（追加模式）
    fs.appendFileSync(this.longTermMemoryFile, newContent, 'utf8');

    // 清理已合并的短时记忆
    highFrequencyMemories.forEach(memory => {
      this.vectorStore.delete(memory.id);
      const memoryFile = path.join(this.memoryDir, 'enhancement', `${memory.id}.json`);
      if (fs.existsSync(memoryFile)) {
        fs.unlinkSync(memoryFile);
      }
    });
  }

  /**
   * 上下文关联分析（OpenViking机制）
   * 分析当前上下文与历史记忆的关联
   * @param {string} currentContext 当前上下文
   * @returns {object} 关联分析结果
   */
  analyzeContextAssociation(currentContext) {
    const relevantMemories = this.retrieveRelevant(currentContext, { limit: 5 });
    
    const associations = relevantMemories.map(memory => ({
      memoryId: memory.id,
      type: memory.type,
      content: memory.content.substring(0, 100) + (memory.content.length > 100 ? '...' : ''),
      similarity: memory.similarity,
      tags: memory.tags
    }));

    // 生成关联摘要
    const summary = associations.length > 0 
      ? `找到 ${associations.length} 条相关历史记忆，最高相似度 ${(associations[0].similarity * 100).toFixed(1)}%`
      : '未找到相关历史记忆';

    return {
      summary,
      associations,
      recommendation: associations.length > 0 
        ? '建议参考相关历史记忆进行决策'
        : '建议记录新的上下文信息到记忆库'
    };
  }

  /**
   * 加载历史记忆
   */
  loadHistoricalMemories() {
    const enhancementDir = path.join(this.memoryDir, 'enhancement');
    if (!fs.existsSync(enhancementDir)) {
      return;
    }

    const files = fs.readdirSync(enhancementDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(enhancementDir, file), 'utf8');
          const memory = JSON.parse(content);
          this.vectorStore.set(memory.id, memory);
          
          if (memory.taskId) {
            if (!this.taskAssociation.has(memory.taskId)) {
              this.taskAssociation.set(memory.taskId, []);
            }
            this.taskAssociation.get(memory.taskId).push(memory.id);
          }
        } catch (e) {
          console.error('加载记忆文件失败:', file, e.message);
        }
      }
    }
  }

  /**
   * 获取记忆系统统计信息
   * @returns {object} 统计信息
   */
  getStats() {
    return {
      totalMemories: this.vectorStore.size,
      totalTasks: this.taskAssociation.size,
      cacheSize: this.contextCache.size,
      oldestMemory: this.vectorStore.size > 0 
        ? new Date(Math.min(...Array.from(this.vectorStore.values()).map(m => m.timestamp))).toLocaleString()
        : null,
      newestMemory: this.vectorStore.size > 0 
        ? new Date(Math.max(...Array.from(this.vectorStore.values()).map(m => m.timestamp))).toLocaleString()
        : null
    };
  }
}

// 单例实例
let instance = null;

function getMemoryEnhancement() {
  if (!instance) {
    instance = new MemoryEnhancement();
    instance.loadHistoricalMemories();
  }
  return instance;
}

module.exports = {
  MemoryEnhancement,
  getMemoryEnhancement
};
