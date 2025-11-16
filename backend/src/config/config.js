/**
 * 配置文件
 */

module.exports = {
  // DeepSeek API 配置
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-a930c5db9b9249adb8562345a5b9ccc0',
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-reasoner', // DeepSeek-R1 模型
    maxTokens: 4000,
    temperature: 0.1 // 较低的温度以获得更稳定的结果
  },

  // 服务器配置
  server: {
    port: process.env.PORT || 3001
  },

  // 扫描配置
  scan: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 100,
    supportedExtensions: ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.php', '.cpp', '.c', '.go', '.rb']
  }
};

