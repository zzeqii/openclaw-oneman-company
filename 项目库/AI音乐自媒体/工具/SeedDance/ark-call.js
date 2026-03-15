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
 * 调用Seed Dream生成图片（使用方舟API密钥方式）
 * @param {string} prompt 生成提示词
 * @param {number} width 图片宽度（默认1024）
 * @param {number} height 图片高度（默认1024）
 * @returns {string} 生成的图片本地路径
 */
async function generateImage(prompt, width = 1024, height = 1024) {
  try {
    const apiKey = process.env.ARK_API_KEY; // 方舟大模型专用API Key
    const endpoint = process.env.ARK_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3';

    const response = await axios.post(`${endpoint}/images/generations`, {
      model: process.env.MODEL_IMAGE || 'ep-20260313143451-x4jb4',
      prompt: prompt,
      width: width,
      height: height,
      n: 1,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // 下载图片到本地
    const imageUrl = response.data.data[0].url;
    const imageName = `seed-dream-${Date.now()}.png`;
    const imagePath = path.join(__dirname, 'output', imageName);
    
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(imagePath, imageResponse.data);

    console.log(`图片生成成功，保存路径：${imagePath}`);
    return imagePath;
  } catch (error) {
    console.error('图片生成失败：', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * 调用Seed Dance生成视频（使用火山方舟API）
 * @param {string} prompt 生成提示词
 * @param {string} imagePath 参考图片路径（可选，传null则纯文本生成）
 * @param {number} duration 视频时长（默认5秒，支持5/10/15秒）
 * @param {string} resolution 分辨率（默认720p，支持720p/1080p）
 * @returns {string} 生成的视频本地路径
 */
async function generateVideo(prompt, imagePath = null, duration = 5, resolution = '720p') {
  try {
    const apiKey = process.env.ARK_API_KEY;
    const endpoint = process.env.ARK_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3';
    const model = process.env.MODEL_VIDEO || 'ep-20260313144025-s75p5';

    // 构造请求参数
    const requestBody = {
      model: model,
      prompt: prompt,
      duration: duration,
      resolution: resolution,
    };

    // 如果提供了参考图片，转为base64
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      requestBody.image = `data:image/png;base64,${base64Image}`;
    }

    // 提交视频生成任务
    console.log('提交视频生成任务到火山方舟...');
    console.log('请求地址:', `${endpoint}/videos/generations`);
    console.log('使用模型:', model);
    
    const submitResponse = await axios.post(`${endpoint}/videos/generations`, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('提交响应:', submitResponse.data);
    const taskId = submitResponse.data.id;
    console.log(`任务提交成功，ID：${taskId}`);

    // 轮询任务状态
    let taskStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // 每10秒轮询一次
      const statusResponse = await axios.get(`${endpoint}/videos/generations/${taskId}`, {
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
  generateImage,
  generateVideo,
};
