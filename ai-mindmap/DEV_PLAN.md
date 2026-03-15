# AI 思维导图工具 MVP 开发计划

## 项目概述
开发一款AI驱动的思维导图工具，支持主题输入自动生成、拖拽编辑、多格式导出功能，2天完成MVP版本。

## 技术栈选型
### 后端
- Node.js + Express
- OpenAI API (用于生成思维导图内容)
- 内存存储 (MVP阶段)

### 前端
- React + TypeScript
- React Flow (思维导图渲染和拖拽编辑)
- Tailwind CSS (样式)
- Axios (API请求)
- FileSaver (文件导出)

## 功能模块
### 1. 后端接口
- POST /api/generate: 根据输入主题生成思维导图结构
- POST /api/export: 支持导出为PNG/PDF/Markdown/JSON格式

### 2. 前端页面
- 主题输入区域
- 思维导图编辑画布 (支持拖拽、节点编辑、连线调整)
- 导出功能按钮组
- 简洁美观的UI界面

## 项目结构
```
ai-mindmap/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   ├── generate.js
│   │   └── export.js
│   └── services/
│       ├── aiService.js
│       └── exportService.js
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── InputArea.tsx
│   │   │   ├── MindMapCanvas.tsx
│   │   │   └── ExportButtons.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.css
│   └── tailwind.config.js
└── README.md
```

## 开发时间线
### 第1天
- 上午: 项目初始化，后端接口开发
- 下午: 前端页面开发，基础功能联调

### 第2天
- 上午: 拖拽编辑功能实现，导出功能开发
- 下午: 功能测试，bug修复，部署上线准备

## 启动命令
```bash
# 后端启动
cd backend && npm install && npm start

# 前端启动
cd frontend && npm install && npm run dev
```
