import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Threat {
  id: number;
  from: { x: number; y: number; country: string };
  to: { x: number; y: number; country: string };
  type: 'critical' | 'high' | 'medium' | 'low';
  color: string;
}

interface ThreatStat {
  label: string;
  count: number;
  trend: 'up' | 'down';
  color: string;
}

// 全球主要城市的位置
const locations = [
  { x: 20, y: 35, country: 'NYC' },
  { x: 48, y: 28, country: 'LON' },
  { x: 58, y: 22, country: 'MOS' },
  { x: 72, y: 38, country: 'BEJ' },
  { x: 78, y: 42, country: 'TYO' },
  { x: 68, y: 52, country: 'SIN' },
  { x: 50, y: 45, country: 'FRA' },
  { x: 15, y: 58, country: 'SAO' },
  { x: 80, y: 65, country: 'SYD' },
  { x: 62, y: 42, country: 'DXB' },
];

const attackColors = {
  critical: '#FF3333',
  high: '#FF9933',
  medium: '#FFCC33',
  low: '#00FF88',
};

export function CyberThreatMap() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const { t } = useLanguage();
  const [threatStats, setThreatStats] = useState<ThreatStat[]>([
    { label: 'threat.ddos', count: 1247, trend: 'up', color: '#00FF88' },
    { label: 'threat.malware', count: 3891, trend: 'up', color: '#00FF88' },
    { label: 'threat.sql', count: 2156, trend: 'down', color: '#00FF88' },
    { label: 'threat.phishing', count: 5632, trend: 'up', color: '#00FF88' },
  ]);

  // 生成攻击路径
  useEffect(() => {
    const generateAttack = () => {
      const from = locations[Math.floor(Math.random() * locations.length)];
      let to = locations[Math.floor(Math.random() * locations.length)];
      
      while (to === from) {
        to = locations[Math.floor(Math.random() * locations.length)];
      }

      const types: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const newAttack: Threat = {
        id: Date.now() + Math.random(),
        from,
        to,
        type,
        color: attackColors[type],
      };

      setThreats(prev => [...prev.slice(-3), newAttack]);
    };

    for (let i = 0; i < 2; i++) {
      setTimeout(generateAttack, i * 1000);
    }

    const interval = setInterval(generateAttack, 4000);
    return () => clearInterval(interval);
  }, []);

  // 更新统计
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatStats(prev => prev.map(stat => ({
        ...stat,
        count: stat.count + Math.floor(Math.random() * 20) + 1,
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 自动旋转
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: (prev.x + 0.3) % 360,
        y: (prev.y + 0.2) % 360,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0A0A0A] border border-[#00FF88] p-6 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#00FF88]" />
            <h3 className="font-mono text-xl text-[#00FF88] tracking-wider">
              {t('threat.title')}
            </h3>
          </div>
          <motion.div
            className="flex items-center gap-2 bg-[#0A0A0A] border border-[#FF3333] px-3 py-1"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-[#FF3333]" />
            <span className="font-mono text-xs text-[#FF3333]">{t('threat.live')}</span>
          </motion.div>
        </div>
        <div className="h-px bg-[#00FF88]/30 mb-2" />
        <p className="font-mono text-xs text-[#00FF88]/60">
          {t('threat.desc')}
        </p>
      </div>

      {/* 3D Globe Container */}
      <div className="relative z-10 mb-8">
        <div className="relative w-full max-w-3xl mx-auto" style={{ height: '500px' }}>
          {/* 3D Globe using CSS transforms */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              className="relative"
              style={{
                width: '400px',
                height: '400px',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateY: rotation.x,
                rotateX: rotation.y,
              }}
              transition={{ duration: 0, ease: 'linear' }}
            >
              {/* Earth Sphere - multiple rings to create sphere effect */}
              <div className="absolute inset-0">
                {/* Main globe body */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(0, 255, 136, 0.15), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95))',
                    border: '2px solid rgba(0, 255, 136, 0.4)',
                    boxShadow: `
                      0 0 40px rgba(0, 255, 136, 0.3),
                      inset 0 0 60px rgba(0, 0, 0, 0.8),
                      inset 20px 20px 40px rgba(0, 255, 136, 0.1)
                    `,
                  }}
                />

                {/* Latitude lines */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const y = i * 12.5;
                  const scale = Math.abs(50 - y) / 50;
                  return (
                    <div
                      key={`lat-${i}`}
                      className="absolute left-1/2 border border-[#00FF88]/30"
                      style={{
                        top: `${y}%`,
                        width: `${scale * 100}%`,
                        height: '1px',
                        transform: `translateX(-50%) rotateX(${(i - 4) * 20}deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    />
                  );
                })}

                {/* Longitude lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`lon-${i}`}
                    className="absolute inset-0 rounded-full border border-[#00FF88]/30"
                    style={{
                      transform: `rotateY(${i * 30}deg) rotateX(90deg)`,
                      transformStyle: 'preserve-3d',
                    }}
                  />
                ))}

                {/* Equator - highlighted */}
                <div
                  className="absolute left-1/2 top-1/2 border-2 border-[#00FF88]/50"
                  style={{
                    width: '100%',
                    height: '1px',
                    transform: 'translate(-50%, -50%)',
                  }}
                />

                {/* Location Nodes */}
                {locations.map((loc, index) => {
                  const adjustedX = loc.x + (rotation.x * 0.5) % 100;
                  const isVisible = adjustedX > 10 && adjustedX < 90;
                  const zIndex = Math.round(50 + Math.sin((adjustedX * Math.PI) / 100) * 50);
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${adjustedX}%`,
                        top: `${loc.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex,
                        opacity: isVisible ? 1 : 0.2,
                      }}
                      animate={{ 
                        scale: isVisible ? [1, 1.4, 1] : [0.6, 0.8, 0.6],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      <div className="relative group">
                        <div 
                          className="w-2 h-2 bg-[#00FF88]"
                          style={{
                            boxShadow: '0 0 8px rgba(0, 255, 136, 0.8), 0 0 15px rgba(0, 255, 136, 0.4)',
                          }}
                        />
                        {/* Pulse rings */}
                        <motion.div
                          className="absolute inset-0 border border-[#00FF88]"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 3, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        />
                        
                        {/* Label */}
                        {isVisible && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-[#0A0A0A] border border-[#00FF88]/50 px-2 py-1">
                              <span className="font-mono text-xs text-[#00FF88]">{loc.country}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Attack Paths Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <defs>
                {threats.map((attack) => (
                  <linearGradient key={`gradient-${attack.id}`} id={`gradient-${attack.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={attack.color} stopOpacity="0" />
                    <stop offset="50%" stopColor={attack.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={attack.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              
              <AnimatePresence>
                {threats.map((attack) => {
                  const centerX = typeof window !== 'undefined' && window.innerWidth > 768 ? 600 : 300;
                  const centerY = 250;
                  
                  const fromX = centerX + (attack.from.x - 50) * 4.5;
                  const fromY = centerY + (attack.from.y - 50) * 3;
                  const toX = centerX + (attack.to.x - 50) * 4.5;
                  const toY = centerY + (attack.to.y - 50) * 3;

                  const controlY = Math.min(fromY, toY) - 80;
                  const path = `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${controlY} ${toX} ${toY}`;

                  return (
                    <g key={attack.id}>
                      <motion.path
                        d={path}
                        fill="none"
                        stroke={`url(#gradient-${attack.id})`}
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                      />
                      
                      <motion.circle
                        r="4"
                        fill={attack.color}
                        filter={`drop-shadow(0 0 6px ${attack.color})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: 'easeInOut' }}
                      >
                        <animateMotion dur="3s" repeatCount="1" path={path} />
                      </motion.circle>
                    </g>
                  );
                })}
              </AnimatePresence>
            </svg>
          </div>

          {/* Alert notifications */}
          <AnimatePresence>
            {threats.slice(-2).map((attack, index) => (
              <motion.div
                key={attack.id}
                className="absolute left-4 bg-[#0A0A0A] border border-[#00FF88] px-4 py-3 max-w-xs"
                style={{ 
                  top: `${20 + index * 85}px`,
                  boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                }}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#FF3333] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#00FF88] uppercase">{attack.type}</span>
                      <div 
                        className="w-1.5 h-1.5"
                        style={{ backgroundColor: attack.color }}
                      />
                    </div>
                    <p className="font-mono text-xs text-[#00FF88]/70">
                      {attack.from.country} → {attack.to.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Threat Statistics */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {threatStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-[#0A0A0A] border border-[#00FF88] p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#00FF88]/60">{t(stat.label)}</span>
              <motion.span
                className={`font-mono text-xs ${stat.trend === 'up' ? 'text-[#FF3333]' : 'text-[#00FF88]'}`}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {stat.trend === 'up' ? '▲' : '▼'}
              </motion.span>
            </div>
            <motion.div
              className="font-mono text-2xl"
              style={{ color: stat.color }}
              key={stat.count}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {stat.count.toLocaleString()}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 font-mono text-xs text-[#00FF88]/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF3333]" style={{ boxShadow: '0 0 6px #FF3333' }} />
          <span>{t('threat.critical')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF9933]" style={{ boxShadow: '0 0 6px #FF9933' }} />
          <span>{t('threat.high')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FFCC33]" style={{ boxShadow: '0 0 6px #FFCC33' }} />
          <span>{t('threat.medium')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00FF88]" style={{ boxShadow: '0 0 6px #00FF88' }} />
          <span>{t('threat.low')}</span>
        </div>
      </div>
    </div>
  );
}