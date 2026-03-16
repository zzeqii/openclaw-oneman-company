#!/bin/bash
# smart-memory-recovery 启动脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/recovery.log"
PID_FILE="$SCRIPT_DIR/recovery.pid"

# 检查是否已经运行
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "smart-memory-recovery 已经在运行，PID: $PID"
    exit 0
  else
    echo "PID文件存在但进程不存在，清理后启动"
    rm -f "$PID_FILE"
  fi
fi

echo "启动smart-memory-recovery..."
node "$SCRIPT_DIR/smart-memory-recovery.js" >> "$LOG_FILE" 2>&1 &
PID=$!
echo $PID > "$PID_FILE"
echo "smart-memory-recovery 已启动，PID: $PID"
echo "日志文件: $LOG_FILE"
