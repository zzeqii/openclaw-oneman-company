require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 动态导入路由，避免OpenAI初始化错误
app.use('/api/generate', (req, res, next) => {
  require('./routes/generate_new')(req, res, next);
});
app.use('/api/export', (req, res, next) => {
  require('./routes/export')(req, res, next);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI MindMap API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
