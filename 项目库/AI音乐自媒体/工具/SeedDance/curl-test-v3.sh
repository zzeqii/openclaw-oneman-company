#!/bin/bash

API_KEY="4a8e9856-751e-47e8-ae2a-a41904e033cf"
ENDPOINT="https://ark.cn-beijing.volces.com/api/v3/videos/generations"
MODEL="doubao-seedance-1-5-pro-251215"

echo "测试API连接，使用官方模型ID..."
curl -v -X POST $ENDPOINT \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL"'",
    "prompt": "紫色长发少女挥手，真人质感",
    "duration": 5,
    "resolution": "720p"
  }'

echo -e "\n测试完成"
