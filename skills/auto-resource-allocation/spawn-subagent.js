/**
 * spawn-subagent.js - 自动 spawn 子agent生成文件
 * 由 executor 调用，在子进程中生成文件，完成自动汇报
 */

const { sessions_spawn } = require('openclaw');

// 从命令行获取配置
const config = JSON.parse(process.argv[2]);

console.log(`[spawn-subagent] 启动子agent生成: ${config.taskName} - ${config.description || config.title}`);

// 生成任务描述
let task = '';
if (config.type === 'files-generation') {
  task = `生成文件 ${config.description}，输出到 ${config.filePath}，按照项目架构实现，完成后自动汇报进度`;
} else if (config.type === 'jinjiang-chapter') {
  task = `生成《金枝囚》第${config.chapterNum}章 "${config.title}"，严格按照${config.大纲Path}的剧情创作，输出到 ${config.filePath}，字数约3000字，符合晋江单章篇幅标准，完成后自动汇报进度`;
}

// Spawn subagent
sessions_spawn({
  task: task,
  label: `${config.taskId}-${Date.now()}`,
  runtime: 'subagent',
  cwd: process.cwd(),
  mode: 'run',
  cleanup: 'keep',
});

console.log(`[spawn-subagent] 子agent已启动`);
