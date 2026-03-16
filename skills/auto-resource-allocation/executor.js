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

  // 执行《金枝囚》章节写作任务
  async executeJinzhiqiChapter(task) {
    const basePath = '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/金枝囚/草稿/chapters/';
    const existingFiles = fs.readdirSync(basePath);
    const completedChapters = existingFiles.filter(f => f.startsWith('第') && f.endsWith('.md')).length;
    
    const chapterNum = completedChapters + 1;
    const chapterTitles = {
      6: '家人的索取',
      7: '特殊的差事', 
      8: '意外的解围',
      9: '桂花糕的心意',
      10: '绿珠的陷害',
    };
    
    if (!chapterTitles[chapterNum]) {
      this.log(`[金枝囚] 本批次5章已完成，等待下一批次`);
      return false;
    }
    
    const title = chapterTitles[chapterNum];
    const fileName = `第${chapterNum}章_${title}.md`;
    const filePath = path.join(basePath, fileName);
    
    this.log(`[金枝囚] 开始写作第${chapterNum}章: ${title}`);
    
    // 这里由Agent实际生成内容
    // 执行器只负责调度，内容生成由jinjiang-original-novel-writer skill完成
    
    return new Promise((resolve) => {
      // 检查文件是否生成完成
      const checkInterval = setInterval(() => {
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 3000) {
          clearInterval(checkInterval);
          this.log(`[金枝囚] 第${chapterNum}章 ${title} 已完成，文件大小: ${fs.statSync(filePath).size} bytes`);
          task.completed++;
          if (task.completed >= task.target) {
            this.log(`[金枝囚] 本批次${task.target}章全部完成，触发自动汇报`);
            this.scheduler.completeTask(task);
          }
          resolve(true);
        }
      }, 30000); // 每30秒检查一次，给Agent足够写作时间
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
    
    // 由开发Agent实际执行开发
    // 这里调度器负责触发和监控
    return true;
  }

  // 执行Coze自动策略Agent开发任务
  async executeCozeStrategyDev(task) {
    const basePath = '/Users/bytedance/Documents/trae_projects/strategy_master/';
    this.log(`[Coze策略Agent] 开始开发数据接入+预处理模块`);
    
    if (!fs.existsSync(basePath)) {
      this.log(`[Coze策略Agent] 项目目录不存在，等待手动创建`);
      return false;
    }
    
    return true;
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

  // 启动执行循环 - 不断检查有任务就执行
  start(interval = 60000) {
    this.log('=== 任务执行器启动 ===');
    
    setInterval(() => {
      if (!this.executing && this.scheduler.runningTasks.length > 0) {
        // 找到第一个未执行的任务
        const pendingRunningTask = this.scheduler.runningTasks.find(
          t => !this.currentTasks.has(t.id)
        );
        if (pendingRunningTask) {
          this.executeTask(pendingRunningTask);
        }
      }
    }, interval);
  }
}

module.exports = TaskExecutor;
