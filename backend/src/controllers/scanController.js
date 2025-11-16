const fs = require('fs');
const path = require('path');
const vulnerabilityScanner = require('../services/vulnerabilityScanner');

// 存储扫描结果（生产环境应使用数据库）
const scanResults = new Map();

/**
 * 上传文件并执行扫描
 */
exports.uploadAndScan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileExtension = path.extname(fileName).toLowerCase();

    console.log(`📂 收到文件: ${fileName}`);
    console.log(`📍 保存路径: ${filePath}`);

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // 执行扫描
    console.log(`🔍 开始扫描文件...`);
    const startTime = Date.now();
    
    const scanResult = await vulnerabilityScanner.scan(fileContent, fileExtension, fileName);
    
    const scanTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // 生成扫描 ID
    const scanId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // 保存结果
    const result = {
      id: scanId,
      fileName,
      fileSize: req.file.size,
      scanTime,
      timestamp: new Date().toISOString(),
      ...scanResult
    };

    scanResults.set(scanId, result);

    // 清理上传的文件
    fs.unlinkSync(filePath);

    console.log(`✅ 扫描完成! 发现 ${scanResult.vulnerabilities.length} 个漏洞`);

    res.json(result);

  } catch (error) {
    console.error('❌ 扫描错误:', error);
    
    // 清理文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: '扫描失败', 
      message: error.message 
    });
  }
};

/**
 * 上传文件夹并执行批量扫描
 */
exports.uploadFolderAndScan = async (req, res) => {
  try {
    console.log('📥 收到文件夹扫描请求');
    console.log('请求体字段:', Object.keys(req.body));
    console.log('文件字段:', req.files ? `${req.files.length} 个文件` : '无文件');
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: '没有上传支持的代码文件',
        message: '请确保文件夹中包含支持的代码文件（.js, .ts, .py, .java, .php, .cpp, .c, .go, .rb）'
      });
    }

    console.log(`📂 收到 ${req.files.length} 个文件`);

    const startTime = Date.now();
    const allVulnerabilities = [];
    const allAnalysisLogs = [];
    const fileResults = [];
    let totalSize = 0;

    // 扫描每个文件
    for (const file of req.files) {
      const filePath = file.path;
      const fileName = file.originalname;
      const fileExtension = path.extname(fileName).toLowerCase();

      totalSize += file.size;

      try {
        // 添加文件开始扫描的日志
        allAnalysisLogs.push({
          message: `开始扫描文件: ${fileName}`,
          type: 'info',
          timestamp: new Date().toISOString()
        });

        // 读取文件内容
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // 执行扫描
        const scanResult = await vulnerabilityScanner.scan(fileContent, fileExtension, fileName);

        // 收集分析日志
        if (scanResult.analysisLogs) {
          allAnalysisLogs.push(...scanResult.analysisLogs);
        }

        fileResults.push({
          fileName,
          fileSize: file.size,
          vulnerabilities: scanResult.vulnerabilities.length,
          riskLevel: scanResult.riskLevel
        });

        // 收集所有漏洞
        allVulnerabilities.push(...scanResult.vulnerabilities);

        // 清理文件
        fs.unlinkSync(filePath);

      } catch (error) {
        console.error(`❌ 扫描文件 ${fileName} 失败:`, error);
        // 继续扫描其他文件
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const scanTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // 计算整体风险等级
    const criticalCount = allVulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = allVulnerabilities.filter(v => v.severity === 'high').length;

    let overallRiskLevel = 'low';
    if (criticalCount > 0) {
      overallRiskLevel = 'critical';
    } else if (highCount > 0) {
      overallRiskLevel = 'high';
    } else if (allVulnerabilities.length > 0) {
      overallRiskLevel = 'medium';
    }

    // 生成扫描 ID
    const scanId = Date.now().toString(36) + Math.random().toString(36).substr(2);

    // 添加总结日志
    allAnalysisLogs.push({
      message: `批量扫描完成，共扫描 ${req.files.length} 个文件`,
      type: 'success',
      timestamp: new Date().toISOString()
    });

    // 保存结果
    const result = {
      id: scanId,
      type: 'folder',
      filesScanned: req.files.length,
      totalSize,
      scanTime,
      timestamp: new Date().toISOString(),
      vulnerabilities: allVulnerabilities,
      totalVulnerabilities: allVulnerabilities.length,
      riskLevel: overallRiskLevel,
      fileResults,
      analysisLogs: allAnalysisLogs,
      status: 'completed'
    };

    scanResults.set(scanId, result);

    console.log(`✅ 批量扫描完成! 扫描了 ${req.files.length} 个文件，发现 ${allVulnerabilities.length} 个漏洞`);

    res.json(result);

  } catch (error) {
    console.error('❌ 批量扫描错误:', error);

    // 清理所有上传的文件
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      error: '批量扫描失败',
      message: error.message
    });
  }
};

/**
 * 获取扫描结果
 */
exports.getResult = (req, res) => {
  const { id } = req.params;

  if (!scanResults.has(id)) {
    return res.status(404).json({ error: '未找到扫描结果' });
  }

  res.json(scanResults.get(id));
};

