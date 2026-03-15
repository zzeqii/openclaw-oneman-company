#!/bin/bash

API_KEY="4a8e9856-751e-47e8-ae2a-a41904e033cf"
ENDPOINT="https://ark.cn-beijing.volces.com/api/v3/chat/completions"
MODEL="doubao-seedance-1-5-pro-251215"

echo "测试视频生成通过Chat Completions接口..."
curl -v -X POST $ENDPOINT \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$MODEL"'",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "紫色长发少女挥手，真人质感，5秒视频，720p"
          }
        ]
      }
    ],
    "stream": false
  }'

echo -e "\n测试完成"
