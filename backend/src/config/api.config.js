/**
 * API 配置文件
 */

module.exports = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-a930c5db9b9249adb8562345a5b9ccc0',
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-reasoner', // DeepSeek-R1 模型
    maxTokens: 8000,
    temperature: 0.1 // 较低的温度以获得更一致的结果
  },
  
  server: {
    port: process.env.PORT || 3001
  }
};

