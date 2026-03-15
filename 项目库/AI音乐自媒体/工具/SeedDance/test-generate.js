const { generateVideo } = require('./ark-call');
const fs = require('fs');
const path = require('path');

// 测试用例
async function testGenerate() {
  try {
    console.log('测试Seed Dance视频生成...');
    const videoPath = await generateVideo(
      '紫色长发的可爱少女，穿着白色连衣裙，在纯白房间里慢慢挥手，表情温柔，真人质感，高清',
      '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/形象定稿/紫紫酱_学院风全身形象_v1.0.png',
      15, // 15秒
      '1080p'
    );
    console.log('测试成功，视频路径：', videoPath);
  } catch (error) {
    console.error('测试失败：', error.message);
  }
}

testGenerate();
