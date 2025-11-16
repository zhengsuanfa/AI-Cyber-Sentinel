const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const scanController = require('../controllers/scanController');

const router = express.Router();

// 配置 multer 文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.php', '.cpp', '.c', '.go', '.rb'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  console.log(`📄 文件: ${file.originalname}, 字段: ${file.fieldname}, 扩展名: ${ext}`);
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    // 跳过不支持的文件类型，而不是报错
    console.log(`⏭️  跳过不支持的文件: ${file.originalname}`);
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 限制
  }
});

// 路由
router.post('/upload', upload.single('file'), scanController.uploadAndScan);
router.post('/upload-folder', upload.array('files', 100), scanController.uploadFolderAndScan); // 支持最多100个文件
router.get('/result/:id', scanController.getResult);

module.exports = router;

