require('dotenv').config({ path: '/Users/bytedance/.openclaw/workspace/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 确保output目录存在
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * 调用Seed Dance生成视频（新API路径）
 * @param {string} prompt 生成提示词
 * @param {string} imagePath 参考图片路径
 * @param {number} duration 视频时长（默认5秒，支持5/10/15秒）
 * @param {boolean} watermark 是否加水印
 * @param {boolean} cameraFixed 是否固定镜头
 * @returns {string} 生成的视频本地路径
 */
async function generateVideo(prompt, imagePath, duration = 5, watermark = true, cameraFixed = false) {
  try {
    const apiKey = process.env.ARK_API_KEY;
    const endpoint = 'https://ark.cn-beijing.volces.com/api/v3/videos/generations';
    const model = 'ep-20260313144025-s75p5'; // Seed Dance 1.0 Pro 旧版本，支持15秒时长

    // 构造请求参数
    const content = [
      {
        type: 'text',
        text: prompt
      }
    ];

    // 如果提供了参考图片，转为base64
    let base64Image;
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      base64Image = imageBuffer.toString('base64');
    }

    const requestBody = {
      model: model,
      input: {
        prompt: prompt,
        image: imagePath ? `data:image/png;base64,${base64Image}` : undefined,
        duration: duration,
        watermark: watermark,
        camera_fixed: cameraFixed
      }
    };

    // 提交视频生成任务
    console.log('提交视频生成任务到火山方舟...');
    const submitResponse = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

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
