import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  Target, 
  Award,
  Download,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { NeonButton } from '../NeonButton';
import { useLanguage } from '../../contexts/LanguageContext';

const getLearningPath = (lang: 'zh' | 'en') => [
  {
    level: lang === 'zh' ? '初级' : 'Beginner',
    title: lang === 'zh' ? '计算机基础 & 网络基础' : 'Computer & Network Fundamentals',
    color: 'green',
    topics: lang === 'zh' 
      ? ['OSI 七层模型', 'TCP/IP 协议', 'HTTP/HTTPS', 'DNS 原理']
      : ['OSI 7-Layer Model', 'TCP/IP Protocol', 'HTTP/HTTPS', 'DNS Principles'],
    icon: BookOpen,
  },
  {
    level: lang === 'zh' ? '中级' : 'Intermediate',
    title: lang === 'zh' ? 'Web 安全 & 常见漏洞' : 'Web Security & Common Vulnerabilities',
    color: 'cyan',
    topics: lang === 'zh'
      ? ['SQL 注入', 'XSS 攻击', 'CSRF 攻击', 'SSRF 漏洞']
      : ['SQL Injection', 'XSS Attack', 'CSRF Attack', 'SSRF Vulnerability'],
    icon: Target,
  },
  {
    level: lang === 'zh' ? '高级' : 'Advanced',
    title: lang === 'zh' ? '渗透测试工具 & 实际攻防' : 'Penetration Testing Tools & Real Attack/Defense',
    color: 'orange',
    topics: ['Kali Linux', 'Metasploit', 'Burp Suite', 'Wireshark'],
    icon: Code,
  },
  {
    level: lang === 'zh' ? '专家' : 'Expert',
    title: lang === 'zh' ? '企业内网 & SOC & 安全自动化' : 'Enterprise Network & SOC & Security Automation',
    color: 'red',
    topics: lang === 'zh'
      ? ['内网渗透', '红蓝对抗', 'SIEM 系统', '安全编排']
      : ['Internal Penetration', 'Red/Blue Team', 'SIEM System', 'Security Orchestration'],
    icon: Award,
  },
];

const getCommands = (lang: 'zh' | 'en') => [
  {
    category: lang === 'zh' ? 'Nmap（端口扫描）' : 'Nmap (Port Scanning)',
    commands: [
      { 
        cmd: 'nmap -sV target.com', 
        desc: lang === 'zh' ? '扫描目标主机开放的端口和服务' : 'Scan open ports and services on target host'
      },
      { 
        cmd: 'nmap -p- target.com', 
        desc: lang === 'zh' ? '扫描所有 65535 个端口' : 'Scan all 65535 ports'
      },
    ],
  },
  {
    category: lang === 'zh' ? 'Sqlmap（SQL 注入测试）' : 'Sqlmap (SQL Injection Testing)',
    commands: [
      { 
        cmd: 'sqlmap -u "http://target.com?id=1"', 
        desc: lang === 'zh' ? '自动检测 SQL 注入漏洞' : 'Automatically detect SQL injection vulnerabilities'
      },
      { 
        cmd: 'sqlmap -u "url" --dbs', 
        desc: lang === 'zh' ? '列出所有数据库' : 'List all databases'
      },
    ],
  },
  {
    category: lang === 'zh' ? 'Nikto（网站扫描）' : 'Nikto (Website Scanning)',
    commands: [
      { 
        cmd: 'nikto -h http://target.com', 
        desc: lang === 'zh' ? '扫描网站漏洞和配置问题' : 'Scan website vulnerabilities and configuration issues'
      },
    ],
  },
  {
    category: lang === 'zh' ? 'Linux 基础命令' : 'Linux Basic Commands',
    commands: [
      { 
        cmd: 'ls -la', 
        desc: lang === 'zh' ? '列出目录下所有文件（包括隐藏文件）' : 'List all files including hidden files'
      },
      { 
        cmd: 'grep "pattern" file.txt', 
        desc: lang === 'zh' ? '在文件中搜索匹配的文本' : 'Search for matching text in file'
      },
      { 
        cmd: 'chmod 755 file.sh', 
        desc: lang === 'zh' ? '修改文件权限' : 'Modify file permissions'
      },
    ],
  },
];

const colorVariants: Record<string, { border: string; bg: string; text: string; shadow: string; glowColor: string }> = {
  green: { 
    border: 'border-[#00FF88]', 
    bg: 'bg-[#00FF88]/5', 
    text: 'text-[#00FF88]',
    shadow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
    glowColor: '#00FF88'
  },
  cyan: { 
    border: 'border-[#00f0ff]', 
    bg: 'bg-[#00f0ff]/5', 
    text: 'text-[#00f0ff]',
    shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    glowColor: '#00f0ff'
  },
  orange: { 
    border: 'border-[#ffa500]', 
    bg: 'bg-[#ffa500]/5', 
    text: 'text-[#ffa500]',
    shadow: 'shadow-[0_0_20px_rgba(255,165,0,0.3)]',
    glowColor: '#ffa500'
  },
  red: { 
    border: 'border-[#ff0055]', 
    bg: 'bg-[#ff0055]/5', 
    text: 'text-[#ff0055]',
    shadow: 'shadow-[0_0_20px_rgba(255,0,85,0.3)]',
    glowColor: '#ff0055'
  },
};

export function LearningCenter() {
  const { t, language } = useLanguage();
  const learningPath = getLearningPath(language);
  const commands = getCommands(language);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl mb-4 font-mono text-[#00FF88] tracking-wider">
            {t('learning.hero.title')}
          </h1>
          <p className="text-xl font-mono text-[#00FF88]/60">
            {t('learning.hero.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Learning Path */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-8 h-8 text-[#00FF88]" />
              <h2 className="text-3xl font-mono text-[#00FF88]">{t('learning.section.roadmap')}</h2>
            </div>

            {learningPath.map((stage, index) => {
              const Icon = stage.icon;
              const colors = colorVariants[stage.color];
              
              return (
                <motion.div
                  key={index}
                  className={`bg-[#0A0A0A] border-2 p-6 ${colors.border} hover:${colors.shadow} transition-all relative overflow-hidden`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    boxShadow: `0 0 15px rgba(${
                      stage.color === 'green' ? '0,255,136' :
                      stage.color === 'cyan' ? '0,240,255' :
                      stage.color === 'orange' ? '255,165,0' :
                      '255,0,85'
                    },0.1)`
                  }}
                >
                  {/* Top decorative line */}
                  <div className={`absolute top-0 left-0 right-0 h-px ${colors.bg}`} 
                       style={{ boxShadow: `0 0 10px ${colors.glowColor}` }} />
                  
                  {/* Left decorative line */}
                  <div className={`absolute top-0 left-0 bottom-0 w-px ${colors.bg}`}
                       style={{ boxShadow: `0 0 10px ${colors.glowColor}` }} />
                  
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${colors.bg} border-2 ${colors.border} flex items-center justify-center flex-shrink-0 relative`}
                         style={{ boxShadow: `0 0 20px ${colors.glowColor}40` }}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                      {/* Corner decorations */}
                      <div className={`absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 ${colors.border}`} />
                      <div className={`absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 ${colors.border}`} />
                      <div className={`absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 ${colors.border}`} />
                      <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 ${colors.border}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 text-sm border-2 ${colors.border} ${colors.bg} ${colors.text} font-mono tracking-wider`}
                              style={{ boxShadow: `0 0 10px ${colors.glowColor}30` }}>
                          [{stage.level.toUpperCase()}]
                        </span>
                        <h3 className={`text-xl font-mono ${colors.text}`}>{stage.title}</h3>
                      </div>
                      
                      {/* Topic grid with improved styling */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {stage.topics.map((topic, i) => (
                          <div key={i} className={`flex items-center gap-2 text-sm font-mono ${colors.text} opacity-80 group-hover:opacity-100 transition-opacity`}>
                            <ChevronRight className={`w-4 h-4 ${colors.text}`} />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stage Number - larger and more prominent */}
                    <div className={`text-6xl font-mono ${colors.text}`} 
                         style={{ 
                           opacity: 0.15,
                           textShadow: `0 0 20px ${colors.glowColor}50`
                         }}>
                      0{index + 1}
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="mt-4 relative h-3 bg-black border-2 border-[#00FF88]/20 overflow-hidden">
                    <motion.div
                      className={`absolute inset-0 ${colors.bg} border-r-2 ${colors.border}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(index + 1) * 25}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      style={{ boxShadow: `0 0 15px ${colors.glowColor}` }}
                    />
                    {/* Progress percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-mono text-xs ${colors.text} mix-blend-difference`}>
                        {(index + 1) * 25}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Bottom status bar */}
                  <div className="mt-3 flex items-center justify-between font-mono text-xs">
                    <span className={`${colors.text} opacity-60`}>
                      {language === 'zh' ? '状态:' : 'STATUS:'} <span className={colors.text}>AVAILABLE</span>
                    </span>
                    <span className="text-[#00FF88] opacity-60">
                      {language === 'zh' ? '模块:' : 'MODULES:'} {stage.topics.length}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Illustration & Commands */}
          <div className="space-y-6">
            {/* Illustration Card */}
            <motion.div
              className="bg-[#0A0A0A] border border-[#00FF88]/50 p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative">
                {/* Decorative Cyber Elements */}
                <div className="flex items-center justify-center h-64 relative">
                  <motion.div
                    className="absolute inset-0 cyber-grid opacity-30"
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-32 h-32 mx-auto mb-4 border-4 border-[#00FF88]/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#00FF88]/20 blur-xl" />
                        <GraduationCap className="w-16 h-16 text-[#00FF88] relative z-10" />
                      </div>
                    </motion.div>
                    <p className="font-mono text-[#00FF88]/60">
                      {language === 'zh' ? '开始你的安全之旅' : 'START YOUR SECURITY JOURNEY'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <NeonButton className="w-full" icon={BookOpen}>
                {t('learning.start')}
              </NeonButton>
              <NeonButton className="w-full" variant="success" icon={Download}>
                {language === 'zh' ? '下载命令手册' : 'DOWNLOAD_MANUAL'}
              </NeonButton>
            </motion.div>
          </div>
        </div>

        {/* Commands Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-8 h-8 text-[#00FF88]" />
            <h2 className="text-3xl font-mono text-[#00FF88]">{t('learning.section.commands')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {commands.map((section, index) => (
              <motion.div
                key={index}
                className="bg-[#0A0A0A] border-2 border-[#00FF88]/50 p-6 relative overflow-hidden hover:border-[#00FF88] transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                style={{ boxShadow: '0 0 15px rgba(0,255,136,0.1)' }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00FF88]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00FF88]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00FF88]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00FF88]" />
                
                <h3 className="font-mono text-[#00FF88] mb-4 flex items-center gap-2 tracking-wider">
                  <Code className="w-5 h-5" />
                  <span className="text-[#00f0ff]">&gt;</span> {section.category}
                </h3>
                
                <div className="space-y-3">
                  {section.commands.map((item, i) => (
                    <div key={i} className="group">
                      <div className="bg-black/70 p-3 border-l-4 border-[#00FF88]/30 hover:border-[#00FF88] transition-all hover:bg-black/90"
                           style={{ 
                             borderImage: 'linear-gradient(to bottom, #00FF88, transparent) 1',
                             boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                           }}>
                        <code className="text-[#00f0ff] text-sm font-mono block mb-1">
                          <span className="text-[#00FF88]">$</span> {item.cmd}
                        </code>
                        <p className="font-mono text-[#00FF88]/60 text-xs pl-3 border-l border-[#00FF88]/20">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center bg-[#0A0A0A] border border-[#00FF88] p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-mono text-[#00FF88] mb-4">
            {language === 'zh' ? '准备好开始学习了吗？' : 'READY_TO_START_LEARNING?'}
          </h3>
          <p className="font-mono text-[#00FF88]/60 mb-6">
            {language === 'zh' 
              ? '加入我们的学习社区，与成千上万的安全爱好者一起成长'
              : 'Join our learning community and grow with thousands of security enthusiasts'
            }
          </p>
          <div className="flex justify-center gap-4">
            <NeonButton icon={GraduationCap}>
              {language === 'zh' ? '立即开始' : 'START_NOW'}
            </NeonButton>
            <NeonButton variant="success" icon={Download}>
              {language === 'zh' ? '获取学习资料' : 'GET_MATERIALS'}
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}