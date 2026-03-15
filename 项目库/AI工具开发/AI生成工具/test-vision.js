require('dotenv').config({ path: '/Users/bytedance/.openclaw/workspace/.env' });
const axios = require('axios');
const fs = require('fs');

async function analyzeImage(imagePath, prompt) {
  try {
    // 读取图片并转为base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await axios.post(`${process.env.ARK_ENDPOINT}/chat/completions`, {
      model: process.env.MODEL_VISION,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1024,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('图片分析失败：', error.response ? error.response.data : error.message);
    throw error;
  }
}

// 测试调用
analyzeImage(
  '/Users/bytedance/.openclaw/media/inbound/3f686245-2740-44c0-9af6-c41ad5f7142b.jpg',
  '详细解读这张系统架构图，说明每个模块的作用和整体流程'
).then(result => console.log('分析结果：\n', result));
