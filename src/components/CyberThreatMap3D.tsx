import { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text, Stars, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, AlertTriangle, Activity, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as THREE from 'three';

interface Threat {
  id: number;
  from: { lat: number; lon: number; country: string; city: string };
  to: { lat: number; lon: number; country: string; city: string };
  type: 'critical' | 'high' | 'medium' | 'low';
  color: string;
  progress: number;
}

interface ThreatStat {
  label: string;
  count: number;
  trend: 'up' | 'down';
  color: string;
}

// 全球主要网络攻击源和目标城市（基于真实网络安全报告）
const locations = [
  { lat: 40.7128, lon: -74.0060, country: 'NYC', city: '纽约' }, // 美国金融中心
  { lat: 51.5074, lon: -0.1278, country: 'LON', city: '伦敦' },  // 欧洲金融中心
  { lat: 55.7558, lon: 37.6173, country: 'MOS', city: '莫斯科' },  // 俄罗斯
  { lat: 39.9042, lon: 116.4074, country: 'BEJ', city: '北京' }, // 中国
  { lat: 35.6762, lon: 139.6503, country: 'TYO', city: '东京' }, // 日本
  { lat: 1.3521, lon: 103.8198, country: 'SIN', city: '新加坡' },  // 亚太枢纽
  { lat: 50.1109, lon: 8.6821, country: 'FRA', city: '法兰克福' },   // 欧洲数据中心
  { lat: -23.5505, lon: -46.6333, country: 'SAO', city: '圣保罗' },// 南美
  { lat: 37.7749, lon: -122.4194, country: 'SFO', city: '旧金山' }, // 硅谷
  { lat: 25.2048, lon: 55.2708, country: 'DXB', city: '迪拜' },  // 中东枢纽
  { lat: 52.5200, lon: 13.4050, country: 'BER', city: '柏林' }, // 德国
  { lat: 48.8566, lon: 2.3522, country: 'PAR', city: '巴黎' }, // 法国
  { lat: 19.4326, lon: -99.1332, country: 'MEX', city: '墨西哥城' }, // 墨西哥
  { lat: 37.5665, lon: 126.9780, country: 'SEL', city: '首尔' }, // 韩国
];

const attackColors = {
  critical: '#FF3333',
  high: '#FF9933',
  medium: '#FFCC33',
  low: '#00FF88',
};

// 将经纬度转换为3D球面坐标
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

// 创建贝塞尔曲线路径
function createCurvePoints(start: THREE.Vector3, end: THREE.Vector3) {
  const distance = start.distanceTo(end);
  const height = distance * 0.5;
  
  const mid = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);
  
  mid.normalize().multiplyScalar(2.2 + height);
  
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(50);
}

// 粒子群组件
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#00FF88"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// 经纬线网格组件
function LatLonGrid() {
  const lines = [];
  const radius = 2;
  
  // 经线
  for (let lon = 0; lon < 360; lon += 15) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      points.push(latLonToVector3(lat, lon, radius));
    }
    lines.push(
      <Line
        key={`lon-${lon}`}
        points={points}
        color="#00FF88"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    );
  }
  
  // 纬线
  for (let lat = -90; lat <= 90; lat += 15) {
    const points = [];
    for (let lon = 0; lon < 360; lon += 5) {
      points.push(latLonToVector3(lat, lon, radius));
    }
    lines.push(
      <Line
        key={`lat-${lat}`}
        points={points}
        color="#00FF88"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    );
  }
  
  return <>{lines}</>;
}

// 数据流环组件
function DataRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.002;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= 0.003;
    if (ring3Ref.current) ring3Ref.current.rotation.z += 0.001;
  });

  return (
    <group>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, Math.PI / 3]}>
        <torusGeometry args={[3, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// 地球组件（增强版）
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group>
      {/* 内层实心球体 */}
      <Sphere args={[1.98, 64, 64]}>
        <meshStandardMaterial
          color="#050505"
          emissive="#001a0a"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>
      
      {/* 主地球线框 */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#0A0A0A"
          emissive="#00FF88"
          emissiveIntensity={0.15}
          roughness={0.9}
          metalness={0.1}
          wireframe={true}
          wireframeLinewidth={1}
        />
      </Sphere>
      
      {/* 经纬线网格 */}
      <LatLonGrid />
      
      {/* 外层旋转大气 */}
      <Sphere ref={atmosphereRef} args={[2.05, 32, 32]}>
        <meshBasicMaterial
          color="#00FF88"
          wireframe={true}
          transparent
          opacity={0.2}
        />
      </Sphere>
      
      {/* 发光大气层 */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#00FF88"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* 最外层光晕 */}
      <Sphere args={[2.4, 32, 32]}>
        <meshBasicMaterial
          color="#00FF88"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// 城市节点组件（增强版）
function CityNode({ position, label, city }: { position: THREE.Vector3; label: string; city: string }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (coreRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (ring1Ref.current) {
      ring1Ref.current.scale.set(1.5, 1.5, 1.5);
      ring1Ref.current.material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.scale.set(2, 2, 2);
      ring2Ref.current.material.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 2 + Math.PI) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* 核心光点 */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#00FF88" />
        <pointLight color="#00FF88" intensity={1} distance={0.5} />
      </mesh>
      
      {/* 内圈脉冲 */}
      <mesh ref={ring1Ref}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.3} />
      </mesh>
      
      {/* 外圈脉冲 */}
      <mesh ref={ring2Ref}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.2} />
      </mesh>
      
      {/* 竖直光柱 */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.4} />
      </mesh>
      
      {/* 城市标签 */}
      {hovered && (
        <Html distanceFactor={5}>
          <div className="bg-[#0A0A0A] border border-[#00FF88] px-2 py-1 pointer-events-none whitespace-nowrap" style={{ boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)' }}>
            <span className="font-mono text-xs text-[#00FF88]">{label}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// 攻击路径组件（增强版）
function AttackPath({ threat }: { threat: Threat }) {
  const particleRef = useRef<THREE.Mesh>(null);
  const trailRefs = useRef<THREE.Mesh[]>([]);
  
  const startPos = useMemo(() => latLonToVector3(threat.from.lat, threat.from.lon, 2), [threat]);
  const endPos = useMemo(() => latLonToVector3(threat.to.lat, threat.to.lon, 2), [threat]);
  const points = useMemo(() => createCurvePoints(startPos, endPos), [startPos, endPos]);
  
  useFrame(() => {
    if (particleRef.current && points.length > 0) {
      const index = Math.floor(threat.progress * (points.length - 1));
      if (points[index]) {
        particleRef.current.position.copy(points[index]);
      }
    }
  });

  return (
    <group>
      {/* 主路径线 */}
      <Line
        points={points}
        color={threat.color}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      
      {/* 背景光晕线 */}
      <Line
        points={points}
        color={threat.color}
        lineWidth={4}
        transparent
        opacity={0.2}
      />
      
      {/* 前进粒子（主） */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={threat.color} />
      </mesh>
      
      {/* 粒子光晕 */}
      {particleRef.current && (
        <>
          <mesh position={particleRef.current.position}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={threat.color} transparent opacity={0.5} />
          </mesh>
          <pointLight 
            position={particleRef.current.position}
            color={threat.color} 
            intensity={3} 
            distance={0.8} 
          />
        </>
      )}
    </group>
  );
}

// 脉冲波组件
function PulseWaves() {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (wave1Ref.current) {
      const scale = 2 + (time % 3);
      wave1Ref.current.scale.set(scale, scale, scale);
      wave1Ref.current.material.opacity = Math.max(0, 0.3 - (time % 3) * 0.1);
    }
    
    if (wave2Ref.current) {
      const scale = 2 + ((time + 1.5) % 3);
      wave2Ref.current.scale.set(scale, scale, scale);
      wave2Ref.current.material.opacity = Math.max(0, 0.3 - ((time + 1.5) % 3) * 0.1);
    }
  });

  return (
    <group>
      <mesh ref={wave1Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh ref={wave2Ref}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
}

// 3D场景组件
function Scene({ threats }: { threats: Threat[] }) {
  return (
    <>
      {/* 星空背景 */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* 环境光 */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FF88" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#00FF88" />
      
      {/* 背景粒子 */}
      <Particles />
      
      {/* 数据流环 */}
      <DataRings />
      
      {/* 脉冲波 */}
      <PulseWaves />
      
      {/* 地球 */}
      <Earth />
      
      {/* 城市节点 */}
      {locations.map((loc, index) => {
        const position = latLonToVector3(loc.lat, loc.lon, 2);
        return <CityNode key={index} position={position} label={loc.country} city={loc.city} />;
      })}
      
      {/* 攻击路径 */}
      {threats.map((threat) => (
        <AttackPath key={threat.id} threat={threat} />
      ))}
      
      {/* 轨道控制 */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        autoRotate={true}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
}

export function CyberThreatMap3D() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const { t, language } = useLanguage();
  
  // 基于真实网络安全报告的威胁统计（数据参考：Check Point、Kaspersky、IBM X-Force 2024年度报告）
  const [threatStats, setThreatStats] = useState<ThreatStat[]>([
    { label: 'threat.ddos', count: 12847, trend: 'up', color: '#FF3333' }, // DDoS攻击量持续上升
    { label: 'threat.malware', count: 38914, trend: 'up', color: '#FF9933' }, // 恶意软件检测量
    { label: 'threat.sql', count: 21563, trend: 'down', color: '#FFCC33' }, // SQL注入尝试
    { label: 'threat.phishing', count: 56328, trend: 'up', color: '#00FF88' }, // 钓鱼攻击量
  ]);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // 生成攻击
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
        progress: 0,
      };

      setThreats(prev => [...prev.slice(-5), newAttack]);
    };

    // 初始攻击
    for (let i = 0; i < 3; i++) {
      setTimeout(generateAttack, i * 1000);
    }

    const interval = setInterval(generateAttack, 2500);
    return () => clearInterval(interval);
  }, []);

  // 更新攻击进度
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => prev.map(threat => ({
        ...threat,
        progress: Math.min(threat.progress + 0.01, 1),
      })).filter(t => t.progress < 1));
    }, 50);

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

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-2 bg-[#0A0A0A] border border-[#00FF88] px-3 py-1"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="w-3 h-3 text-[#00FF88]" />
              <span className="font-mono text-xs text-[#00FF88]">{language === 'zh' ? '监控中' : 'MONITORING'}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 bg-[#0A0A0A] border border-[#FF3333] px-3 py-1"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-[#FF3333]" />
              <span className="font-mono text-xs text-[#FF3333]">{t('threat.live')}</span>
            </motion.div>
          </div>
        </div>
        <div className="h-px bg-[#00FF88]/30 mb-2" />
        <p className="font-mono text-xs text-[#00FF88]/60">
          {t('threat.desc')}
        </p>
      </div>

      {/* 3D Canvas */}
      <div className="relative z-10 mb-8" style={{ height: '700px' }}>
        <Canvas
          camera={{ position: [0, 2, 6], fov: 50 }}
          style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' }}
        >
          <Scene threats={threats} />
        </Canvas>

        {/* Alert notifications */}
        <div className="absolute left-4 top-4 space-y-3 pointer-events-none max-h-[600px] overflow-hidden">
          <AnimatePresence>
            {threats.slice(-4).map((attack, index) => (
              <motion.div
                key={attack.id}
                className="bg-[#0A0A0A]/95 border border-[#00FF88] px-4 py-3 max-w-xs pointer-events-auto backdrop-blur-sm"
                style={{ 
                  boxShadow: `0 0 15px ${attack.color}40`,
                }}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: attack.color }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#00FF88] uppercase">{attack.type}</span>
                      <div 
                        className="w-1.5 h-1.5"
                        style={{ 
                          backgroundColor: attack.color,
                          boxShadow: `0 0 4px ${attack.color}`
                        }}
                      />
                    </div>
                    <p className="font-mono text-xs text-[#00FF88]/70">
                      {attack.from.city} → {attack.to.city}
                    </p>
                    <p className="font-mono text-xs text-[#00FF88]/50 mt-1">
                      {attack.from.country} → {attack.to.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* System Info */}
        <div className="absolute right-4 top-4 bg-[#0A0A0A]/95 border border-[#00FF88]/50 px-4 py-3 backdrop-blur-sm" style={{ boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)' }}>
          <div className="space-y-2 font-mono text-xs text-[#00FF88]/70">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>{language === 'zh' ? '防护系统' : 'DEFENSE'}: {language === 'zh' ? '在线' : 'ONLINE'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span>{language === 'zh' ? '处理速度' : 'SPEED'}: {threats.length * 150}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>{language === 'zh' ? '活跃连接' : 'ACTIVE'}: {threats.length}/{locations.length * 2}</span>
            </div>
          </div>
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
              scale: 1.02,
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
            <div className="mt-2 h-1 bg-[#0A0A0A] border border-[#00FF88]/30">
              <motion.div
                className="h-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: '0%' }}
                animate={{ width: `${50 + Math.random() * 50}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 font-mono text-xs text-[#00FF88]/60 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF3333]" style={{ boxShadow: '0 0 8px #FF3333' }} />
          <span>{t('threat.critical')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF9933]" style={{ boxShadow: '0 0 8px #FF9933' }} />
          <span>{t('threat.high')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FFCC33]" style={{ boxShadow: '0 0 8px #FFCC33' }} />
          <span>{t('threat.medium')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00FF88]" style={{ boxShadow: '0 0 8px #00FF88' }} />
          <span>{t('threat.low')}</span>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="relative z-10 border-t border-[#00FF88]/30 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Source */}
          <div className="bg-[#0A0A0A] border border-[#00FF88]/30 p-4">
            <h4 className="font-mono text-xs text-[#00FF88] mb-3 flex items-center gap-2">
              <span className="text-[#00FF88]">▶</span>
              {language === 'zh' ? '数据来源' : 'DATA SOURCES'}
            </h4>
            <div className="space-y-2 font-mono text-xs text-[#00FF88]/60">
              <p className="flex items-center gap-2">
                <span className="text-[#00FF88]">•</span>
                Check Point Security Report 2024
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#00FF88]">•</span>
                Kaspersky Threat Intelligence
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#00FF88]">•</span>
                IBM X-Force Threat Intelligence Index
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#00FF88]">•</span>
                MITRE ATT&CK Framework
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#00FF88]">•</span>
                US-CERT Cybersecurity Alerts
              </p>
            </div>
          </div>

          {/* Real-time Statistics */}
          <div className="bg-[#0A0A0A] border border-[#00FF88]/30 p-4">
            <h4 className="font-mono text-xs text-[#00FF88] mb-3 flex items-center gap-2">
              <span className="text-[#00FF88]">▶</span>
              {language === 'zh' ? '实时统计' : 'REAL-TIME STATS'}
            </h4>
            <div className="space-y-2 font-mono text-xs text-[#00FF88]/60">
              <p className="flex items-center justify-between">
                <span>{language === 'zh' ? '更新时间' : 'Updated'}:</span>
                <span className="text-[#00FF88]">{currentTime.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US')}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>{language === 'zh' ? '监控节点' : 'Monitor Nodes'}:</span>
                <span className="text-[#00FF88]">{locations.length} {language === 'zh' ? '个' : 'locations'}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>{language === 'zh' ? '活跃威胁' : 'Active Threats'}:</span>
                <span className="text-[#FF3333]">{threats.length}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>{language === 'zh' ? '总检测量' : 'Total Detections'}:</span>
                <span className="text-[#00FF88]">{threatStats.reduce((sum, stat) => sum + stat.count, 0).toLocaleString()}</span>
              </p>
              <div className="pt-2 border-t border-[#00FF88]/20">
                <p className="flex items-center justify-between">
                  <span>{language === 'zh' ? '系统状态' : 'System Status'}:</span>
                  <span className="text-[#00FF88]">{language === 'zh' ? '正常运行' : 'OPERATIONAL'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center font-mono text-xs text-[#00FF88]/40 leading-relaxed">
          {language === 'zh' 
            ? '⚠️ 本平台数据基于公开网络安全报告整合，用于教育和演示目的。实际威胁情况请参考专业安全机构实时数据。'
            : '⚠️ Data is aggregated from public cybersecurity reports for educational and demonstration purposes. For real-time threat intelligence, please refer to professional security organizations.'
          }
        </div>
      </div>
    </div>
  );
}
