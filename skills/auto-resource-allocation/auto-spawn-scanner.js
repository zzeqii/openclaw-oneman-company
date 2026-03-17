/**
 * auto-spawn-scanner.js - 定时扫描日志，发现需要生成的任务，通知主Agent spawn子agent
 * 因为sessions_spawn只能从主Agent调用，所以需要这里输出标记，主Agent监听
 */

const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'executor.log');
let lastPosition = 0;

// 扫描新的需要生成任务
function scanForNewTasks() {
  try {
    const stats = fs.statSync(logPath);
    if (stats.size === lastPosition) {
      return [];
    }

    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').slice(lastPosition);
    lastPosition = stats.size;

    const tasks = [];
    // 匹配 "开始执行任务" 来找到新任务，输出[NEW-TASK]标记
    const regex = /\[.*\] \[执行器\] 开始执行任务: (.*)/;

    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        // 继续找需要生成文件的信息
        const fileMatch = line.match(/.*需要生成文件: (.*)/);
        if (fileMatch) {
          // 这里我们只需要输出标记，主Agent会处理
          console.log(`[NEW-TASK] ${match[1]}: ${fileMatch[1]}`);
          tasks.push({
            taskName: match[1],
            filePath: fileMatch[1],
          });
        }
      }
    });

    return tasks;
  } catch (e) {
    console.error('Error scanning for new tasks:', e);
    return [];
  }
}

// 启动定时扫描，每60秒扫描一次
if (require.main === module) {
  console.log('=== Auto-spawn scanner started ===');
  setInterval(() => {
    scanForNewTasks();
  }, 60000);
}

module.exports = { scanForNewTasks };
