/**
 * 任务执行器 - auto-resource-allocation
 * 负责实际驱动文件生成，一个接一个自动执行，完成自动继续下一个
 */

const fs = require('fs');
const path = require('path');

class TaskExecutor {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.working = false;
    this.currentTasks = new Map();
    this.logFile = path.join(__dirname, 'executor.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    console.log(logMsg);
  }

  // spawn subagent to generate the file
  spawnSubagent(task, config) {
    // Use OpenClaw sessions_spawn to generate in background subagent
    const { spawn } = require('child_process');
    const scriptPath = path.join(__dirname, 'spawn-subagent.js');
    const jsonConfig = JSON.stringify(config);
    const child = spawn('node', [scriptPath, jsonConfig], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    child.on('exit', (code) => {
      this.log(`子agent退出，code: ${code}`);
    });
  }

  // 根据任务配置执行
  async executeTask(task) {
    this.working = true;
    this.currentTasks.set(task.id, task);
    this.log(`[执行器] 开始执行任务: ${task.name}`);
    
    try {
      // 如果任务有配置好的待生成文件队列，按队列执行
      const pendingFiles = (task.config && task.config.pendingFiles) ? task.config.pendingFiles : task.pendingFiles;
      if (pendingFiles && pendingFiles.length > 0) {
        const nextFile = pendingFiles.shift();
        this.log(`[${task.name}] 需要生成文件: ${nextFile.path}`);
        
        // Spawn subagent to generate directly, no need to wait for main
        this.spawnSubagent(task, {
          type: 'files-generation',
          taskId: task.id,
          taskName: task.name,
          filePath: nextFile.path,
          description: nextFile.description,
          minSize: nextFile.minSize || 300,
        });
        
        return new Promise((resolve) => {
          // 检查文件是否生成完成
          const checkInterval = setInterval(() => {
            if (fs.existsSync(nextFile.path) && fs.statSync(nextFile.path).size > (nextFile.minSize || 300)) {
              clearInterval(checkInterval);
              this.log(`[${task.name}] 文件 ${nextFile.path} 已生成，大小: ${fs.statSync(nextFile.path).size} bytes`);
              task.completed++;
              
              // 配置了自动汇报，每个小里程碑完成自动触发汇报
              if (this.scheduler.config.autoReportOnMilestone) {
                this.log(`[自动汇报] ${task.name} - 已完成 ${task.completed}/${task.target} 个里程碑: ${nextFile.description} (${nextFile.path})`);
                // 通过特殊日志标记让主Agent捕获并推送汇报
                console.log(`[AUTO-REPORT] ${task.id} completed milestone: ${nextFile.description}`);
              }
              
              // 如果队列空了，任务完成
              const pendingFiles = (task.config && task.config.pendingFiles) ? task.config.pendingFiles : task.pendingFiles;
              if (pendingFiles.length === 0) {
                this.log(`[${task.name}] 所有文件生成完成，标记任务完成`);
                this.scheduler.completeTask(task);
              }
              this.working = false;
              this.currentTasks.delete(task.id);
              resolve(true);
            }
          }, 10000); // 每10秒检查一次
        });
      } else if (task.type === 'jinjiang-chapters' && task.basePath && task.chapterTitles) {
        const existingFiles = fs.readdirSync(task.basePath);
        const completedChapters = existingFiles.filter(f => f.startsWith('第') && f.endsWith('.md')).length;
        const chapterNum = completedChapters + 1;
        
        if (chapterNum > task.endChapter) {
          this.log(`[${task.name}] 已完成到目标章节 ${task.endChapter}，标记任务完成`);
          task.completed = task.target;
          this.scheduler.completeTask(task);
          this.working = false;
          this.currentTasks.delete(task.id);
          return Promise.resolve(false);
        }
        
        const title = task.chapterTitles[chapterNum];
        if (!title) {
          this.log(`[${task.name}] 找不到第${chapterNum}章标题，停止`);
          this.working = false;
          this.currentTasks.delete(task.id);
          return Promise.resolve(false);
        }
        
        const fileName = `第${chapterNum}章_${title}.md`;
        const filePath = path.join(task.basePath, fileName);
        
        this.log(`[${task.name}] 开始写作第${chapterNum}章: ${title}`);
        
        // Spawn subagent to generate directly
        this.spawnSubagent(task, {
          type: 'jinjiang-chapter',
          taskId: task.id,
          taskName: task.name,
          chapterNum: chapterNum,
          title: title,
          filePath: filePath,
         大纲Path: '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/金枝囚/《金枝囚》最终定版大纲_v10.0.md',
          minSize: 2000,
        });
        
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (fs.existsSync(filePath) && fs.statSync(filePath).size > 2000) {
              clearInterval(checkInterval);
              this.log(`[${task.name}] 第${chapterNum}章 ${title} 已完成，大小: ${fs.statSync(filePath).size} bytes`);
              task.completed++;
              
              // 配置了自动汇报，每章完成自动触发汇报
              if (this.scheduler.config.autoReportOnMilestone) {
                this.log(`[自动汇报] ${task.name} - 第${chapterNum}章 \"${title}\" 已完成 (${filePath})`);
                // 通过特殊日志标记让主Agent捕获并推送汇报
                console.log(`[AUTO-REPORT] ${task.id} completed milestone: 第${chapterNum}章 ${title}`);
              }
              
              if (task.completed >= task.target) {
                this.log(`[${task.name}] 本批次${task.target}章全部完成，触发自动汇报`);
                this.scheduler.completeTask(task);
              }
              this.working = false;
              this.currentTasks.delete(task.id);
              resolve(true);
            }
          }, 10000); // 每10秒检查一次
        });
      } else {
        this.log(`[执行器] 任务 ${task.id} (type=${task.type}) 没有正确配置，跳过`);
        this.working = false;
        this.currentTasks.delete(task.id);
        return Promise.resolve(false);
      }
    } catch (e) {
      this.log(`[执行器] 执行任务出错: ${task.name}, 错误: ${e.message}`);
      task.status = 'pending'; // 放回队列重试
      const index = this.scheduler.runningTasks.findIndex(t => t.id === task.id);
      if (index > -1) {
        this.scheduler.runningTasks.splice(index, 1);
      }
      this.working = false;
      this.currentTasks.delete(task.id);
      return Promise.resolve(false);
    }
  }

  // 启动执行循环 - 不断检查有任务就执行
  start(interval = 10000) {
    this.log('=== 任务执行器启动 ===');
    
    setInterval(() => {
      if (!this.working && this.scheduler.runningTasks.length > 0) {
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
