/**
 * 任务执行器 - auto-resource-allocation
 * 负责实际驱动文件生成，一个接一个自动执行，完成自动继续下一个
 * 完整闭环：调度 → spawn子agent → 检测完成 → 自动汇报 → 下一个
 */

const fs = require('fs');
const path = require('path');
const { sessions_spawn } = require('openclaw');

class TaskExecutor {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.currentTasks = new Map();
    this.logFile = path.join(__dirname, 'executor.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    console.log(logMsg);
  }

  // 真正 spawn subagent 生成文件
  spawnSubagent(config) {
    // 生成任务描述
    let taskDesc = '';
    if (config.type === 'files-generation') {
      taskDesc = `生成文件 ${config.description}，输出到 ${config.filePath}，按照项目架构实现，完成后自动汇报进度`;
    } else if (config.type === 'jinjiang-chapter') {
      taskDesc = `生成《金枝囚》第${config.chapterNum}章 "${config.title}"，严格按照${config.大纲Path}的剧情创作，输出到 ${config.filePath}，字数约3000字，符合晋江单章篇幅标准，完成后自动汇报进度`;
    }

    // 直接 spawn 子agent
    sessions_spawn({
      task: taskDesc,
      label: `${config.taskId}-${Date.now()}`,
      runtime: 'subagent',
      cwd: process.cwd(),
      mode: 'run',
      cleanup: 'keep',
    });

    this.log(`已启动子agent生成: ${config.description || config.title}`);
  }

  // 根据任务配置执行
  async executeTask(task) {
    this.currentTasks.set(task.id, task);
    this.log(`[执行器] 开始执行任务: ${task.name}`);
    
    try {
      // 先判断类型
      if (task.type === 'jinjiang-chapters' && task.basePath && task.chapterTitles) {
        // 小说章节生成走这个分支
        const existingFiles = fs.readdirSync(task.basePath);
        const completedChapters = existingFiles.filter(f => f.startsWith('第') && f.endsWith('.md')).length;
        const chapterNum = completedChapters + 1;
        
        if (chapterNum > task.endChapter) {
          this.log(`[${task.name}] 已完成到目标章节 ${task.endChapter}，标记任务完成`);
          task.completed = task.target;
          this.scheduler.completeTask(task);
          this.currentTasks.delete(task.id);
          return false;
        }
        
        const title = task.chapterTitles[chapterNum];
        if (!title) {
          this.log(`[${task.name}] 找不到第${chapterNum}章标题，停止`);
          this.currentTasks.delete(task.id);
          return false;
        }
        
        const fileName = `第${chapterNum}章_${title}.md`;
        const filePath = path.join(task.basePath, fileName);
        
        this.log(`[${task.name}] 开始写作第${chapterNum}章: ${title}`);
        
        // 直接 spawn subagent 生成
        this.spawnSubagent({
          type: 'jinjiang-chapter',
          taskId: task.id,
          taskName: task.name,
          chapterNum: chapterNum,
          title: title,
          filePath: filePath,
          大纲Path: '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/金枝囚/《金枝囚》最终定版大纲_v10.0.md',
          minSize: 2000,
        });
        
        // 检查交给定时器，完成后自动处理
        const checkInterval = setInterval(() => {
          if (fs.existsSync(filePath) && fs.statSync(filePath).size > 2000) {
            clearInterval(checkInterval);
            this.log(`[${task.name}] 第${chapterNum}章 ${title} 已完成，大小: ${fs.statSync(filePath).size} bytes`);
            task.completed++;
            
            // 配置了自动汇报，每章完成自动触发汇报
            if (this.scheduler.config.autoReportOnMilestone) {
              this.log(`[自动汇报] ${task.name} - 第${chapterNum}章 "${title}" 已完成 (${filePath})`);
              // 通过特殊日志标记让主Agent捕获并推送汇报
              console.log(`[AUTO-REPORT] ${task.id} completed milestone: 第${chapterNum}章 ${title}`);
            }
            
            if (task.completed >= task.target) {
              this.log(`[${task.name}] 本批次${task.target}章全部完成，触发自动汇报`);
              this.scheduler.completeTask(task);
            }
            this.currentTasks.delete(task.id);
          }
        }, 10000); // 每10秒检查一次

        return true;
      } else if ((task.config && task.config.pendingFiles) || task.pendingFiles) {
        // 如果任务有配置好的待生成文件队列，按队列执行
        const pendingFiles = (task.config && task.config.pendingFiles) ? task.config.pendingFiles : task.pendingFiles;
        const nextFile = pendingFiles.shift();
        this.log(`[${task.name}] 需要生成文件: ${nextFile.path}`);
        
        // 直接 spawn subagent 生成
        this.spawnSubagent({
          type: 'files-generation',
          taskId: task.id,
          taskName: task.name,
          filePath: nextFile.path,
          description: nextFile.description,
          minSize: nextFile.minSize || 300,
        });
        
        // 检查交给定时器，完成后自动处理
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
            const pendingFilesNow = (task.config && task.config.pendingFiles) ? task.config.pendingFiles : task.pendingFiles;
            if (pendingFilesNow.length === 0) {
              this.log(`[${task.name}] 所有文件生成完成，标记任务完成`);
              this.scheduler.completeTask(task);
            }
            this.currentTasks.delete(task.id);
          }
        }, 10000); // 每10秒检查一次

        return true;
      } else {
        this.log(`[执行器] 任务 ${task.id} (type=${task.type}) 没有正确配置，跳过`);
        this.currentTasks.delete(task.id);
        return false;
      }
    } catch (e) {
      this.log(`[执行器] 执行任务出错: ${task.name}, 错误: ${e.message}`);
      task.status = 'pending'; // 放回队列重试
      const index = this.scheduler.runningTasks.findIndex(t => t.id === task.id);
      if (index > -1) {
        this.scheduler.runningTasks.splice(index, 1);
      }
      this.currentTasks.delete(task.id);
      return false;
    }
  }

  // 启动执行循环 - 不断检查有任务就执行，支持并行所有运行中任务
  start(interval = 10000) {
    this.log('=== 任务执行器启动 ===');
    
    setInterval(() => {
      // 对每个运行中的任务，如果没在执行，就启动它
      // 真正并行，所有运行中任务同时推进
      this.scheduler.runningTasks.forEach(task => {
        if (!this.currentTasks.has(task.id)) {
          this.executeTask(task);
        }
      });
    }, interval);
  }
}

module.exports = TaskExecutor;
