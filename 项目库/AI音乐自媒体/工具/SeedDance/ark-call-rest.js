require('dotenv').config({ path: '/Users/bytedance/.openclaw/workspace/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// 确保output目录存在
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * 调用Seed Dance生成视频（REST API版本，修复参数问题）
 * @param {string} prompt 生成提示词
 * @param {string} imagePath 参考图片路径（可选，图生视频时使用）
 * @param {number} duration 视频时长（默认5秒，支持5/10/15秒）
 * @param {string} resolution 分辨率（默认720p，支持720p/1080p）
 * @returns {string} 生成的视频本地路径
 */
async function generateVideo(prompt, imagePath = null, duration = 5, resolution = '720p') {
  try {
    const apiKey = process.env.ARK_API_KEY;
    const endpoint = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const model = 'doubao-seedance-1-5-pro-251215'; // 最新Seed Dance 1.5 Pro官方模型ID

    console.log('使用API端点：', endpoint);
    console.log('使用模型：', model);

    // 构造请求参数（Chat Completions格式）
    const requestBody = {
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt} --duration ${duration} --resolution ${resolution} --watermark false --camera_fixed true`
            }
          ]
        }
      ],
      stream: false
    };

    // 如果提供了参考图片，加入到messages中
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      requestBody.messages[0].content.push({
        type: "image_url",
        image_url: {
          url: `data:image/png;base64,${base64Image}`
        }
      });
      console.log('已加载参考图片，大小：', (imageBuffer.length / 1024 / 1024).toFixed(2), 'MB');
    }

    // 提交视频生成任务
    console.log('提交视频生成任务到火山方舟...');
    const submitResponse = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('提交响应：', submitResponse.data);
    const taskId = submitResponse.data.id;
    console.log(`任务提交成功，ID：${taskId}`);

    // 轮询任务状态
    let taskStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // 每10秒轮询一次
      const statusResponse = await axios.get(`https://ark.cn-beijing.volces.com/api/v3/videos/generations/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      taskStatus = statusResponse.data;
      console.log(`任务状态：${taskStatus.status}，进度：${taskStatus.progress || 0}%`);
    } while (taskStatus.status !== 'success' && taskStatus.status !== 'failed');

    if (taskStatus.status === 'failed') {
      throw new Error(`视频生成失败：${taskStatus.error || '未知错误'}`);
    }

    // 下载视频到本地
    const videoUrl = taskStatus.video_url;
    const videoName = `seed-dance-${Date.now()}.mp4`;
    const videoPath = path.join(outputDir, videoName);
    
    console.log('下载视频中...');
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(videoPath, videoResponse.data);

    console.log(`视频生成成功，保存路径：${videoPath}`);
    return videoPath;
  } catch (error) {
    console.error('视频生成失败：', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    throw error;
  }
}

module.exports = {
  generateVideo,
};
