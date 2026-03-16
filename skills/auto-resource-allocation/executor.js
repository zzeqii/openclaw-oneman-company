/**
 * 任务执行器 - 保障任务真正落地执行
 * 负责：
 * 1. 实际执行任务生成内容
 * 2. 保障每个任务按质量要求完成
 * 3. 完成后自动更新进度、触发汇报
 * 4. 异常自动重试
 */

const fs = require('fs');
const path = require('path');

class TaskExecutor {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.executing = false;
    this.currentTasks = new Map();
    this.logFile = path.join(__dirname, 'executor.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    console.log(logMsg);
  }

  // 执行《金枝囚》章节写作任务 - 由Agent实际生成内容
  async executeJinzhiqiChapter(task) {
    const basePath = '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/金枝囚/草稿/chapters/';
    const existingFiles = fs.readdirSync(basePath);
    const completedChapters = existingFiles.filter(f => f.startsWith('第') && f.endsWith('.md')).length;
    
    // 本批次目标：从第 (completedChapters + 1) 章开始写
    const startChapter = completedChapters + 1;
    const endChapter = 5 + 5; // 前5章已完成，本批次再写5章到第10章
    
    if (completedChapters >= endChapter) {
      this.log(`[金枝囚] 本批次${task.target}章全部完成，触发自动汇报`);
      task.completed = task.target;
      this.scheduler.completeTask(task);
      return true;
    }
    
    const chapterTitles = {
      6: '家人的索取',
      7: '特殊的差事', 
      8: '意外的解围',
      9: '桂花糕的心意',
      10: '绿珠的陷害',
      11: '深夜的访客',
      12: '绣活的销路',
      13: '小丫鬟的病',
      14: '母亲再次要钱',
      15: '开水泼脸',
    };
    
    const chapterNum = completedChapters + 1;
    const title = chapterTitles[chapterNum];
    
    if (!title) {
      this.log(`[金枝囚] 本批次到${endChapter}章已全部完成，等待下一批次`);
      task.completed = task.target;
      this.scheduler.completeTask(task);
      return false;
    }
    
    this.log(`[金枝囚] 开始写作第${chapterNum}章: ${title}`);
    
    // 实际生成内容 - 由当前Agent执行
    const fileName = `第${chapterNum}章_${title}.md`;
    const filePath = path.join(basePath, fileName);
    
    // 这里会触发Agent实际写作，内容生成后检查
    // 通知主Agent需要生成这一章
    globalThis.needsGeneration = {
      type: 'jinjiang-chapter',
      chapterNum,
      title,
      filePath,
      taskId: task.id
    };
    
    // 生成完成后，更新进度
    // 主Agent生成完成后会继续调度下一章
    this.log(`[金枝囚] 等待第${chapterNum}章生成完成...`);
    
    return new Promise((resolve) => {
      // 每10秒检查一次文件是否生成
      const checkInterval = setInterval(() => {
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 2000) {
          clearInterval(checkInterval);
          this.log(`[金枝囚] 第${chapterNum}章 ${title} 已完成，文件大小: ${fs.statSync(filePath).size} bytes`);
          task.completed++;
          
          if (task.completed >= task.target) {
            this.log(`[金枝囚] 本批次${task.target}章全部完成，触发自动汇报`);
            this.scheduler.completeTask(task);
          }
          resolve(true);
        }
      }, 10000);
    });
  }

  // 执行APP工具矩阵开发任务 - 第一个工具：AI思维导图
  async executeAppMatrixDev(task) {
    const basePath = '/Users/bytedance/Documents/trae_projects/app_matrix/';
    this.log(`[APP工具矩阵] 开始开发第一个工具：AI思维导图`);
    
    // 检查项目结构
    if (!fs.existsSync(basePath)) {
      this.log(`[APP工具矩阵] 项目目录不存在，等待手动创建`);
      return false;
    }
    
    // 检查已完成文件
    const targetFiles = [
      'backend/services/mindmap_service.go',
      'backend/models/mindmap.go', 
      'backend/api/mindmap_handler.go',
      'backend/routes/routes.go',
      'backend/main.go',
      'backend/config/config.go',
    ];
    
    let pendingFiles = [];
    targetFiles.forEach(file => {
      const fullPath = path.join(basePath, file);
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
        pendingFiles.push(file);
      }
    });
    
    if (pendingFiles.length === 0) {
      this.log(`[APP工具矩阵] AI思维导图后端开发完成，等待前端开发`);
      task.completed = task.target;
      this.scheduler.completeTask(task);
      return true;
    }
    
    // 标记需要生成的下一个文件
    const nextFile = pendingFiles[0];
    this.log(`[APP工具矩阵] 需要生成文件: ${nextFile}`);
    
    // 通知主Agent实际生成
    globalThis.needsGeneration = {
      type: 'app-matrix-dev',
      tool: 'AI思维导图',
      filePath: path.join(basePath, nextFile),
      taskId: task.id
    };
    
    return new Promise((resolve) => {
      // 每15秒检查一次文件是否生成
      const checkInterval = setInterval(() => {
        if (fs.existsSync(path.join(basePath, nextFile)) && fs.statSync(path.join(basePath, nextFile)).size > 500) {
          clearInterval(checkInterval);
          this.log(`[APP工具矩阵] 文件 ${nextFile} 已生成`);
          // 继续下一个文件
          resolve(true);
        }
      }, 15000);
    });
  }

  // 执行Coze自动策略Agent开发任务
  async executeCozeStrategyDev(task) {
    const basePath = '/Users/bytedance/Documents/trae_projects/strategy_master/';
    this.log(`[Coze策略Agent] 开始开发数据接入+预处理模块`);
    
    // 检查项目结构
    if (!fs.existsSync(basePath)) {
      this.log(`[Coze策略Agent] 项目目录不存在，等待手动创建`);
      return false;
    }
    
    // 检查数据接入模块文件
    const targetFiles = [
      'src/data/fetcher.js',
      'src/data/preprocessor.js',
      'src/data/validator.js',
      'src/types/index.d.ts',
    ];
    
    let pendingFiles = [];
    targetFiles.forEach(file => {
      const fullPath = path.join(basePath, file);
      if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
        pendingFiles.push(file);
      }
    });
    
    if (pendingFiles.length === 0) {
      this.log(`[Coze策略Agent] 数据接入+预处理模块开发完成`);
      task.completed = task.target;
      this.scheduler.completeTask(task);
      return true;
    }
    
    const nextFile = pendingFiles[0];
    this.log(`[Coze策略Agent] 需要生成文件: ${nextFile}`);
    
    // 通知主Agent实际生成
    globalThis.needsGeneration = {
      type: 'coze-strategy-dev',
      module: '数据接入+预处理',
      filePath: path.join(basePath, nextFile),
      taskId: task.id
    };
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (fs.existsSync(path.join(basePath, nextFile)) && fs.statSync(path.join(basePath, nextFile)).size > 300) {
          clearInterval(checkInterval);
          this.log(`[Coze策略Agent] 文件 ${nextFile} 已生成`);
          resolve(true);
        }
      }, 15000);
    });
  }

  // 根据任务ID选择执行器
  async executeTask(task) {
    this.executing = true;
    this.currentTasks.set(task.id, task);
    this.log(`[执行器] 开始执行任务: ${task.name}`);
    
    try {
      switch (task.id) {
        case 'jinjiang-jinzhiqi-chapters':
          await this.executeJinzhiqiChapter(task);
          break;
        case 'app-matrix-dev':
          await this.executeAppMatrixDev(task);
          break;
        case 'coze-strategy-dev':
          await this.executeCozeStrategyDev(task);
          break;
        default:
          this.log(`[执行器] 未知任务类型: ${task.id}`);
          break;
      }
    } catch (e) {
      this.log(`[执行器] 执行任务出错: ${task.name}, 错误: ${e.message}`);
      task.status = 'pending'; // 放回队列重试
      const index = this.scheduler.runningTasks.findIndex(t => t.id === task.id);
      if (index > -1) {
        this.scheduler.runningTasks.splice(index, 1);
      }
    }
    
    this.currentTasks.delete(task.id);
    this.executing = false;
  }

  // 启动执行循环 - 不断检查有任务就执行，一个接一个
  start(interval = 10000) {
    this.log('=== 任务执行器启动 ===');
    
    setInterval(() => {
      if (!this.executing && this.scheduler.runningTasks.length > 0) {
        // 按优先级找第一个有未完成文件的任务
        for (const task of this.scheduler.runningTasks) {
          if (!this.currentTasks.has(task.id)) {
            this.executeTask(task);
            break;
          }
        }
      }
    }, interval);
  }
}

module.exports = TaskExecutor;
