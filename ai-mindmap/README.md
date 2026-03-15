# AI 思维导图工具

一款AI驱动的思维导图工具，支持主题输入自动生成、拖拽编辑、多格式导出功能。

## 功能特性

- 🤖 **AI自动生成**: 输入主题即可自动生成结构化思维导图
- 🎨 **拖拽编辑**: 支持节点拖拽、内容编辑、连线自定义
- 📤 **多格式导出**: 支持导出为PNG、PDF、Markdown、JSON格式
- 🎯 **美观界面**: 基于React Flow的现代化交互界面
- ⚡ **快速响应**: 本地Mock数据可无需API密钥快速体验

## 技术栈

### 后端
- Node.js + Express
- OpenAI API 集成
- Puppeteer (图片导出)
- Markdown-PDF (PDF导出)

### 前端
- React 18 + TypeScript
- React Flow (思维导图渲染)
- Tailwind CSS
- Vite (构建工具)

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm 或 yarn

### 后端启动

1. 进入后端目录
```bash
cd backend
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 OpenAI API Key
```

4. 启动服务
```bash
npm start
# 或开发模式
npm run dev
```

后端服务将运行在 `http://localhost:3001`

### 前端启动

1. 进入前端目录
```bash
cd frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

前端页面将运行在 `http://localhost:3000`

### 快速体验 (无需API密钥)

系统默认使用Mock数据，无需配置OpenAI API即可体验完整功能。如果需要真实AI生成，在`.env`中配置API密钥即可。

## 使用说明

1. **生成思维导图**: 在顶部输入框中输入主题，点击"生成思维导图"按钮
2. **编辑思维导图**: 
   - 拖拽节点调整位置
   - 双击节点编辑内容
   - 从节点边缘拖拽创建新的连接
3. **导出**: 点击底部的导出按钮，选择需要的格式进行导出

## 项目结构

```
ai-mindmap/
├── backend/                 # 后端服务
│   ├── server.js           # 服务入口
│   ├── routes/             # API路由
│   │   ├── generate.js     # 生成接口
│   │   └── export.js       # 导出接口
│   ├── services/           # 业务逻辑
│   │   ├── aiService.js    # AI服务
│   │   └── exportService.js # 导出服务
│   ├── package.json
│   └── .env.example        # 环境变量示例
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   │   ├── InputArea.tsx      # 输入区域
│   │   │   ├── MindMapCanvas.tsx  # 思维导图画布
│   │   │   └── ExportButtons.tsx  # 导出按钮
│   │   ├── services/       # API服务
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript类型定义
│   │   │   └── index.ts
│   │   ├── App.tsx         # 主应用组件
│   │   └── main.tsx        # 入口文件
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── DEV_PLAN.md             # 开发计划
└── README.md               # 项目说明
```

## API 接口

### 生成思维导图
```
POST /api/generate
Content-Type: application/json

{
  "topic": "主题内容",
  "useMock": true // 是否使用模拟数据
}
```

### 导出思维导图
```
POST /api/export
Content-Type: application/json

{
  "format": "png|pdf|markdown|json",
  "nodes": [], // 节点数据
  "edges": [], // 连线数据
  "svg": ""    // SVG内容(PNG导出时需要)
}
```

## 开发计划

- [x] 项目初始化和架构搭建
- [x] 后端API接口开发
- [x] 前端页面开发
- [x] 拖拽编辑功能实现
- [x] 多格式导出功能
- [x] Mock数据支持
- [ ] 节点样式自定义
- [ ] 云端存储功能
- [ ] 协作编辑功能
- [ ] 更多AI模型支持

## 许可证

MIT License
