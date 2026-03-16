#!/bin/bash
# 自动调度器监控脚本 - 保障调度器持续运行，崩溃自动重启

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/scheduler.pid"
LOG_FILE="$SCRIPT_DIR/monitor.log"

log() {
    echo "[$(date -Iseconds)] $1" >> "$LOG_FILE"
    echo "[$(date -Iseconds)] $1"
}

is_running() {
    if [ ! -f "$PID_FILE" ]; then
        return 1
    fi
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

start_scheduler() {
    log "启动自动资源分配调度器..."
    node "$SCRIPT_DIR/scheduler.js" >> "$SCRIPT_DIR/scheduler.log" 2>&1 &
    PID=$!
    echo $PID > "$PID_FILE"
    log "调度器已启动，PID: $PID"
}

check_and_restart() {
    if ! is_running; then
        log "调度器未运行，清理PID文件"
        rm -f "$PID_FILE"
        log "重启调度器..."
        start_scheduler
    else
        log "调度器正常运行，PID: $(cat $PID_FILE)"
    fi
}

# 退出处理
cleanup() {
    log "收到退出信号，清理..."
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
        fi
        rm -f "$PID_FILE"
    fi
    exit 0
}

trap cleanup INT TERM

# 主监控循环
log "=== 自动调度器监控启动 ==="
while true; do
    check_and_restart
    sleep 60  # 每分钟检查一次
done
