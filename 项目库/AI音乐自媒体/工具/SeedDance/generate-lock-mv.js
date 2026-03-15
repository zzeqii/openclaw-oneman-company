const { generateVideo } = require('./ark-call-seedance');
const fs = require('fs');
const path = require('path');

// 配置参数
const CONFIG = {
  参考形象路径: '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/形象定稿/紫紫酱_学院风全身形象_v1.0.png',
  视频时长: 15, // 15秒
  输出目录: '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/MV/',
  BGM路径: '/Users/bytedance/.openclaw/workspace/项目库/AI音乐自媒体/BGM/《锁》.mp3', // 待补充
};

// 15秒手势舞MV提示词（适配《锁》BPM 85节奏，副歌部分）
const 生成提示词 = `
紫紫酱，紫色齐腰长发，渐变发尾，紫色瞳孔，齐刘海，白色露肩连衣裙，紫色丝带装饰，白色长筒袜，紫色小皮鞋，真人质感，皮肤细腻，光影自然，
在纯白封闭房间中跳手势舞，背景悬浮银色大锁，墙面有老旧照片，
动作适配《锁》BGM节奏（BPM 85），副歌部分动作：
0-3s：双手比出锁的形状在胸前，缓慢晃动，表情略带忧伤
3-7s：双手做出拉扯锁的动作，身体微微前倾，表情坚定
7-11s：双手用力挥出，做出打碎锁的动作，身体向后舒展
11-15s：双手张开做出拥抱自由的动作，脸上露出释然的笑容
动作流畅自然，符合手势舞节奏，真人实拍质感，4K高清，1080p分辨率，16:9，30fps，无水印
`;

// 确保输出目录存在
if (!fs.existsSync(CONFIG.输出目录)) {
  fs.mkdirSync(CONFIG.输出目录, { recursive: true });
}

// 生成视频
async function main() {
  try {
    console.log('开始生成《锁》15秒手势舞MV...');
    console.log('使用参考形象：', CONFIG.参考形象路径);
    
    const 视频路径 = await generateVideo(
      生成提示词,
      CONFIG.参考形象路径,
      CONFIG.视频时长,
      false, // 不加水印
      true // 固定镜头
    );

    // 移动到目标目录
    const 目标文件名 = `《锁》_15秒手势舞MV_${Date.now()}.mp4`;
    const 目标路径 = path.join(CONFIG.输出目录, 目标文件名);
    fs.renameSync(视频路径, 目标路径);

    console.log('========================================');
    console.log('✅ MV生成成功！');
    console.log('保存路径：', 目标路径);
    console.log('时长：15秒');
    console.log('适配BGM：《锁》（BPM 85）副歌部分');
    console.log('形象：紫紫酱官方形象，真人质感');
    console.log('========================================');

  } catch (error) {
    console.error('❌ MV生成失败：', error.message);
    process.exit(1);
  }
}

main();
