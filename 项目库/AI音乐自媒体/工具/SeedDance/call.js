const { generateImage, generateVideo } = require('./ark-call.js');

// 接收命令行参数
const type = process.argv[2]; // image/video
const prompt = process.argv[3];
const params = process.argv.slice(4);

async function main() {
  try {
    if (type === 'image') {
      const width = params[0] ? parseInt(params[0]) : 1024;
      const height = params[1] ? parseInt(params[1]) : 1024;
      const path = await generateImage(prompt, width, height);
      console.log(`[SUCCESS] 图片生成成功：${path}`);
    } else if (type === 'video') {
      const imagePath = params[0] === 'null' ? null : params[0];
      const duration = params[1] ? parseInt(params[1]) : 5;
      const resolution = params[2] || '720p';
      const path = await generateVideo(prompt, imagePath, duration, resolution);
      console.log(`[SUCCESS] 视频生成成功：${path}`);
    } else {
      throw new Error('不支持的类型，支持image/video');
    }
  } catch (error) {
    console.error(`[ERROR] 生成失败：${error.message}`);
    process.exit(1);
  }
}

main();
