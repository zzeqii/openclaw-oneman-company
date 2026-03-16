/**
 * auto-resource-allocation - 全自动资源分配调度器
 * 功能：
 * 1. 定期检测系统CPU/内存负载
 * 2. 根据优先级队列自动分配任务
 * 3. 多任务并行推进，充分利用空闲资源
 * 4. 完成阶段性任务自动触发汇报
 * 5. 任务执行器保障任务真正落地执行，不偷懒
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const TaskExecutor = require('./executor');

class AutoResourceAllocator {
  constructor() {
    this.config = {
      cpuThreshold: 70, // CPU低于70%可以新增任务
      memThreshold: 98, // macOS下内存大部分是缓存，调整阈值到98%
      checkInterval: 5 * 60 * 1000, // 每5分钟检查一次
      maxParallelTasks: 3, // 最大并行任务数，保证质量
    };
    
    this.priorityQueue = [
      {
        id: 'jinjiang-jinzhiqi-chapters',
        name: '《金枝囚》第11-15章写作',
        type: 'jinjiang-chapters',
        priority: 0, // P0最高优先级
        status: 'pending',
        target: 5, // 本批次目标章数
        completed: 0,
        startChapter: 11,
        endChapter: 15,
        basePath: '/Users/bytedance/.openclaw/workspace/项目库/晋江文学小说/金枝囚/草稿/chapters/',
        chapterTitles: {
          11: '深夜的访客',
          12: '绣活的销路',
          13: '小丫鬟的病',
          14: '母亲再次要钱',
          15: '开水泼脸',
        },
      },
      {
        id: 'app-matrix-mindmap-frontend',
        name: 'APP工具矩阵 - AI思维导图前端开发',
        type: 'files-generation',
        priority: 1, // P1
        status: 'pending',
        target: 6,
        completed: 0,
        pendingFiles: [
          {
            path: '/Users/bytedance/Documents/trae_projects/app_matrix/frontend/src/components/Mindmap.vue',
            description: '思维导图可视化组件',
            minSize: 1000,
          },
          {
            path: '/Users/bytedance/Documents/trae_projects/app_matrix/frontend/src/views/Home.vue',
            description: '首页生成入口页面',
            minSize: 500,
          },
          {
            path: '/Users/bytedance/Documents/trae_projects/app_matrix/frontend/src/router/index.js',
            description: '路由配置',
            minSize: 300,
          },
          {
            path: '/Users/bytedance/Documents/trae_projects/app_matrix/frontend/src/App.vue',
            description: '根组件',
            minSize: 300,
          },
          {
            path: '/Users/bytedance/Documents/trae_projects/app_matrix/frontend/package.json',
            description: '前端依赖配置',
            minSize: 300,
          },
          {
            path: '/Users/bytedance/Documents/trae_projects/app_matrix/frontend/README.md',
            description: '使用说明',
            minSize: 500,
          },
        ],
      },
      {
        id: 'ai-music-assets-generation',
        name: 'AI音乐自媒体 - 生成账号运营素材',
        type: 'files-generation',
        priority: 2, // P2
        status: 'pending',
        target: 5,
        completed: 0,
        pendingFiles: [
          {
            path: '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/运营材料/抖音简介.md',
            description: '抖音账号简介',
            minSize: 200,
          },
          {
            path: '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/运营材料/bilibili简介.md',
            description: 'Bilibili账号简介',
            minSize: 200,
          },
          {
            path: '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/运营材料/首支单曲prompt.md',
            description: '首支单曲AI生成prompt',
            minSize: 300,
          },
        ],
      },
    ];
    
    this.runningTasks = [];
    this.lastCheckTime = null;
    this.logFile = path.join(__dirname, 'scheduler.log');
  }

  // 获取当前系统负载
  getSystemLoad() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const cpuUsage = 100 - (totalIdle / totalTick * 100);
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memUsage = ((totalMem - freeMem) / totalMem) * 100;
    
    // macOS下，os.freemem()只返回真正空闲的，实际上大部分内存是缓存
    // 只要CPU使用率低于阈值，并且还有可用任务槽，就认定有空闲容量
    const hasSpareCapacity = cpuUsage < this.config.cpuThreshold && 
                            this.runningTasks.length < this.config.maxParallelTasks;
    
    return {
      cpuUsage: parseFloat(cpuUsage.toFixed(2)),
      memUsage: parseFloat(memUsage.toFixed(2)),
      hasSpareCapacity: hasSpareCapacity,
      availableSlots: this.config.maxParallelTasks - this.runningTasks.length,
    };
  }

  // 记录日志
  log(message) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    console.log(logMsg);
  }

  // 从队列中取出下一个任务
  getNextPendingTask() {
    return this.priorityQueue
      .filter(t => t.status === 'pending')
      .sort((a, b) => a.priority - b.priority)[0];
  }

  // 启动一个任务
  startTask(task) {
    task.status = 'running';
    task.startTime = new Date();
    this.runningTasks.push(task);
    this.log(`启动任务: ${task.name} (优先级P${task.priority})`);
    return task;
  }

  // 标记任务完成
  completeTask(task) {
    task.status = 'completed';
    task.endTime = new Date();
    task.duration = (task.endTime - task.startTime) / 1000 / 60;
    const index = this.runningTasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      this.runningTasks.splice(index, 1);
    }
    this.log(`完成任务: ${task.name} (耗时 ${task.duration.toFixed(1)} 分钟)`);
    
    // 自动触发汇报（这里会被OpenClaw捕获）
    this.log(`[自动汇报] 任务 ${task.name} 已完成，请查收进度`);
  }

  // 检查已完成任务进度
  checkProgress() {
    // 检查《金枝囚》章节进度
    const jinzhiqiPath = path.join(
      '/Users/bytedance/.openclaw/workspace',
      '项目库/晋江文学小说/金枝囚/草稿/chapters/'
    );
    
    try {
      const files = fs.readdirSync(jinzhiqiPath);
      const chapterFiles = files.filter(f => f.startsWith('第') && f.endsWith('.md'));
      const completedChapters = chapterFiles.length;
      
      const task = this.priorityQueue.find(t => t.id === 'jinjiang-jinzhiqi-chapters');
      if (task) {
        task.completed = completedChapters - 5; // 前5章已完成
        if (task.completed >= task.target && task.status === 'running') {
          this.completeTask(task);
        }
        if (task.status === 'running') {
          this.log(`《金枝囚》本批次已完成 ${task.completed}/${task.target} 章，还需 ${task.target - task.completed} 章`);
        }
      }
    } catch (e) {
      this.log(`检查《金枝囚》进度出错: ${e.message}`);
    }
    
    // 可以在这里添加其他任务的进度检查
  }

  // 主调度循环
  schedule() {
    const load = this.getSystemLoad();
    this.lastCheckTime = new Date();
    
    this.log(`系统检查: CPU ${load.cpuUsage}%, 内存 ${load.memUsage.toFixed(1)}%, 运行中任务 ${this.runningTasks.length}/${this.config.maxParallelTasks}`);
    
    // 检查现有任务进度
    this.checkProgress();
    
    // 有空闲容量，持续分配新任务直到填满可用槽位
    let availableSlots = this.config.maxParallelTasks - this.runningTasks.length;
    while (availableSlots > 0) {
      const nextTask = this.getNextPendingTask();
      if (nextTask && this.getSystemLoad().hasSpareCapacity) {
        this.startTask(nextTask);
        this.log(`分配新任务: ${nextTask.name}，剩余槽位 ${availableSlots - 1}`);
        availableSlots--;
      } else {
        break;
      }
    }
    
    if (this.runningTasks.length === 0) {
      this.log('没有可运行任务，等待下一次检查');
    }
  }

  // 启动调度器
  start() {
    this.log('=== 自动资源分配调度器启动 ===');
    this.schedule();
    
    // 启动任务执行器
    this.executor = new TaskExecutor(this);
    this.executor.start();
    this.log('=== 任务执行器已启动 ===');
    
    // 定时检查
    setInterval(() => {
      this.schedule();
    }, this.config.checkInterval);
  }

  // 获取当前状态
  getStatus() {
    const load = this.getSystemLoad();
    return {
      config: this.config,
      systemLoad: load,
      priorityQueue: this.priorityQueue,
      runningTasks: this.runningTasks,
      lastCheckTime: this.lastCheckTime,
    };
  }
}

// 如果直接运行则启动
if (require.main === module) {
  const scheduler = new AutoResourceAllocator();
  scheduler.start();
}

module.exports = AutoResourceAllocator;
