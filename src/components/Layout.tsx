import { Terminal, Home, Shield, BookOpen, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  
  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'vulnerability', label: t('nav.scan'), icon: Shield },
    { id: 'defense', label: t('nav.terminal'), icon: Terminal },
    { id: 'learning', label: t('nav.docs'), icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#00FF88]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate('home')}
            >
              <div className="relative">
                <Terminal className="w-6 h-6 text-[#00FF88]" strokeWidth={2} />
              </div>
              <span className="font-mono text-[#00FF88] tracking-wider uppercase">
                {t('nav.title')}
              </span>
            </motion.div>

            {/* Nav Items + Language Switcher */}
            <div className="flex items-center gap-0">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center gap-2 px-5 py-3 font-mono text-sm transition-all border-l border-[#00FF88] ${
                      isActive
                        ? 'bg-[#00FF88] text-[#0A0A0A]'
                        : 'text-[#00FF88] hover:bg-[#00FF88]/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      boxShadow: isActive ? '0 0 15px rgba(0, 255, 136, 0.5)' : 'none',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="tracking-wider">{item.label}</span>
                  </motion.button>
                );
              })}
              
              {/* Language Switch Button */}
              <motion.button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="relative flex items-center gap-2 px-5 py-3 font-mono text-sm transition-all border-l border-r border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={language === 'zh' ? 'Switch to English' : '切换到中文'}
              >
                <Languages className="w-4 h-4" />
                <span className="tracking-wider">{language === 'zh' ? 'EN' : '中'}</span>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Scan line effect */}
        <div className="relative h-px bg-[#00FF88]/20 overflow-hidden">
          <motion.div
            className="absolute h-full w-20 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"
            animate={{
              x: ['-100%', '1000%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}