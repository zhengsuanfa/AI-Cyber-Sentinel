import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.scan': '扫描',
    'nav.terminal': '终端',
    'nav.docs': '文档',
    'nav.title': 'AI网络哨兵',
    
    // Home Page
    'home.subtitle': '> 基于终端的安全测试平台',
    'home.status': '系统就绪',
    'home.btn.launch': '启动终端',
    'home.btn.scan': '开始扫描',
    'home.section.modules': '> 系统模块',
    'home.section.flow': '> 执行流程',
    'home.section.init': '> 初始化安全协议',
    
    // Features
    'feature.code.title': '代码分析',
    'feature.code.desc': 'AI驱动的漏洞检测和自动补丁生成',
    'feature.terminal.title': '攻击模拟',
    'feature.terminal.desc': '隔离沙箱环境中的实时渗透测试',
    'feature.monitor.title': '威胁监控',
    'feature.monitor.desc': '实时网络流量分析和入侵检测系统',
    'feature.database.title': '漏洞数据库',
    'feature.database.desc': '全面的CVE跟踪和缓解文档',
    
    // Process
    'process.step1': '上传代码',
    'process.step1.desc': '提交目标源代码进行分析',
    'process.step2': 'AI扫描',
    'process.step2.desc': '自动漏洞检测引擎',
    'process.step3': '获取报告',
    'process.step3.desc': '接收详细的安全评估',
    
    // CTA
    'cta.title': '> 初始化安全协议',
    'cta.desc': '开始全面的安全测试和威胁分析',
    'cta.btn.start': '开始扫描',
    'cta.btn.docs': '查看文档',
    
    // Project Purpose
    'purpose.title': '> 项目初衷',
    'purpose.intro': '本项目旨在通过实战化、可视化的方式，帮助开发者和安全爱好者更好地理解网络安全',
    'purpose.module1.title': '漏洞检测与修复',
    'purpose.module1.desc': '本项目最实用的功能，可以自动检测AI生成的代码中存在的安全漏洞，并提供一键修复方案，帮助开发者快速构建安全可靠的应用程序。',
    'purpose.module2.title': '攻防实战体验',
    'purpose.module2.desc': '让想学习计算机知识的人通过基本的攻防命令体验黑客的感觉，在实践中理解Nmap、Sqlmap等工具的工作原理，培养安全意识。',
    'purpose.module3.title': '学习路径指引',
    'purpose.module3.desc': '为想成为安全专家或学习计算机的人提供系统化的学习路径，从基础知识到高级渗透测试，一步步构建完整的网络安全知识体系。',
    
    // Threat Map
    'threat.title': '> 全球威胁地图',
    'threat.live': '实时',
    'threat.desc': '实时网络威胁监控 | 3D可视化',
    'threat.ddos': 'DDOS攻击',
    'threat.malware': '恶意软件',
    'threat.sql': 'SQL注入',
    'threat.phishing': '钓鱼攻击',
    'threat.critical': '严重',
    'threat.high': '高危',
    'threat.medium': '中等',
    'threat.low': '低危',
    
    // Vulnerability Analysis
    'vuln.title': '> AI漏洞扫描系统',
    'vuln.subtitle': '上传代码 | AI分析 | 获取报告',
    'vuln.upload.title': '[上传]',
    'vuln.upload.drag': '拖拽文件到此处或点击上传',
    'vuln.upload.types': '支持: .py, .js, .java, .cpp, .php',
    'vuln.upload.btn': 'SELECT_FILE',
    'vuln.upload.scanning': '扫描中...',
    'vuln.result.title': '[扫描结果]',
    'vuln.result.status': '扫描状态',
    'vuln.result.complete': '完成',
    'vuln.result.found': '发现漏洞',
    'vuln.result.time': '扫描时间',
    'vuln.result.risk': '风险等级',
    'vuln.details.title': '[漏洞详情]',
    'vuln.details.type': '类型',
    'vuln.details.severity': '严重程度',
    'vuln.details.line': '行号',
    'vuln.details.desc': '描述',
    'vuln.details.fix': '修复建议',
    'vuln.new': 'NEW_SCAN',
    'vuln.export': 'EXPORT_REPORT',
    'vuln.hero.title': 'AI 自动漏洞扫描',
    'vuln.hero.desc': '上传你的代码，AI 将自动识别漏洞并给出修复建议',
    'vuln.uploading': '正在扫描代码...',
    'vuln.analyzing': 'AI 正在分析潜在的安全漏洞',
    'vuln.drag.title': 'Drag & Drop Code Folder / Click to Upload',
    'vuln.drag.types': '支持 .js, .py, .java, .php 等常见代码文件',
    'vuln.btn.upload': '上传代码文件',
    'vuln.detected': '检测到的漏洞',
    'vuln.count': '个漏洞',
    'vuln.location': '📄',
    'vuln.line.label': '第',
    'vuln.line.unit': '行',
    'vuln.fix.title': '修复建议',
    'vuln.fix.auto': 'Auto Fix with AI',
    'vuln.fix.before': '修复前',
    'vuln.fix.after': '修复后',
    'vuln.fix.explanation': '修复说明',
    'vuln.fix.sql.desc': '使用参数化查询可以有效防止 SQL 注入攻击。永远不要直接将用户输入拼接到 SQL 语句中，而是使用占位符（?）并将参数作为数组传递给数据库执行函数。',
    'vuln.notice': '💡 以上为模拟示例，AI 可使用预置规则库快速检测基础漏洞。',
    
    // Defense/Terminal
    'defense.title': '> 攻防演练终端',
    'defense.subtitle': '真实渗透测试环境 | 双终端模拟',
    'defense.topology': '[网络拓扑]',
    'defense.attacker': '[攻击者终端]',
    'defense.defender': '[防御者终端]',
    'defense.target': '目标服务器',
    'defense.firewall': '防火墙',
    'defense.database': '数据库',
    'defense.clear': 'CLEAR',
    'defense.help': 'HELP',
    'defense.hero.title': '网络攻防实战体验',
    'defense.hero.desc': '在真实的命令行终端中体验攻击与防御，观察网络拓扑的实时变化',
    'defense.network.monitor': '网络拓扑实时监控',
    'defense.network.attack': '检测到攻击',
    'defense.network.defense': '防御已激活',
    'defense.tip.title': '使用提示',
    'defense.tip.desc': '在下方的终端中输入命令，左侧是攻击终端（红色），右侧是防御终端（绿色）。执行命令时观察上方网络拓扑的变化。',
    'defense.tip.help': '输入',
    'defense.tip.help2': '查看可用命令',
    'defense.attack.terminal': '攻击终端',
    'defense.defense.terminal': '防御终端',
    'defense.attack.quick': '快速攻击命令',
    'defense.defense.quick': '快速防御命令',
    'defense.dashboard.title': '攻防对比仪表盘',
    'defense.attack.rate': '攻击成功率',
    'defense.defense.rate': '防御成功率',
    'defense.attack.vector': '攻击向量分析',
    'defense.input.placeholder.attack': '输入攻击命令...',
    'defense.input.placeholder.defense': '输入防御命令...',
    
    // Learning Center
    'learning.title': '> 网络安全学习中心',
    'learning.subtitle': '文档 | 教程 | 命令参考',
    'learning.roadmap': '[学习路线]',
    'learning.commands': '[命令速查表]',
    'learning.category': '分类',
    'learning.beginner': '初级',
    'learning.intermediate': '中级',
    'learning.advanced': '高级',
    'learning.expert': '专家',
    'learning.hero.title': '网络安全学习中心',
    'learning.hero.desc': '系统化学习网络安全知识，从基础到高级的完整学习路径',
    'learning.section.roadmap': '学习路线图',
    'learning.section.commands': '命令速查表',
    'learning.filter.all': '全部',
    'learning.time': '预计学习时间',
    'learning.description': '内容介绍',
    'learning.start': '开始学习',
  },
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.scan': 'SCAN',
    'nav.terminal': 'TERMINAL',
    'nav.docs': 'DOCS',
    'nav.title': 'AI_CYBER_SENTINEL',
    
    // Home Page
    'home.subtitle': '> TERMINAL-BASED SECURITY TESTING PLATFORM',
    'home.status': 'SYSTEM_READY',
    'home.btn.launch': 'LAUNCH_TERMINAL',
    'home.btn.scan': 'START_SCAN',
    'home.section.modules': '> SYSTEM_MODULES',
    'home.section.flow': '> EXECUTION_FLOW',
    'home.section.init': '> INITIALIZE_SECURITY_PROTOCOL',
    
    // Features
    'feature.code.title': 'CODE_ANALYSIS',
    'feature.code.desc': 'AI-powered vulnerability detection and automated patch generation',
    'feature.terminal.title': 'ATTACK_SIMULATION',
    'feature.terminal.desc': 'Real-time penetration testing in isolated sandbox environment',
    'feature.monitor.title': 'THREAT_MONITORING',
    'feature.monitor.desc': 'Live network traffic analysis and intrusion detection system',
    'feature.database.title': 'EXPLOIT_DATABASE',
    'feature.database.desc': 'Comprehensive CVE tracking and mitigation documentation',
    
    // Process
    'process.step1': 'UPLOAD_CODE',
    'process.step1.desc': 'Submit target source code for analysis',
    'process.step2': 'AI_SCAN',
    'process.step2.desc': 'Automated vulnerability detection engine',
    'process.step3': 'GET_REPORT',
    'process.step3.desc': 'Receive detailed security assessment',
    
    // CTA
    'cta.title': '> INITIALIZE_SECURITY_PROTOCOL',
    'cta.desc': 'Begin comprehensive security testing and threat analysis',
    'cta.btn.start': 'START_SCANNING',
    'cta.btn.docs': 'VIEW_DOCS',
    
    // Project Purpose
    'purpose.title': '> PROJECT_PURPOSE',
    'purpose.intro': 'This project aims to help developers and security enthusiasts better understand cybersecurity through practical and visual methods',
    'purpose.module1.title': 'Vulnerability Detection & Repair',
    'purpose.module1.desc': 'The most practical feature of this project can automatically detect security vulnerabilities in AI-generated code and provide one-click repair solutions to help developers quickly build secure and reliable applications.',
    'purpose.module2.title': 'Attack & Defense Experience',
    'purpose.module2.desc': 'Let those who want to learn computer knowledge experience the feeling of being a hacker through basic attack and defense commands, understand the working principles of tools like Nmap and Sqlmap in practice, and cultivate security awareness.',
    'purpose.module3.title': 'Learning Path Guidance',
    'purpose.module3.desc': 'Provide a systematic learning path for those who want to become security experts or learn computers, from basic knowledge to advanced penetration testing, step by step to build a complete cybersecurity knowledge system.',
    
    // Threat Map
    'threat.title': '> GLOBAL_THREAT_MAP',
    'threat.live': 'LIVE',
    'threat.desc': 'Real-time network threat monitoring | 3D visualization',
    'threat.ddos': 'DDOS_ATTACK',
    'threat.malware': 'MALWARE',
    'threat.sql': 'SQL_INJECTION',
    'threat.phishing': 'PHISHING',
    'threat.critical': 'CRITICAL',
    'threat.high': 'HIGH',
    'threat.medium': 'MEDIUM',
    'threat.low': 'LOW',
    
    // Vulnerability Analysis
    'vuln.title': '> AI_VULNERABILITY_SCANNER',
    'vuln.subtitle': 'Upload Code | AI Analysis | Get Report',
    'vuln.upload.title': '[UPLOAD]',
    'vuln.upload.drag': 'Drag & drop file here or click to upload',
    'vuln.upload.types': 'Supported: .py, .js, .java, .cpp, .php',
    'vuln.upload.btn': 'SELECT_FILE',
    'vuln.upload.scanning': 'SCANNING...',
    'vuln.result.title': '[SCAN_RESULTS]',
    'vuln.result.status': 'Scan Status',
    'vuln.result.complete': 'Complete',
    'vuln.result.found': 'Vulnerabilities Found',
    'vuln.result.time': 'Scan Time',
    'vuln.result.risk': 'Risk Level',
    'vuln.details.title': '[VULNERABILITY_DETAILS]',
    'vuln.details.type': 'Type',
    'vuln.details.severity': 'Severity',
    'vuln.details.line': 'Line',
    'vuln.details.desc': 'Description',
    'vuln.details.fix': 'Fix Suggestion',
    'vuln.new': 'NEW_SCAN',
    'vuln.export': 'EXPORT_REPORT',
    'vuln.hero.title': 'AI Automated Vulnerability Scanning',
    'vuln.hero.desc': 'Upload your code, AI will automatically identify vulnerabilities and provide fixes',
    'vuln.uploading': 'Scanning code...',
    'vuln.analyzing': 'AI is analyzing potential security vulnerabilities',
    'vuln.drag.title': 'Drag & Drop Code Folder / Click to Upload',
    'vuln.drag.types': 'Supported: .js, .py, .java, .php and more',
    'vuln.btn.upload': 'Upload Code File',
    'vuln.detected': 'Detected Vulnerabilities',
    'vuln.count': 'vulnerabilities',
    'vuln.location': '📄',
    'vuln.line.label': 'Line',
    'vuln.line.unit': '',
    'vuln.fix.title': 'Fix Suggestion',
    'vuln.fix.auto': 'Auto Fix with AI',
    'vuln.fix.before': 'Before Fix',
    'vuln.fix.after': 'After Fix',
    'vuln.fix.explanation': 'Fix Explanation',
    'vuln.fix.sql.desc': 'Using parameterized queries effectively prevents SQL injection attacks. Never directly concatenate user input into SQL statements. Instead, use placeholders (?) and pass parameters as an array to the database execution function.',
    'vuln.notice': '💡 The above is a simulated example. AI can quickly detect basic vulnerabilities using preset rule libraries.',
    
    // Defense/Terminal
    'defense.title': '> ATTACK_DEFENSE_TERMINAL',
    'defense.subtitle': 'Real Penetration Testing Environment | Dual Terminal Simulation',
    'defense.topology': '[NETWORK_TOPOLOGY]',
    'defense.attacker': '[ATTACKER_TERMINAL]',
    'defense.defender': '[DEFENDER_TERMINAL]',
    'defense.target': 'Target Server',
    'defense.firewall': 'Firewall',
    'defense.database': 'Database',
    'defense.clear': 'CLEAR',
    'defense.help': 'HELP',
    'defense.hero.title': 'Network Attack & Defense Experience',
    'defense.hero.desc': 'Experience attack and defense in real command-line terminals, observe real-time changes in network topology',
    'defense.network.monitor': 'Real-time Network Topology Monitoring',
    'defense.network.attack': 'Attack Detected',
    'defense.network.defense': 'Defense Activated',
    'defense.tip.title': 'Usage Tips',
    'defense.tip.desc': 'Enter commands in the terminals below, left is the attacker terminal (red), right is the defender terminal (green). Observe changes in the network topology above when executing commands.',
    'defense.tip.help': 'Enter',
    'defense.tip.help2': 'to view available commands',
    'defense.attack.terminal': 'Attacker Terminal',
    'defense.defense.terminal': 'Defender Terminal',
    'defense.attack.quick': 'Quick Attack Commands',
    'defense.defense.quick': 'Quick Defense Commands',
    'defense.dashboard.title': 'Attack & Defense Comparison Dashboard',
    'defense.attack.rate': 'Attack Success Rate',
    'defense.defense.rate': 'Defense Success Rate',
    'defense.attack.vector': 'Attack Vector Analysis',
    'defense.input.placeholder.attack': 'Enter attack command...',
    'defense.input.placeholder.defense': 'Enter defense command...',
    
    // Learning Center
    'learning.title': '> CYBER_SECURITY_LEARNING_CENTER',
    'learning.subtitle': 'Documentation | Tutorials | Command Reference',
    'learning.roadmap': '[LEARNING_ROADMAP]',
    'learning.commands': '[COMMAND_CHEATSHEET]',
    'learning.category': 'Category',
    'learning.beginner': 'Beginner',
    'learning.intermediate': 'Intermediate',
    'learning.advanced': 'Advanced',
    'learning.expert': 'Expert',
    'learning.hero.title': 'Cyber Security Learning Center',
    'learning.hero.desc': 'Systematic learning of cyber security knowledge, from basic to advanced complete learning path',
    'learning.section.roadmap': 'Learning Roadmap',
    'learning.section.commands': 'Command Cheat Sheet',
    'learning.filter.all': 'All',
    'learning.time': 'Estimated Learning Time',
    'learning.description': 'Content Description',
    'learning.start': 'Start Learning',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}