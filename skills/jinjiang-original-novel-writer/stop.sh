#!/bin/bash
# jinjiang-original-novel-writer 停止脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/writer.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "jinjiang-original-novel-writer 未运行（没有PID文件）"
  exit 0
fi

PID=$(cat "$PID_FILE")
if ! kill -0 "$PID" 2>/dev/null; then
  echo "进程 $PID 不存在，清理PID文件"
  rm -f "$PID_FILE"
  exit 0
fi

echo "停止jinjiang-original-novel-writer，PID: $PID"
kill "$PID"
sleep 1
if kill -0 "$PID" 2>/dev/null; then
  echo "进程不响应，强制杀死"
  kill -9 "$PID"
fi
rm -f "$PID_FILE"
echo "jinjiang-original-novel-writer 已停止"
