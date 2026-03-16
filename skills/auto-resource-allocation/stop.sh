#!/bin/bash
# auto-resource-allocation 停止脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/scheduler.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "调度器未运行（没有PID文件）"
  exit 0
fi

PID=$(cat "$PID_FILE")
if ! kill -0 "$PID" 2>/dev/null; then
  echo "进程 $PID 不存在，清理PID文件"
  rm -f "$PID_FILE"
  exit 0
fi

echo "停止自动调度器，PID: $PID"
kill "$PID"
sleep 1
if kill -0 "$PID" 2>/dev/null; then
  echo "进程不响应，强制杀死"
  kill -9 "$PID"
fi
rm -f "$PID_FILE"
echo "调度器已停止"
