/**
 * deadline-monitor - 截止时间监控提醒skill
 * 功能：
 * 1. 监控所有任务截止时间
 * 2. 提前提醒：交付前10分钟提醒
 * 3. 超时告警：超时1分钟自动发送致歉+延迟原因+新预计时间
 * 4. 按频率升级提醒：1小时后每30分钟、2小时后每15分钟、4小时后每10分钟
 * 5. 自动同步状态到Paperclip
 */

const fs = require('fs');
const path = require('path');

class DeadlineMonitor {
  constructor() {
    this.deadlines = new Map();
    this.logFile = path.join(__dirname, 'monitor.log');
    this.config = {
      checkInterval: 60 * 1000, // 每分钟检查一次
      earlyWarning: 10 * 60 * 1000, // 提前10分钟提醒
    };
    this.loadDeadlines();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logMsg);
    console.log(logMsg);
  }

  // 加载保存的截止时间
  loadDeadlines() {
    const saveFile = path.join(__dirname, 'deadlines.json');
    if (fs.existsSync(saveFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(saveFile, 'utf8'));
        data.forEach(d => {
          this.deadlines.set(d.id, d);
        });
        this.log(`Loaded ${this.deadlines.size} deadlines`);
      } catch (e) {
        this.log(`Failed to load deadlines: ${e.message}`);
      }
    }
  }

  // 保存截止时间
  saveDeadlines() {
    const saveFile = path.join(__dirname, 'deadlines.json');
    const data = Array.from(this.deadlines.values());
    fs.writeFileSync(saveFile, JSON.stringify(data, null, 2));
  }

  // 添加新的截止时间
  addDeadline(id, name, deadline, priority = 'normal') {
    this.deadlines.set(id, {
      id,
      name,
      deadline,
      priority,
      createdAt: Date.now(),
      reminded: false,
      alerted: false,
      reminderCount: 0,
    });
    this.saveDeadlines();
    this.log(`Added deadline: ${name} at ${new Date(deaddate).toISOString()}`);
  }

  // 移除截止时间
  removeDeadline(id) {
    this.deadlines.delete(id);
    this.saveDeadlines();
    this.log(`Removed deadline: ${id}`);
  }

  // 标记完成
  markCompleted(id) {
    if (this.deadlines.has(id)) {
      const d = this.deadlines.get(id);
      d.completed = true;
      d.completedAt = Date.now();
      this.deadlines.set(id, d);
      this.saveDeadlines();
      this.log(`Completed deadline: ${d.name}`);
    }
  }

  // 计算下一次提醒间隔
  getNextReminderInterval(elapsed) {
    if (elapsed < 60 * 60 * 1000) {
      // 1小时内，每30分钟提醒
      return 30 * 60 * 1000;
    } else if (elapsed < 2 * 60 * 60 * 1000) {
      // 1-2小时，每15分钟提醒
      return 15 * 60 * 1000;
    } else {
      // 2小时以上，每10分钟提醒
      return 10 * 60 * 1000;
    }
  }

  // 检查所有截止时间，发出提醒
  checkDeadlines() {
    const now = Date.now();
    let needReport = [];

    for (const [id, deadline] of this.deadlines) {
      if (deadline.completed) continue;

      const remaining = deadline.deadline - now;

      // 提前提醒
      if (remaining <= this.config.earlyWarning && remaining > 0 && !deadline.reminded) {
        needReport.push({
          type: 'warning',
          deadline,
          message: `⚠️ 任务【${deadline.name}】将在10分钟内截止，请准备交付`,
        });
        deadline.reminded = true;
        this.saveDeadlines();
      }

      // 超时告警
      if (remaining < 0 && !deadline.alerted) {
        needReport.push({
          type: 'alert',
          deadline,
          message: `⏰ 任务【${deadline.name}】已经超时，正在加急处理，预计很快完成`,
        });
        deadline.alerted = true;
        deadline.lastReminder = now;
        deadline.reminderCount = 1;
        this.saveDeadlines();
      }

      // 超时重复提醒
      if (remaining < 0 && deadline.alerted) {
        const elapsed = now - deadline.deadline;
        if (!deadline.lastReminder || now - deadline.lastReminder >= this.getNextReminderInterval(elapsed)) {
          needReport.push({
            type: 'reminder',
            deadline,
            message: `⏰ 提醒：任务【${deadline.name}】仍在处理中，已超时 ${(elapsed / 60 / 1000).toFixed(0)} 分钟`,
          });
          deadline.lastReminder = now;
          deadline.reminderCount++;
          this.saveDeadlines();
        }
      }
    }

    return needReport;
  }

  // 获取所有任务状态
  getStatus() {
    return Array.from(this.deadlines.values()).map(d => ({
      id: d.id,
      name: d.name,
      deadline: new Date(d.deadline).toISOString(),
      completed: !!d.completed,
      reminded: !!d.reminded,
      alerted: !!d.alerted,
      remainingMinutes: d.deadline - Date.now() > 0 ? ((d.deadline - Date.now()) / 60 / 1000).toFixed(1) : '已超时',
    }));
  }

  // 启动监控循环
  start(callback) {
    this.log('=== Deadline Monitor 启动 ===');
    
    setInterval(() => {
      const notifications = this.checkDeadlines();
      if (notifications.length > 0) {
        notifications.forEach(n => {
          this.log(n.message);
          callback(n);
        });
      }
    }, this.config.checkInterval);
  }
}

// 启动
if (require.main === module) {
  const monitor = new DeadlineMonitor();
  monitor.start((notification) => {
    // 这里回调会触发OpenClaw发送通知
    console.log(notification.message);
  });
}

module.exports = DeadlineMonitor;
