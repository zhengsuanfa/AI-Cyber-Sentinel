// Vercel Serverless Function 适配器
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 设置环境变量，标记为 Vercel 环境
process.env.VERCEL = '1';
process.env.SCAN_MODE = process.env.SCAN_MODE || 'traditional';

const scanRoutes = require('../backend/src/routes/scan');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 确保上传目录存在（在 /tmp 目录中，Vercel 只允许写入 /tmp）
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 路由 - 移除 /api 前缀，因为 Vercel 会自动添加
app.use('/scan', scanRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Cyber Sentinel Backend is running on Vercel',
    timestamp: new Date().toISOString(),
    env: process.env.VERCEL ? 'vercel' : 'local'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Cyber Sentinel API',
    endpoints: ['/health', '/scan/upload', '/scan/upload-folder']
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 导出为 Vercel Serverless Function
module.exports = app;

