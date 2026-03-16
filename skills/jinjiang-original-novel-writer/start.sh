#!/bin/bash
# jinjiang-original-novel-writer 启动脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/writer.log"
PID_FILE="$SCRIPT_DIR/writer.pid"

# 检查是否已经运行
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "jinjiang-original-novel-writer 已经在运行，PID: $PID"
    exit 0
  else
    echo "PID文件存在但进程不存在，清理后启动"
    rm -f "$PID_FILE"
  fi
fi

echo "启动jinjiang-original-novel-writer 自动写作..."
node "$SCRIPT_DIR/jinjiang-original-novel-writer.js" >> "$LOG_FILE" 2>&1 &
PID=$!
echo $PID > "$PID_FILE"
echo "jinjiang-original-novel-writer 已启动，PID: $PID"
echo "日志文件: $LOG_FILE"
