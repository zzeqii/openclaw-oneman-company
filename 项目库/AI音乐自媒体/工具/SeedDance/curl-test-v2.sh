#!/bin/bash

API_KEY="4a8e9856-751e-47e8-ae2a-a41904e033cf"
ENDPOINT="https://ark.cn-beijing.volces.com/api/v3/videos/generations"
MODEL="ep-20260314042257-fz482"

echo "测试API连接，使用最新模型接入点..."
curl -i -X POST $ENDPOINT \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL"'",
    "prompt": "紫色长发少女挥手，真人质感",
    "duration": 5,
    "resolution": "720p"
  }'

echo -e "\n测试完成"
