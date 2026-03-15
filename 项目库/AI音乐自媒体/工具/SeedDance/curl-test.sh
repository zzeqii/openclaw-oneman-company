#!/bin/bash

API_KEY="4a8e9856-751e-47e8-ae2a-a41904e033cf"
ENDPOINT="https://ark.cn-beijing.volces.com/api/v3/videos/generations"
MODEL="ep-20260313144025-s75p5"

echo "测试API连接..."
curl -v -X POST $ENDPOINT \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL"'",
    "prompt": "紫色长发少女挥手",
    "duration": 5
  }'

echo -e "\n测试完成"
