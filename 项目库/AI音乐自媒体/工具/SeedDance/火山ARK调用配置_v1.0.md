# 火山引擎ARK Code LATEST 调用Seed Dream/Dance 配置指南_v1.0
---
## 🔹 前期准备
### 1. 账号信息获取
登录火山引擎控制台获取以下信息：
- `accessKeyId`：访问密钥ID
- `accessKeySecret`：访问密钥Secret
- `region`：区域（默认：`cn-beijing`）
- `endpoint`：ARK服务端点（默认：`ark.cn-beijing.volces.com`）

### 2. 环境变量配置
在工作目录创建`.env`文件：
```env
VOLC_ACCESS_KEY_ID=你的accessKeyId
VOLC_ACCESS_KEY_SECRET=你的accessKeySecret
VOLC_REGION=cn-beijing
VOLC_ARK_ENDPOINT=ark.cn-beijing.volces.com
```
---
## 🔹 Seed Dream（文生图）调用配置
### 调用代码示例
```javascript
const { ArkClient } = require('@volcengine/ark');
const fs = require('fs');
const path = require('path');

// 初始化客户端
const client = new ArkClient({
  accessKeyId: process.env.VOLC_ACCESS_KEY_ID,
  accessKeySecret: process.env.VOLC_ACCESS_KEY_SECRET,
  region: process.env.VOLC_REGION,
  endpoint: process.env.VOLC_ARK_ENDPOINT,
});

/**
 * 调用Seed Dream生成图片
 * @param {string} prompt 生成提示词
 * @param {number} width 图片宽度（默认1024）
 * @param {number} height 图片高度（默认1024）
 * @param {number} steps 生成步数（默认50）
 * @param {number} cfgScale 文本相关性（默认7.5）
 * @returns {string} 生成的图片本地路径
 */
async function generateImage(prompt, width = 1024, height = 1024, steps = 50, cfgScale = 7.5) {
  try {
    const response = await client.createImage({
      model: 'seed-dream-v1.5',
      prompt: prompt,
      width: width,
      height: height,
      steps: steps,
      cfg_scale: cfgScale,
      num_images: 1,
    });

    // 下载图片到本地
    const imageUrl = response.data.images[0].url;
    const imageName = `seed-dream-${Date.now()}.png`;
    const imagePath = path.join(__dirname, 'output', imageName);
    
    // 确保output目录存在
    if (!fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'), { recursive: true });
    }

    // 下载并保存图片
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(arrayBuffer));

    console.log(`图片生成成功，保存路径：${imagePath}`);
    return imagePath;
  } catch (error) {
    console.error('图片生成失败：', error);
    throw error;
  }
}

// 调用示例
// generateImage('赛博朋克风格的未来城市，雨夜，霓虹灯', 1920, 1080)
//   .then(imagePath => console.log('生成完成：', imagePath))
//   .catch(err => console.error('生成失败：', err));
```
---
## 🔹 Seed Dance（文生视频/图生视频）调用配置
### 调用代码示例
```javascript
const { ArkClient } = require('@volcengine/ark');
const fs = require('fs');
const path = require('path');

// 初始化客户端（和Seed Dream共用）
const client = new ArkClient({
  accessKeyId: process.env.VOLC_ACCESS_KEY_ID,
  accessKeySecret: process.env.VOLC_ACCESS_KEY_SECRET,
  region: process.env.VOLC_REGION,
  endpoint: process.env.VOLC_ARK_ENDPOINT,
});

/**
 * 调用Seed Dance生成视频
 * @param {string} prompt 生成提示词
 * @param {string} imagePath 可选：输入图片路径（图生视频时使用）
 * @param {number} duration 视频时长（默认5秒，可选5/10/15）
 * @param {string} resolution 视频分辨率（默认"720p"，可选"720p"/"1080p"）
 * @returns {string} 生成的视频本地路径
 */
async function generateVideo(prompt, imagePath = null, duration = 5, resolution = "720p") {
  try {
    const params = {
      model: 'seed-dance-v1.0',
      prompt: prompt,
      duration: duration,
      resolution: resolution,
    };

    // 如果是图生视频，上传图片
    if (imagePath) {
      const imageBuffer = fs.readFileSync(imagePath);
      const uploadResponse = await client.uploadFile({
        file: imageBuffer,
        filename: path.basename(imagePath),
      });
      params.image_url = uploadResponse.data.url;
    }

    // 提交视频生成任务
    const taskResponse = await client.createVideoTask(params);
    const taskId = taskResponse.data.task_id;
    console.log(`视频生成任务已提交，任务ID：${taskId}`);

    // 轮询任务状态
    let taskStatus;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // 每10秒轮询一次
      taskStatus = await client.getVideoTask(taskId);
      console.log(`任务状态：${taskStatus.data.status}，进度：${taskStatus.data.progress}%`);
    } while (taskStatus.data.status !== 'success' && taskStatus.data.status !== 'failed');

    if (taskStatus.data.status === 'failed') {
      throw new Error(`视频生成失败：${taskStatus.data.error_message}`);
    }

    // 下载视频到本地
    const videoUrl = taskStatus.data.video_url;
    const videoName = `seed-dance-${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'output', videoName);
    
    // 确保output目录存在
    if (!fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'), { recursive: true });
    }

    // 下载并保存视频
    const videoResponse = await fetch(videoUrl);
    const arrayBuffer = await videoResponse.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

    console.log(`视频生成成功，保存路径：${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('视频生成失败：', error);
    throw error;
  }
}

// 文生视频调用示例
// generateVideo('一只会跳舞的熊猫，赛博朋克风格，背景是未来城市', 10, '1080p')
//   .then(videoPath => console.log('生成完成：', videoPath))
//   .catch(err => console.error('生成失败：', err));

// 图生视频调用示例
// generateVideo('让这张图片里的人物动起来', '/path/to/input/image.png', 5, '720p')
//   .then(videoPath => console.log('生成完成：', videoPath))
//   .catch(err => console.error('生成失败：', err));
```
---
## 🔹 集成到OpenClaw调用
### 1. 创建技能调用脚本
在`/Users/bytedance/.openclaw/workspace/skills/seed-dance/`下创建`call.js`：
```javascript
require('dotenv').config();
const { generateImage, generateVideo } = require('../../项目库/AI音乐自媒体/工具/SeedDance/ark-call.js');

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
      const imagePath = params[0] || null;
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
```

### 2. 配置技能元数据
创建`skill.json`：
```json
{
  "name": "seed-dance",
  "description": "调用火山引擎Seed Dream/Dance生成图片和视频",
  "parameters": {
    "type": "object",
    "required": ["type", "prompt"],
    "properties": {
      "type": {
        "type": "string",
        "enum": ["image", "video"],
        "description": "生成类型：图片或视频"
      },
      "prompt": {
        "type": "string",
        "description": "生成提示词"
      },
      "width": {
        "type": "number",
        "description": "图片宽度，默认1024"
      },
      "height": {
        "type": "number",
        "description": "图片高度，默认1024"
      },
      "imagePath": {
        "type": "string",
        "description": "图生视频时的输入图片路径"
      },
      "duration": {
        "type": "number",
        "enum": [5, 10, 15],
        "description": "视频时长，默认5秒"
      },
      "resolution": {
        "type": "string",
        "enum": ["720p", "1080p"],
        "description": "视频分辨率，默认720p"
      }
    }
  }
}
```
---
## 🔹 测试调用
### 生成图片
```bash
node /Users/bytedance/.openclaw/workspace/skills/seed-dance/call.js image "赛博朋克风格的未来城市，雨夜，霓虹灯" 1920 1080
```

### 生成视频
```bash
node /Users/bytedance/.openclaw/workspace/skills/seed-dance/call.js video "一只会跳舞的熊猫，赛博朋克风格，背景是未来城市" null 10 1080p
```
---
## 🔹 费用说明
- Seed Dream：约0.1元/张
- Seed Dance：约1元/5秒，2元/10秒，3元/15秒
生成的文件默认保存在`/项目库/AI音乐自媒体/工具/SeedDance/output/`目录下。