require('dotenv').config({ path: '/Users/bytedance/.openclaw/workspace/.env' });
const { ARKClient } = require('@volcengine/ark');
const fs = require('fs');
const path = require('path');

// 初始化客户端
const client = new ARKClient({
  accessKeyId: process.env.VOLC_ACCESS_KEY_ID,
  accessKeySecret: process.env.VOLC_ACCESS_KEY_SECRET,
  region: process.env.VOLC_REGION || 'cn-beijing',
  endpoint: process.env.VOLC_ARK_ENDPOINT || 'ark.cn-beijing.volces.com',
});

// 确保output目录存在
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * 调用Seed Dance生成视频（官方SDK版本）
 * @param {string} prompt 生成提示词
 * @param {string} imagePath 参考图片路径（可选，图生视频时使用）
 * @param {number} duration 视频时长（默认5秒，支持5/10/15秒）
 * @param {string} resolution 分辨率（默认720p，支持720p/1080p）
 * @returns {string} 生成的视频本地路径
 */
async function generateVideo(prompt, imagePath = null, duration = 5, resolution = '720p') {
  try {
    const params = {
      model: 'seed-dance-v1.0',
      prompt: prompt,
      duration: duration,
      resolution: resolution,
    };

    // 如果提供了参考图片，先上传
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      const uploadResponse = await client.uploadFile({
        file: imageBuffer,
        filename: path.basename(imagePath),
      });
      params.image_url = uploadResponse.data.url;
      console.log('参考图片上传成功，URL：', params.image_url);
    }

    // 提交视频生成任务
    console.log('提交视频生成任务到火山方舟...');
    const taskResponse = await client.createVideoTask(params);
    const taskId = taskResponse.data.task_id;
    console.log(`任务提交成功，ID：${taskId}`);

    // 轮询任务状态
    let taskStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // 每10秒轮询一次
      taskStatus = await client.getVideoTask(taskId);
      console.log(`任务状态：${taskStatus.data.status}，进度：${taskStatus.data.progress || 0}%`);
    } while (taskStatus.data.status !== 'success' && taskStatus.data.status !== 'failed');

    if (taskStatus.data.status === 'failed') {
      throw new Error(`视频生成失败：${taskStatus.data.error_message || '未知错误'}`);
    }

    // 下载视频到本地
    const videoUrl = taskStatus.data.video_url;
    const videoName = `seed-dance-${Date.now()}.mp4`;
    const videoPath = path.join(outputDir, videoName);
    
    console.log('下载视频中...');
    const videoResponse = await fetch(videoUrl);
    const arrayBuffer = await videoResponse.arrayBuffer();
    fs.writeFileSync(videoPath, Buffer.from(arrayBuffer));

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
