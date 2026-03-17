/**
 * auto-report-scanner.js - 扫描executor日志中的[AUTO-REPORT]，发现完成里程碑主动汇报给主Agent
 */

const fs = require('fs');
const path = require('path');

let lastPosition = 0;
const logPath = path.join(__dirname, 'executor.log');

// 扫描新的[AUTO-REPORT]
function scanForNewReports() {
  try {
    const stats = fs.statSync(logPath);
    if (stats.size === lastPosition) {
      return [];
    }

    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n').slice(lastPosition);
    lastPosition = stats.size;

    const reports = [];
    const regex = /\[AUTO-REPORT\] (.*) completed milestone: (.*)/;

    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        reports.push({
          taskId: match[1],
          milestone: match[2],
          line: line
        });
      }
    });

    return reports;
  } catch (e) {
    console.error('Error scanning for reports:', e);
    return [];
  }
}

// 启动定时扫描，每10秒扫描一次
if (require.main === module) {
  console.log('=== Auto-report scanner started ===');
  setInterval(() => {
    const reports = scanForNewReports();
    reports.forEach(report => {
      // 输出标记，主进程会捕获
      console.log(`[MASTER-AUTO-REPORT] ${JSON.stringify(report)}`);
    });
  }, 10000);
}

module.exports = { scanForNewReports };
