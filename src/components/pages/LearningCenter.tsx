import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  Target, 
  Award,
  Download,
  Terminal,
  ChevronRight,
  Clock,
  FileText
} from 'lucide-react';
import { NeonButton } from '../NeonButton';
import { useLanguage } from '../../contexts/LanguageContext';

const commands = [
  {
    category: 'Nmap（端口扫描）',
    categoryEn: 'Nmap (Port Scanning)',
    commands: [
      { 
        cmd: 'nmap -sV target.com', 
        desc: '扫描目标主机开放的端口和服务',
        descEn: 'Scan open ports and services on target host'
      },
      { 
        cmd: 'nmap -p- target.com', 
        desc: '扫描所有 65535 个端口',
        descEn: 'Scan all 65535 ports'
      },
    ],
  },
  {
    category: 'Sqlmap（SQL 注入测试）',
    categoryEn: 'Sqlmap (SQL Injection Testing)',
    commands: [
      { 
        cmd: 'sqlmap -u "http://target.com?id=1"', 
        desc: '自动检测 SQL 注入漏洞',
        descEn: 'Automatically detect SQL injection vulnerabilities'
      },
      { 
        cmd: 'sqlmap -u "url" --dbs', 
        desc: '列出所有数据库',
        descEn: 'List all databases'
      },
    ],
  },
  {
    category: 'Nikto（网站扫描）',
    categoryEn: 'Nikto (Website Scanning)',
    commands: [
      { 
        cmd: 'nikto -h http://target.com', 
        desc: '扫描网站漏洞和配置问题',
        descEn: 'Scan website vulnerabilities and configuration issues'
      },
    ],
  },
  {
    category: 'Linux 基础命令',
    categoryEn: 'Linux Basic Commands',
    commands: [
      { 
        cmd: 'ls -la', 
        desc: '列出目录下所有文件（包括隐藏文件）',
        descEn: 'List all files including hidden files'
      },
      { 
        cmd: 'grep "pattern" file.txt', 
        desc: '在文件中搜索匹配的文本',
        descEn: 'Search for matching text in file'
      },
      { 
        cmd: 'chmod 755 file.sh', 
        desc: '修改文件权限',
        descEn: 'Change file permissions'
      },
    ],
  },
];

export function LearningCenter() {
  const { t, language } = useLanguage();
  
  // Learning path data with translations
  const learningPath = [
    {
      level: language === 'zh' ? '初级' : 'BEGINNER',
      title: language === 'zh' ? '计算机基础 & 网络基础' : 'Computer & Network Basics',
      topics: [
        language === 'zh' ? 'OSI 七层模型' : 'OSI 7-Layer Model',
        language === 'zh' ? 'TCP/IP 协议' : 'TCP/IP Protocol',
        language === 'zh' ? 'HTTP/HTTPS' : 'HTTP/HTTPS',
        language === 'zh' ? 'DNS 原理' : 'DNS Principles'
      ],
      icon: BookOpen,
      time: language === 'zh' ? '4-6 周' : '4-6 Weeks',
      opacity: 40,
    },
    {
      level: language === 'zh' ? '中级' : 'INTERMEDIATE',
      title: language === 'zh' ? 'Web 安全 & 常见漏洞' : 'Web Security & Common Vulnerabilities',
      topics: [
        language === 'zh' ? 'SQL 注入' : 'SQL Injection',
        language === 'zh' ? 'XSS 攻击' : 'XSS Attack',
        language === 'zh' ? 'CSRF 攻击' : 'CSRF Attack',
        language === 'zh' ? 'SSRF 漏洞' : 'SSRF Vulnerability'
      ],
      icon: Target,
      time: language === 'zh' ? '6-8 周' : '6-8 Weeks',
      opacity: 60,
    },
    {
      level: language === 'zh' ? '高级' : 'ADVANCED',
      title: language === 'zh' ? '渗透测试工具 & 实际攻防' : 'Penetration Testing Tools & Real Attack/Defense',
      topics: [
        'Kali Linux',
        'Metasploit',
        'Burp Suite',
        'Wireshark'
      ],
      icon: Code,
      time: language === 'zh' ? '8-12 周' : '8-12 Weeks',
      opacity: 80,
    },
    {
      level: language === 'zh' ? '专家' : 'EXPERT',
      title: language === 'zh' ? '企业内网 & SOC & 安全自动化' : 'Enterprise Network & SOC & Security Automation',
      topics: [
        language === 'zh' ? '内网渗透' : 'Internal Network Penetration',
        language === 'zh' ? '红蓝对抗' : 'Red vs Blue',
        language === 'zh' ? 'SIEM 系统' : 'SIEM System',
        language === 'zh' ? '安全编排' : 'Security Orchestration'
      ],
      icon: Award,
      time: language === 'zh' ? '12+ 周' : '12+ Weeks',
      opacity: 100,
    },
  ];
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-20 bg-[#00FF88]/50" />
            <div className="w-2 h-2 border border-[#00FF88] rotate-45" />
            <div className="h-px w-20 bg-[#00FF88]/50" />
          </div>

          <h1 className="font-mono text-5xl md:text-6xl mb-4 text-[#00FF88] tracking-wider" style={{ textShadow: '0 0 30px rgba(0, 255, 136, 0.5)' }}>
            {language === 'zh' ? '> 黑客学习中心' : '> HACKER_LEARNING_CENTER'}
          </h1>
          <p className="font-mono text-xl text-[#00FF88]/70 mb-2">
            {language === 'zh' ? '从零基础到安全专家，系统化学习网络安全知识' : 'FROM_BEGINNER_TO_EXPERT | SYSTEMATIC_CYBERSECURITY_LEARNING'}
          </p>
          <motion.div
            className="font-mono text-sm text-[#00FF88]/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>█</span> {language === 'zh' ? '学习系统就绪' : 'LEARNING_SYSTEM_READY'}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Learning Path */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border-2 border-[#00FF88] flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}>
                <GraduationCap className="w-6 h-6 text-[#00FF88]" />
              </div>
              <h2 className="font-mono text-3xl text-[#00FF88] tracking-wider">
                {language === 'zh' ? '[学习路线图]' : '[LEARNING_ROADMAP]'}
              </h2>
            </div>

            {learningPath.map((stage, index) => {
              const Icon = stage.icon;
              
              return (
                <motion.div
                  key={index}
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-6 relative overflow-hidden group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -4,
                    borderColor: '#33FFB8',
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                  }}
                >
                  {/* Background Grid */}
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-10 transition-opacity" />
                  
                  {/* Corner Decorations */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#00FF88] opacity-30" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#00FF88] opacity-30" />
                  
                  {/* Large Stage Number */}
                  <div className="absolute top-4 right-4 font-mono text-6xl text-[#00FF88]/10 group-hover:text-[#00FF88]/20 transition-all">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 border-2 border-[#00FF88] flex items-center justify-center flex-shrink-0 group-hover:border-[#33FFB8] transition-colors" 
                      style={{ 
                        boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
                        opacity: stage.opacity / 100 
                      }}
                    >
                      <Icon className="w-8 h-8 text-[#00FF88]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className="px-3 py-1 border-2 border-[#00FF88] bg-[#00FF88]/10 text-[#00FF88] font-mono text-sm tracking-wider"
                          style={{ opacity: stage.opacity / 100 }}
                        >
                          {stage.level}
                        </span>
                        <h3 className="font-mono text-xl text-[#00FF88] group-hover:text-[#33FFB8] transition-colors">{stage.title}</h3>
                      </div>
                      
                      {/* Topics Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {stage.topics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 font-mono text-sm text-[#00FF88]/70">
                            <ChevronRight className="w-3 h-3 text-[#00FF88]" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>

                      {/* Time Estimate */}
                      <div className="flex items-center gap-2 font-mono text-xs text-[#00FF88]/50">
                        <Clock className="w-4 h-4" />
                        <span>{language === 'zh' ? '预计学习时间：' : 'Estimated Time: '}{stage.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 relative h-1 bg-[#00FF88]/10 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[#00FF88]"
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.opacity}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      style={{ 
                        boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                        opacity: stage.opacity / 100 
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Illustration & Actions */}
          <div className="space-y-6">
            {/* Illustration Card */}
            <motion.div
              className="bg-[#0A0A0A] border-2 border-[#00FF88] p-6 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="absolute inset-0 cyber-grid opacity-5" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center h-64 relative">
                  <motion.div
                    className="absolute inset-0"
                    animate={{ 
                      opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 cyber-grid" />
                  </motion.div>
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-32 h-32 mx-auto mb-4 border-4 border-[#00FF88]/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#00FF88]/5" />
                        <motion.div
                          className="absolute inset-0 border-2 border-[#00FF88]"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <GraduationCap className="w-16 h-16 text-[#00FF88] relative z-10" />
                      </div>
                    </motion.div>
                    <p className="font-mono text-sm text-[#00FF88]/70">
                      {language === 'zh' ? '开始你的安全之旅' : 'START_YOUR_JOURNEY'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              className="bg-[#0A0A0A] border-2 border-[#00FF88] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-mono text-lg text-[#00FF88] mb-4 tracking-wider">
                {language === 'zh' ? '[学习统计]' : '[LEARNING_STATS]'}
              </h3>
              <div className="space-y-3">
                {[
                  { label: language === 'zh' ? '课程模块' : 'Modules', value: '40+' },
                  { label: language === 'zh' ? '实战案例' : 'Cases', value: '100+' },
                  { label: language === 'zh' ? '命令工具' : 'Commands', value: '200+' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between font-mono text-sm">
                    <span className="text-[#00FF88]/70">{stat.label}:</span>
                    <span className="text-[#00FF88] tracking-wider">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NeonButton className="w-full" icon={BookOpen}>
                {language === 'zh' ? '开始学习' : 'START_LEARNING'}
              </NeonButton>
              <NeonButton className="w-full" variant="success" icon={Download}>
                {language === 'zh' ? '下载命令手册' : 'DOWNLOAD_CHEATSHEET'}
              </NeonButton>
            </motion.div>
          </div>
        </div>

        {/* Commands Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border-2 border-[#00FF88] flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}>
              <Terminal className="w-6 h-6 text-[#00FF88]" />
            </div>
            <h2 className="font-mono text-3xl text-[#00FF88] tracking-wider">
              {language === 'zh' ? '[常用命令速查]' : '[COMMAND_CHEATSHEET]'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {commands.map((section, index) => (
              <motion.div
                key={index}
                className="bg-[#0A0A0A] border-2 border-[#00FF88] p-6 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ 
                  boxShadow: '0 0 25px rgba(0, 255, 136, 0.4)',
                  borderColor: '#33FFB8',
                }}
              >
                <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#00FF88]/20" />
                
                <div className="relative z-10">
                  <h3 className="font-mono text-lg text-[#00FF88] mb-4 flex items-center gap-2 tracking-wider">
                    <Code className="w-5 h-5" />
                    {language === 'zh' ? section.category : section.categoryEn}
                  </h3>
                  
                  <div className="space-y-3">
                    {section.commands.map((item, i) => (
                      <div key={i} className="group/cmd">
                        <div className="bg-black/50 p-3 border border-[#00FF88]/30 hover:border-[#00FF88]/60 transition-all">
                          <code className="text-[#00FF88] text-sm font-mono block mb-1">
                            $ {item.cmd}
                          </code>
                          <p className="font-mono text-xs text-[#00FF88]/60">
                            {language === 'zh' ? item.desc : item.descEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 bg-[#0A0A0A] border-2 border-[#00FF88] p-8 text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="absolute inset-0 cyber-grid opacity-5" />
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-[#00FF88]/30" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-[#00FF88]/30" />
          
          <div className="relative z-10">
            <h3 className="font-mono text-2xl mb-4 text-[#00FF88] tracking-wider">
              {language === 'zh' ? '准备好开始学习了吗？' : 'READY_TO_START_LEARNING?'}
            </h3>
            <p className="font-mono text-sm text-[#00FF88]/70 mb-6">
              {language === 'zh' 
                ? '加入我们的学习社区，与成千上万的安全爱好者一起成长' 
                : 'JOIN_OUR_COMMUNITY_AND_GROW_WITH_THOUSANDS_OF_SECURITY_ENTHUSIASTS'}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <NeonButton icon={GraduationCap}>
                {language === 'zh' ? '立即开始' : 'START_NOW'}
              </NeonButton>
              <NeonButton variant="success" icon={FileText}>
                {language === 'zh' ? '获取学习资料' : 'GET_MATERIALS'}
              </NeonButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
