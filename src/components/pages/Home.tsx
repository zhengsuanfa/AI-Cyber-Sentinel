import { motion } from 'motion/react';
import { Shield, Terminal, Code, Database, ChevronRight, Zap, Swords, GraduationCap, ArrowRight, ChevronDown } from 'lucide-react';
import { NeonButton } from '../NeonButton';
import { CyberThreatMap3D } from '../CyberThreatMap3D';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const { t, language } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate transformations based on scroll
  const titleOpacity = Math.max(0, 1 - scrollY / 500);
  const titleScale = Math.max(0.8, 1 - scrollY / 2000);
  const mapScale = 1 + scrollY / 2000;
  
  const features = [
    {
      icon: Code,
      title: t('feature.code.title'),
      description: t('feature.code.desc'),
    },
    {
      icon: Terminal,
      title: t('feature.terminal.title'),
      description: t('feature.terminal.desc'),
    },
    {
      icon: Database,
      title: t('feature.database.title'),
      description: t('feature.database.desc'),
    },
  ];

  return (
    <div className="relative">
      {/* Fixed Background - 3D Threat Map */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          transform: `scale(${mapScale})`,
          opacity: Math.max(0, 1 - scrollY / 800),
          transition: 'transform 0.1s ease-out',
        }}
      >
        <CyberThreatMap3D />
        <div className="absolute inset-0 bg-[#0A0A0A]/40" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Hero Landing - Title Over Map */}
        <section className="h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            className="text-center"
            style={{
              opacity: titleOpacity,
              transform: `scale(${titleScale}) translateY(${scrollY * 0.3}px)`,
            }}
          >
            {/* Logo/Icon */}
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative">
                <Shield className="w-32 h-32 text-[#00FF88] mx-auto" strokeWidth={1} />
                <motion.div
                  className="absolute -inset-4 border-2 border-[#00FF88]"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    boxShadow: '0 0 50px rgba(0, 255, 136, 0.6)',
                  }}
                />
                <motion.div
                  className="absolute -inset-6 border border-[#00D9FF]"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.9, 1.1, 0.9],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{
                    boxShadow: '0 0 40px rgba(0, 217, 255, 0.4)',
                  }}
                />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="font-mono text-6xl md:text-8xl mb-6 text-[#00FF88] tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                textShadow: '0 0 30px rgba(0, 255, 136, 0.6), 0 0 60px rgba(0, 255, 136, 0.3)',
              }}
            >
              AI CYBER SENTINEL
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="font-mono text-xl md:text-2xl text-[#00FF88]/80 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {language === 'zh' ? '网络安全可视化攻防体验平台' : 'CYBERSECURITY VISUALIZATION PLATFORM'}
            </motion.p>
            
            {/* Status Line */}
            <motion.div
              className="font-mono text-sm text-[#00FF88]/60 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                █
              </motion.span>
              {' '}
              {language === 'zh' ? '系统初始化完成 | 实时监控中...' : 'SYSTEM_INITIALIZED | REAL-TIME_MONITORING...'}
            </motion.div>

            {/* Decorative Lines */}
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="h-px w-20 bg-[#00FF88]/50" />
              <div className="w-2 h-2 border border-[#00FF88] rotate-45" />
              <div className="h-px w-20 bg-[#00FF88]/50" />
            </motion.div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center gap-2 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: titleOpacity }}
            onClick={() => {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }}
          >
            <span className="font-mono text-xs text-[#00FF88]/60 tracking-wider">
              {language === 'zh' ? '向下滚动探索' : 'SCROLL_DOWN'}
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-[#00FF88]" />
            </motion.div>
          </motion.div>
        </section>

        {/* Main Content - Solid Background */}
        <div className="relative bg-[#0A0A0A]">
          {/* Hero Section */}
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#00FF88]/20">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="inline-block mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative inline-block">
                    <Terminal className="w-20 h-20 text-[#00FF88] mx-auto" strokeWidth={1.5} />
                    <motion.div
                      className="absolute -inset-2 border border-[#00FF88]"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>

                <h1 className="font-mono text-5xl md:text-6xl mb-4 text-[#00FF88] tracking-wider">
                  {t('nav.title')}
                </h1>
                
                <p className="font-mono text-lg text-[#00FF88]/70 mb-2">
                  {t('home.subtitle')}
                </p>
                
                <motion.div
                  className="font-mono text-sm text-[#00FF88]/50 mb-8"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="terminal-cursor">█</span> {t('home.status')}
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4">
                  <NeonButton 
                    onClick={() => onNavigate('vulnerability')}
                    icon={Code}
                  >
                    {language === 'zh' ? '代码扫描' : 'CODE_SCAN'}
                  </NeonButton>
                  <NeonButton 
                    onClick={() => onNavigate('defense')}
                    icon={Swords}
                  >
                    {language === 'zh' ? '攻防模拟' : 'ATTACK_DEFENSE'}
                  </NeonButton>
                  <NeonButton 
                    onClick={() => onNavigate('learning')}
                    icon={GraduationCap}
                  >
                    {language === 'zh' ? '学习中心' : 'LEARNING_CENTER'}
                  </NeonButton>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Threat Map Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-[#00FF88]/20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="font-mono text-3xl mb-2 text-[#00FF88] tracking-wider">
                    {language === 'zh' ? '全球威胁地图' : 'GLOBAL_THREAT_MAP'}
                  </h2>
                  <div className="h-px bg-[#00FF88]/30 mb-4" />
                </div>
                <CyberThreatMap3D />
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#00FF88]/20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="font-mono text-3xl mb-2 text-[#00FF88] tracking-wider">
                  {t('home.section.modules')}
                </h2>
                <div className="h-px bg-[#00FF88]/30 mb-4" />
                <p className="font-mono text-sm text-[#00FF88]/60">
                  {language === 'zh' ? '核心功能模块 - 点击卡片探索' : 'CORE_MODULES - CLICK_TO_EXPLORE'}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Module 1 */}
                <motion.div
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 relative overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8,
                    borderColor: '#33FFB8',
                    boxShadow: '0 0 40px rgba(0, 255, 136, 0.7), inset 0 0 40px rgba(0, 255, 136, 0.15)',
                  }}
                  onClick={() => onNavigate('vulnerability')}
                >
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-15 transition-opacity" />
                  <div className="absolute top-4 right-4 font-mono text-6xl text-[#00FF88]/10 group-hover:text-[#00FF88]/25 transition-all">01</div>
                  
                  {/* Accent Corner */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#00FF88] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#00FF88] opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="w-16 h-16 border-2 border-[#00FF88] flex items-center justify-center group-hover:border-[#33FFB8] transition-colors" style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                        <Code className="w-8 h-8 text-[#00FF88]" />
                      </div>
                    </div>
                    
                    <h3 className="font-mono text-xl mb-3 text-[#00FF88] tracking-wider group-hover:text-[#33FFB8] transition-colors">
                      {language === 'zh' ? '代码漏洞分析' : 'CODE_VULNERABILITY_ANALYSIS'}
                    </h3>
                    
                    <p className="font-mono text-sm text-[#00FF88]/70 mb-6 leading-relaxed">
                      {language === 'zh' 
                        ? 'AI驱动的智能代码扫描，自动检测SQL注入、XSS等常见漏洞，并提供一键修复方案'
                        : 'AI-powered smart code scanning, automatically detect SQL injection, XSS and other common vulnerabilities'
                      }
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {[
                        language === 'zh' ? '智能漏洞检测' : 'Smart Detection',
                        language === 'zh' ? '自动修复建议' : 'Auto Fix Suggestions',
                        language === 'zh' ? '详细安全报告' : 'Detailed Reports',
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-mono text-xs text-[#00FF88]/60 group-hover:text-[#00FF88]/80 transition-colors">
                          <ChevronRight className="w-3 h-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 font-mono text-sm text-[#00FF88] group-hover:text-[#33FFB8] group-hover:gap-3 transition-all">
                      <span>{language === 'zh' ? '开始扫描' : 'START_SCAN'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>

                {/* Module 2 */}
                <motion.div
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 relative overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ 
                    y: -8,
                    borderColor: '#33FFB8',
                    boxShadow: '0 0 40px rgba(0, 255, 136, 0.7), inset 0 0 40px rgba(0, 255, 136, 0.15)',
                  }}
                  onClick={() => onNavigate('defense')}
                >
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-15 transition-opacity" />
                  <div className="absolute top-4 right-4 font-mono text-6xl text-[#00FF88]/10 group-hover:text-[#00FF88]/25 transition-all">02</div>
                  
                  {/* Accent Corner */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#00FF88] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#00FF88] opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="w-16 h-16 border-2 border-[#00FF88] flex items-center justify-center group-hover:border-[#33FFB8] transition-colors" style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                        <Swords className="w-8 h-8 text-[#00FF88]" />
                      </div>
                    </div>
                    
                    <h3 className="font-mono text-xl mb-3 text-[#00FF88] tracking-wider group-hover:text-[#33FFB8] transition-colors">
                      {language === 'zh' ? '攻防实战模拟' : 'ATTACK_DEFENSE_SIMULATION'}
                    </h3>
                    
                    <p className="font-mono text-sm text-[#00FF88]/70 mb-6 leading-relaxed">
                      {language === 'zh' 
                        ? '真实的双终端环境，体验Nmap、Sqlmap、Metasploit等工具，观察网络拓扑实时变化'
                        : 'Real dual-terminal environment, experience Nmap, Sqlmap, Metasploit and other tools'
                      }
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {[
                        language === 'zh' ? '双终端模拟' : 'Dual Terminals',
                        language === 'zh' ? '实时网络拓扑' : 'Live Topology',
                        language === 'zh' ? '真实工具命令' : 'Real Tool Commands',
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-mono text-xs text-[#00FF88]/60 group-hover:text-[#00FF88]/80 transition-colors">
                          <ChevronRight className="w-3 h-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 font-mono text-sm text-[#00FF88] group-hover:text-[#33FFB8] group-hover:gap-3 transition-all">
                      <span>{language === 'zh' ? '进入终端' : 'LAUNCH_TERMINAL'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>

                {/* Module 3 */}
                <motion.div
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 relative overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ 
                    y: -8,
                    borderColor: '#33FFB8',
                    boxShadow: '0 0 40px rgba(0, 255, 136, 0.7), inset 0 0 40px rgba(0, 255, 136, 0.15)',
                  }}
                  onClick={() => onNavigate('learning')}
                >
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-15 transition-opacity" />
                  <div className="absolute top-4 right-4 font-mono text-6xl text-[#00FF88]/10 group-hover:text-[#00FF88]/25 transition-all">03</div>
                  
                  {/* Accent Corner */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#00FF88] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#00FF88] opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className="w-16 h-16 border-2 border-[#00FF88] flex items-center justify-center group-hover:border-[#33FFB8] transition-colors" style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }}>
                        <GraduationCap className="w-8 h-8 text-[#00FF88]" />
                      </div>
                    </div>
                    
                    <h3 className="font-mono text-xl mb-3 text-[#00FF88] tracking-wider group-hover:text-[#33FFB8] transition-colors">
                      {language === 'zh' ? '黑客学习中心' : 'HACKER_LEARNING_CENTER'}
                    </h3>
                    
                    <p className="font-mono text-sm text-[#00FF88]/70 mb-6 leading-relaxed">
                      {language === 'zh' 
                        ? '从零基础到安全专家的完整学习路径，包含Kali Linux、渗透测试工具等实战教程'
                        : 'Complete learning path from beginner to security expert, including Kali Linux and penetration testing'
                      }
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {[
                        language === 'zh' ? '系统学习路径' : 'Systematic Roadmap',
                        language === 'zh' ? '命令速查手册' : 'Command Cheatsheet',
                        language === 'zh' ? '实战案例教学' : 'Practical Cases',
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 font-mono text-xs text-[#00FF88]/60 group-hover:text-[#00FF88]/80 transition-colors">
                          <ChevronRight className="w-3 h-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 font-mono text-sm text-[#00FF88] group-hover:text-[#33FFB8] group-hover:gap-3 transition-all">
                      <span>{language === 'zh' ? '开始学习' : 'START_LEARNING'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#00FF88]/20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="font-mono text-3xl mb-2 text-[#00FF88] tracking-wider">
                  {t('home.section.flow')}
                </h2>
                <div className="h-px bg-[#00FF88]/30 mb-4" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '[01]', title: t('process.step1'), desc: t('process.step1.desc') },
                  { step: '[02]', title: t('process.step2'), desc: t('process.step2.desc') },
                  { step: '[03]', title: t('process.step3'), desc: t('process.step3.desc') },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#0A0A0A] border border-[#00FF88] p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="font-mono text-4xl text-[#00FF88]/30 mb-4">{item.step}</div>
                    <h3 className="font-mono text-xl mb-3 text-[#00FF88] tracking-wider">{item.title}</h3>
                    <p className="font-mono text-sm text-[#00FF88]/60">{item.desc}</p>
                    <motion.div
                      className="mt-4 flex justify-center"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      <ChevronRight className="w-8 h-8 text-[#00FF88]" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Project Purpose */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="mb-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="font-mono text-3xl mb-4 text-[#00FF88] tracking-wider">
                  {t('purpose.title')}
                </h2>
                <div className="h-px bg-[#00FF88]/30 mb-6 max-w-2xl mx-auto" />
                <p className="font-mono text-lg text-[#00FF88]/70 max-w-4xl mx-auto leading-relaxed">
                  {t('purpose.intro')}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Purpose 1 */}
                <motion.div
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                  }}
                >
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#00FF88]/30" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#00FF88]/30" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 border-2 border-[#00FF88] flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}>
                        <span className="font-mono text-xl text-[#00FF88]">01</span>
                      </div>
                      <h3 className="font-mono text-xl text-[#00FF88] tracking-wider">
                        {t('purpose.module1.title')}
                      </h3>
                    </div>
                    
                    <p className="font-mono text-sm text-[#00FF88]/70 leading-relaxed">
                      {t('purpose.module1.desc')}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#00FF88]/30" />
                      <Code className="w-4 h-4 text-[#00FF88]/50" />
                      <div className="h-px flex-1 bg-[#00FF88]/30" />
                    </div>
                  </div>
                </motion.div>

                {/* Purpose 2 */}
                <motion.div
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                  }}
                >
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#00FF88]/30" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#00FF88]/30" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 border-2 border-[#00FF88] flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}>
                        <span className="font-mono text-xl text-[#00FF88]">02</span>
                      </div>
                      <h3 className="font-mono text-xl text-[#00FF88] tracking-wider">
                        {t('purpose.module2.title')}
                      </h3>
                    </div>
                    
                    <p className="font-mono text-sm text-[#00FF88]/70 leading-relaxed">
                      {t('purpose.module2.desc')}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#00FF88]/30" />
                      <Swords className="w-4 h-4 text-[#00FF88]/50" />
                      <div className="h-px flex-1 bg-[#00FF88]/30" />
                    </div>
                  </div>
                </motion.div>

                {/* Purpose 3 */}
                <motion.div
                  className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                  }}
                >
                  <div className="absolute inset-0 cyber-grid opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#00FF88]/30" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#00FF88]/30" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 border-2 border-[#00FF88] flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}>
                        <span className="font-mono text-xl text-[#00FF88]">03</span>
                      </div>
                      <h3 className="font-mono text-xl text-[#00FF88] tracking-wider">
                        {t('purpose.module3.title')}
                      </h3>
                    </div>
                    
                    <p className="font-mono text-sm text-[#00FF88]/70 leading-relaxed">
                      {t('purpose.module3.desc')}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#00FF88]/30" />
                      <GraduationCap className="w-4 h-4 text-[#00FF88]/50" />
                      <div className="h-px flex-1 bg-[#00FF88]/30" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer Note */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="inline-block px-6 py-3 border border-[#00FF88]/30 bg-[#0A0A0A]">
                  <p className="font-mono text-xs text-[#00FF88]/50">
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      █
                    </motion.span>
                    {' '}
                    {language === 'zh' 
                      ? '让网络安全知识不再遥不可及，让每个人都能成为安全守护者' 
                      : 'MAKING_CYBERSECURITY_ACCESSIBLE_TO_EVERYONE'}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}