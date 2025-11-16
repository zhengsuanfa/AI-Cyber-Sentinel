/**
 * DeepSeek API 服务
 */

const axios = require('axios');
const config = require('../config/api.config');

class DeepSeekService {
  constructor() {
    this.apiKey = config.deepseek.apiKey;
    this.apiUrl = config.deepseek.apiUrl;
    this.model = config.deepseek.model;
    this.maxTokens = config.deepseek.maxTokens;
    this.temperature = config.deepseek.temperature;
  }

  /**
   * 调用 DeepSeek API 分析代码漏洞
   * @param {string} code - 要分析的代码
   * @param {string} language - 代码语言
   * @param {string} fileName - 文件名
   */
  async analyzeCodeVulnerabilities(code, language, fileName) {
    const prompt = this.buildSecurityAnalysisPrompt(code, language, fileName);

    try {
      console.log(`🤖 正在调用 DeepSeek API 分析 ${fileName}...`);

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的代码安全分析专家。你的任务是分析代码中的安全漏洞，包括但不限于：SQL注入、XSS、CSRF、不安全的加密、弱密码策略、IDOR、敏感信息泄露、代码注入等。请以JSON格式返回结果。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.maxTokens,
          temperature: this.temperature
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60秒超时
        }
      );

      console.log(`✅ DeepSeek API 调用成功`);
      
      return this.parseApiResponse(response.data, fileName);

    } catch (error) {
      console.error('❌ DeepSeek API 调用失败:', error.message);
      
      if (error.response) {
        console.error('API 错误响应:', error.response.data);
        throw new Error(`DeepSeek API 错误: ${error.response.data.error?.message || error.message}`);
      } else if (error.request) {
        throw new Error('无法连接到 DeepSeek API，请检查网络连接');
      } else {
        throw error;
      }
    }
  }

  /**
   * 构建安全分析提示词
   */
  buildSecurityAnalysisPrompt(code, language, fileName) {
    return `请分析以下${language}代码文件中的安全漏洞：

文件名: ${fileName}
语言: ${language}

代码:
\`\`\`${language}
${code}
\`\`\`

请仔细分析代码并识别所有可能的安全漏洞。对于每个漏洞，请提供：
1. 漏洞名称（中文）
2. 严重程度（critical/high/medium/low）
3. 漏洞所在的具体行号
4. 详细的漏洞描述
5. 修复建议
6. 存在漏洞的代码片段

请以以下JSON格式返回结果（只返回JSON，不要其他文字）：
{
  "vulnerabilities": [
    {
      "name": "漏洞名称",
      "severity": "critical|high|medium|low",
      "line": 行号(数字),
      "description": "详细描述",
      "recommendation": "修复建议",
      "codeSnippet": "存在问题的代码片段"
    }
  ]
}

如果没有发现漏洞，返回空数组：
{
  "vulnerabilities": []
}`;
  }

  /**
   * 解析 API 响应
   */
  parseApiResponse(apiResponse, fileName) {
    try {
      const content = apiResponse.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('API 返回内容为空');
      }

      // 尝试提取 JSON 内容
      let jsonContent = content.trim();
      
      // 如果内容被代码块包裹，提取出来
      const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }

      // 解析 JSON
      const result = JSON.parse(jsonContent);

      // 验证和格式化漏洞数据
      const vulnerabilities = (result.vulnerabilities || []).map((vuln, index) => ({
        id: `${Date.now()}-${index}`,
        name: vuln.name || '未知漏洞',
        severity: this.normalizeSeverity(vuln.severity),
        line: vuln.line || 0,
        location: fileName,
        description: vuln.description || '无描述',
        recommendation: vuln.recommendation || '请参考安全最佳实践',
        codeSnippet: vuln.codeSnippet || ''
      }));

      // 计算风险等级
      const riskLevel = this.calculateRiskLevel(vulnerabilities);

      return {
        vulnerabilities,
        totalVulnerabilities: vulnerabilities.length,
        riskLevel
      };

    } catch (error) {
      console.error('❌ 解析 API 响应失败:', error);
      console.log('原始响应:', apiResponse);
      
      // 返回默认结果而不是失败
      return {
        vulnerabilities: [],
        totalVulnerabilities: 0,
        riskLevel: 'low',
        parseError: error.message
      };
    }
  }

  /**
   * 标准化严重程度
   */
  normalizeSeverity(severity) {
    const normalized = (severity || 'low').toLowerCase();
    const validLevels = ['critical', 'high', 'medium', 'low'];
    return validLevels.includes(normalized) ? normalized : 'low';
  }

  /**
   * 计算整体风险等级
   */
  calculateRiskLevel(vulnerabilities) {
    if (vulnerabilities.length === 0) return 'low';

    const hasCritical = vulnerabilities.some(v => v.severity === 'critical');
    const hasHigh = vulnerabilities.some(v => v.severity === 'high');
    const hasMedium = vulnerabilities.some(v => v.severity === 'medium');

    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    return 'low';
  }
}

module.exports = new DeepSeekService();
