// Vercel Serverless Function 适配器
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const scanRoutes = require('../backend/src/routes/scan');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保上传目录存在（在 /tmp 目录中，Vercel 只允许写入 /tmp）
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 路由
app.use('/api/scan', scanRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Cyber Sentinel Backend is running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

// 导出为 Vercel Serverless Function
module.exports = app;

