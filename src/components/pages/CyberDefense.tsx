import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Swords, Info, X, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CommandHistory {
  command: string;
  output: string[];
  type: 'attack' | 'defense';
  timestamp: string;
}

const attackData = [
  { name: 'SQL注入', value: 45, color: '#ff0055' },
  { name: 'XSS', value: 38, color: '#ff6b35' },
  { name: '弱口令', value: 62, color: '#ffa500' },
  { name: 'DDoS', value: 28, color: '#ff1744' },
];

const networkNodes = [
  { id: 1, x: 20, y: 30, size: 8 },
  { id: 2, x: 40, y: 20, size: 10 },
  { id: 3, x: 60, y: 40, size: 12 },
  { id: 4, x: 80, y: 25, size: 8 },
  { id: 5, x: 50, y: 60, size: 10 },
];

const attackCommands: Record<string, string[]> = {
  'help': [
    '可用攻击命令：',
    '  nmap <target>          - 扫描目标端口',
    '  sqlmap <url>           - SQL注入测试',
    '  nikto <url>            - Web漏洞扫描',
    '  hydra <target>         - 暴力破解',
    '  metasploit <exploit>   - 漏洞利用',
    '  clear                  - 清空终端',
  ],
  'nmap 192.168.1.100': [
    'Starting Nmap 7.94 ( https://nmap.org )',
    'Nmap scan report for 192.168.1.100',
    'Host is up (0.00023s latency).',
    'PORT     STATE SERVICE',
    '22/tcp   open  ssh',
    '80/tcp   open  http',
    '443/tcp  open  https',
    '3306/tcp open  mysql',
    '8080/tcp open  http-proxy',
    '',
    'Nmap done: 1 IP address (1 host up) scanned in 0.52 seconds',
  ],
  'nmap': [
    'Starting Nmap 7.94 ( https://nmap.org )',
    'Nmap scan report for localhost (127.0.0.1)',
    'Host is up (0.00010s latency).',
    'PORT     STATE SERVICE',
    '80/tcp   open  http',
    '443/tcp  open  https',
    '',
    'Nmap done: 1 IP address (1 host up) scanned in 0.25 seconds',
  ],
  'sqlmap http://target.com/login.php?id=1': [
    '[*] Starting sqlmap...',
    '[*] Testing connection to the target URL',
    '[*] Testing parameter "id"',
    '[INFO] GET parameter "id" is vulnerable',
    '[INFO] Testing MySQL',
    '[CRITICAL] SQL injection vulnerability found!',
    '[INFO] The back-end DBMS is MySQL',
    '[INFO] Fetching database names',
    'available databases [3]:',
    '[*] information_schema',
    '[*] mysql',
    '[*] webapp_db',
    '',
    '[WARNING] 发现严重的SQL注入漏洞！',
  ],
  'sqlmap': [
    '[*] Starting sqlmap...',
    '[ERROR] Missing target URL',
    '[INFO] Usage: sqlmap <url>',
  ],
  'nikto -h http://target.com': [
    '- Nikto v2.5.0',
    '+ Target IP:          192.168.1.100',
    '+ Target Hostname:    target.com',
    '+ Target Port:        80',
    '+ Start Time:         2025-01-16 10:30:00',
    '---------------------------------------------',
    '+ Server: Apache/2.4.41 (Ubuntu)',
    '+ OSVDB-3233: /icons/README: Apache default file found.',
    '+ OSVDB-3092: /admin/: Admin directory found.',
    '+ OSVDB-3268: /config/: Configuration directory found.',
    '+ OSVDB-637: Enumeration of users is possible',
    '+ 7 host(s) tested',
    '',
    '[WARNING] 发现多个安全配置问题！',
  ],
  'nikto': [
    '- Nikto v2.5.0',
    '[ERROR] No host specified',
    '[INFO] Usage: nikto -h <url>',
  ],
  'hydra -l admin -P /wordlist.txt ssh://192.168.1.100': [
    'Hydra v9.5 starting...',
    '[DATA] max 16 tasks per 1 server',
    '[DATA] attacking ssh://192.168.1.100:22/',
    '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "password"',
    '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "123456"',
    '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "admin123"',
    '[22][ssh] host: 192.168.1.100   login: admin   password: admin123',
    '[STATUS] attack finished for 192.168.1.100',
    '',
    '[SUCCESS] 密码破解成功！',
  ],
  'hydra': [
    'Hydra v9.5',
    '[ERROR] Missing parameters',
    '[INFO] Usage: hydra -l <user> -P <wordlist> <target>',
  ],
  'metasploit ms17-010': [
    '[*] Metasploit Framework v6.3.0',
    '[*] Loading exploit: exploit/windows/smb/ms17_010_eternalblue',
    '[*] Configured target: 192.168.1.100',
    '[*] Sending exploit payload...',
    '[*] Connecting to target...',
    '[+] Exploit completed successfully!',
    '[*] Session 1 opened',
    '[*] Meterpreter session established',
    '',
    '[SUCCESS] 成功获取目标系统权限！',
  ],
  'metasploit': [
    '[*] Metasploit Framework v6.3.0',
    '[INFO] Usage: metasploit <exploit>',
    '[INFO] Popular exploits: ms17-010, eternal-blue',
  ],
};

const defenseCommands: Record<string, string[]> = {
  'help': [
    '可用防御命令：',
    '  firewall status        - 查看防火墙状态',
    '  firewall block <ip>    - 封禁IP地址',
    '  ips detect             - 入侵检测',
    '  scan malware           - 恶意软件扫描',
    '  monitor traffic        - 流量监控',
    '  clear                  - 清空终端',
  ],
  'firewall status': [
    'Firewall Status: ACTIVE',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Active Rules: 247',
    'Blocked IPs: 1,523',
    'Allowed Ports: 80, 443, 22',
    'Default Policy: DROP',
    '',
    'Recent Blocks:',
    '  192.168.1.50  - SQL Injection attempt',
    '  10.0.0.123    - Port scanning',
    '  172.16.0.88   - DDoS attack',
    '',
    '[INFO] 防火墙运行正常',
  ],
  'firewall': [
    'Firewall Status: ACTIVE',
    '[INFO] Use "firewall status" for details',
    '[INFO] Use "firewall block <ip>" to block an IP',
  ],
  'firewall block 192.168.1.50': [
    '[*] Blocking IP: 192.168.1.50',
    '[*] Adding rule to firewall...',
    '[*] Dropping all packets from 192.168.1.50',
    '[SUCCESS] IP address blocked successfully',
    '[INFO] All connections from 192.168.1.50 will be rejected',
    '',
    'Updated Firewall Rules:',
    '  BLOCK 192.168.1.50 (SQL Injection)',
  ],
  'ips detect': [
    '[*] Starting Intrusion Prevention System...',
    '[*] Monitoring network traffic...',
    '[*] Analyzing packets...',
    '',
    'Threats Detected:',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '  [HIGH]   SQL Injection - 192.168.1.50',
    '  [HIGH]   XSS Attack - 10.0.0.123',
    '  [MEDIUM] Port Scan - 172.16.0.88',
    '  [LOW]    Suspicious User-Agent - 192.168.1.77',
    '',
    '[*] Auto-blocking malicious IPs...',
    '[SUCCESS] 4 threats blocked automatically',
  ],
  'ips': [
    '[*] Intrusion Prevention System',
    '[INFO] Use "ips detect" to start detection',
  ],
  'scan malware': [
    '[*] Starting malware scan...',
    '[*] Scanning system files...',
    '[*] Checking running processes...',
    '[*] Analyzing network connections...',
    '',
    'Scan Results:',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'Files scanned: 45,782',
    'Threats found: 3',
    '',
    'Detected Threats:',
    '  [CRITICAL] Trojan.Generic.KD.1234 - /tmp/suspicious.exe',
    '  [HIGH]     Backdoor.SSH.1 - /usr/bin/.hidden',
    '  [MEDIUM]   Adware.Tracking - /var/log/tracker.js',
    '',
    '[*] Quarantining infected files...',
    '[SUCCESS] All threats removed successfully',
  ],
  'scan': [
    '[INFO] Usage: scan malware',
  ],
  'monitor traffic': [
    '[*] Starting traffic monitor...',
    '[*] Capturing packets on eth0...',
    '',
    'Real-time Traffic Analysis:',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '↓ Incoming: 2.4 MB/s',
    '↑ Outgoing: 1.8 MB/s',
    '',
    'Top Connections:',
    '  192.168.1.100 → 8.8.8.8:443     (HTTPS)',
    '  192.168.1.100 → 1.1.1.1:53      (DNS)',
    '  192.168.1.50  → 192.168.1.100:3306 (MySQL) [SUSPICIOUS]',
    '',
    '[WARNING] Detected suspicious MySQL connection',
    '[ACTION] Connection from 192.168.1.50 has been logged',
  ],
  'monitor': [
    '[INFO] Usage: monitor traffic',
  ],
};

export function CyberDefense() {
  const [attackHistory, setAttackHistory] = useState<CommandHistory[]>([]);
  const [defenseHistory, setDefenseHistory] = useState<CommandHistory[]>([]);
  const [attackInput, setAttackInput] = useState('');
  const [defenseInput, setDefenseInput] = useState('');
  const [showHelp, setShowHelp] = useState(true);
  const [attackActive, setAttackActive] = useState(false);
  const [defenseActive, setDefenseActive] = useState(false);
  const [attackSuccess] = useState(67);
  const [defenseSuccess] = useState(89);
  
  const attackEndRef = useRef<HTMLDivElement>(null);
  const defenseEndRef = useRef<HTMLDivElement>(null);
  const attackInputRef = useRef<HTMLInputElement>(null);
  const defenseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    attackEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [attackHistory]);

  useEffect(() => {
    defenseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [defenseHistory]);

  const executeAttackCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const normalizedCmd = cmd.trim().toLowerCase();

    let output: string[] = [];

    if (normalizedCmd === 'clear') {
      setAttackHistory([]);
      return;
    }

    // Trigger visual effect
    setAttackActive(true);
    setTimeout(() => setAttackActive(false), 2000);

    // Check for exact matches first
    if (attackCommands[normalizedCmd]) {
      output = attackCommands[normalizedCmd];
    } else {
      // Check for partial matches
      const matchedKey = Object.keys(attackCommands).find(key => 
        normalizedCmd.startsWith(key.split(' ')[0])
      );
      
      if (matchedKey && normalizedCmd.startsWith(matchedKey.split(' ')[0])) {
        const baseCommand = matchedKey.split(' ')[0];
        if (attackCommands[baseCommand]) {
          output = attackCommands[baseCommand];
        }
      } else {
        output = [
          `Command not found: ${cmd}`,
          'Type "help" to see available commands',
        ];
      }
    }

    setAttackHistory(prev => [...prev, {
      command: cmd,
      output,
      type: 'attack',
      timestamp,
    }]);
    setAttackInput('');
  };

  const executeDefenseCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const normalizedCmd = cmd.trim().toLowerCase();

    let output: string[] = [];

    if (normalizedCmd === 'clear') {
      setDefenseHistory([]);
      return;
    }

    // Trigger visual effect
    setDefenseActive(true);
    setTimeout(() => setDefenseActive(false), 2000);

    // Check for exact matches first
    if (defenseCommands[normalizedCmd]) {
      output = defenseCommands[normalizedCmd];
    } else {
      // Check for partial matches
      const matchedKey = Object.keys(defenseCommands).find(key => 
        normalizedCmd.startsWith(key.split(' ')[0])
      );
      
      if (matchedKey && normalizedCmd.startsWith(matchedKey.split(' ')[0])) {
        const baseCommand = matchedKey.split(' ')[0];
        if (defenseCommands[baseCommand]) {
          output = defenseCommands[baseCommand];
        }
      } else {
        output = [
          `Command not found: ${cmd}`,
          'Type "help" to see available commands',
        ];
      }
    }

    setDefenseHistory(prev => [...prev, {
      command: cmd,
      output,
      type: 'defense',
      timestamp,
    }]);
    setDefenseInput('');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl mb-4 neon-text">
            网络攻防实战体验
          </h1>
          <p className="text-xl text-gray-400">
            在真实的命令行终端中体验攻击与防御，观察网络拓扑的实时变化
          </p>
        </motion.div>

        {/* Network Visualization */}
        <motion.div
          className="glass-card p-8 mb-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 cyber-grid opacity-20" />
          
          {/* Network Nodes */}
          <div className="relative h-64">
            <svg className="w-full h-full">
              {/* Connections */}
              {networkNodes.map((node, i) => 
                networkNodes.slice(i + 1).map((targetNode) => (
                  <motion.line
                    key={`${node.id}-${targetNode.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={attackActive ? 'rgba(255, 0, 85, 0.6)' : defenseActive ? 'rgba(0, 255, 136, 0.6)' : 'rgba(0, 240, 255, 0.3)'}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ))
              )}

              {/* Nodes */}
              {networkNodes.map((node) => (
                <g key={node.id}>
                  <motion.circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={node.size}
                    fill={attackActive ? '#ff0055' : defenseActive ? '#00ff88' : '#00f0ff'}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: attackActive || defenseActive ? [1, 1.5, 1] : [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {defenseActive && (
                    <motion.circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={node.size + 10}
                      fill="none"
                      stroke="#00ff88"
                      strokeWidth="2"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {attackActive && (
                    <motion.circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={node.size + 10}
                      fill="none"
                      stroke="#ff0055"
                      strokeWidth="2"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">网络拓扑实时监控</p>
              {attackActive && <p className="text-xs text-red-400 mt-1">🔴 检测到攻击</p>}
              {defenseActive && <p className="text-xs text-green-400 mt-1">🛡️ 防御已激活</p>}
            </div>
          </div>
        </motion.div>

        {/* Help Banner */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              className="glass-card p-4 mb-6 border-cyan-500/50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-300 mb-2">
                    💡 <strong>使用提示：</strong>在下方的终端中输入命令，左侧是攻击终端（红色），右侧是防御终端（绿色）。执行命令时观察上方网络拓扑的变化。
                  </p>
                  <p className="text-xs text-gray-400">
                    输入 <code className="text-cyan-400 bg-black/50 px-1 rounded">help</code> 查看可用命令
                  </p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attack Terminal */}
          <motion.div
            className="glass-card border-red-500/50 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Header */}
            <div className="bg-red-500/10 border-b border-red-500/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="w-5 h-5 text-red-400" />
                <span className="text-red-400">攻击终端</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              className="bg-black/80 p-4 h-[500px] overflow-y-auto font-mono text-sm"
              onClick={() => attackInputRef.current?.focus()}
            >
              {/* Welcome Message */}
              <div className="text-red-400 mb-4">
                <p>╔═══════════════════════════════════════╗</p>
                <p>║   ATTACK SIMULATION TERMINAL v2.0    ║</p>
                <p>╚═══════════════════════════════════════╝</p>
                <p className="mt-2 text-gray-400">Type 'help' for available commands</p>
                <p className="text-gray-600">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
              </div>

              {/* Command History */}
              {attackHistory.map((item, index) => (
                <motion.div
                  key={index}
                  className="mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400">attacker@cyber</span>
                    <span className="text-gray-600">~</span>
                    <span className="text-red-500">$</span>
                    <span className="text-gray-300">{item.command}</span>
                  </div>
                  <div className="text-gray-400 ml-4">
                    {item.output.map((line, i) => (
                      <div key={i} className={
                        line.includes('[SUCCESS]') || line.includes('[+]') ? 'text-green-400' :
                        line.includes('[CRITICAL]') || line.includes('[WARNING]') ? 'text-yellow-400' :
                        line.includes('[ERROR]') ? 'text-red-400' :
                        line.includes('[INFO]') ? 'text-cyan-400' :
                        'text-gray-400'
                      }>
                        {line}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-red-400">attacker@cyber</span>
                <span className="text-gray-600">~</span>
                <span className="text-red-500">$</span>
                <input
                  ref={attackInputRef}
                  type="text"
                  value={attackInput}
                  onChange={(e) => setAttackInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeAttackCommand(attackInput);
                    }
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-300"
                  placeholder="输入攻击命令..."
                  autoFocus
                />
              </div>

              <div ref={attackEndRef} />
            </div>
          </motion.div>

          {/* Defense Terminal */}
          <motion.div
            className="glass-card border-green-500/50 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Header */}
            <div className="bg-green-500/10 border-b border-green-500/50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400">防御终端</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              className="bg-black/80 p-4 h-[500px] overflow-y-auto font-mono text-sm"
              onClick={() => defenseInputRef.current?.focus()}
            >
              {/* Welcome Message */}
              <div className="text-green-400 mb-4">
                <p>╔═══════════════════════════════════════╗</p>
                <p>║   DEFENSE SYSTEM TERMINAL v2.0       ║</p>
                <p>╚═══════════════════════════════════════╝</p>
                <p className="mt-2 text-gray-400">Type 'help' for available commands</p>
                <p className="text-gray-600">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
              </div>

              {/* Command History */}
              {defenseHistory.map((item, index) => (
                <motion.div
                  key={index}
                  className="mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">defender@cyber</span>
                    <span className="text-gray-600">~</span>
                    <span className="text-green-500">$</span>
                    <span className="text-gray-300">{item.command}</span>
                  </div>
                  <div className="text-gray-400 ml-4">
                    {item.output.map((line, i) => (
                      <div key={i} className={
                        line.includes('[SUCCESS]') || line.includes('[+]') ? 'text-green-400' :
                        line.includes('[CRITICAL]') || line.includes('[HIGH]') ? 'text-red-400' :
                        line.includes('[WARNING]') || line.includes('[MEDIUM]') ? 'text-yellow-400' :
                        line.includes('[INFO]') ? 'text-cyan-400' :
                        line.includes('[LOW]') ? 'text-gray-500' :
                        'text-gray-400'
                      }>
                        {line}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-green-400">defender@cyber</span>
                <span className="text-gray-600">~</span>
                <span className="text-green-500">$</span>
                <input
                  ref={defenseInputRef}
                  type="text"
                  value={defenseInput}
                  onChange={(e) => setDefenseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeDefenseCommand(defenseInput);
                    }
                  }}
                  className="flex-1 bg-transparent outline-none text-gray-300"
                  placeholder="输入防御命令..."
                />
              </div>

              <div ref={defenseEndRef} />
            </div>
          </motion.div>
        </div>

        {/* Quick Commands */}
        <motion.div
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Attack Quick Commands */}
          <div className="glass-card p-4 border-red-500/30">
            <h3 className="text-lg text-red-400 mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              快速攻击命令
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['nmap 192.168.1.100', 'sqlmap http://target.com/login.php?id=1', 'nikto -h http://target.com', 'hydra -l admin -P /wordlist.txt ssh://192.168.1.100'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setAttackInput(cmd);
                    attackInputRef.current?.focus();
                  }}
                  className="text-left px-3 py-2 rounded bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 transition-all text-xs text-gray-300"
                >
                  {cmd.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Defense Quick Commands */}
          <div className="glass-card p-4 border-green-500/30">
            <h3 className="text-lg text-green-400 mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              快速防御命令
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['firewall status', 'ips detect', 'scan malware', 'monitor traffic'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setDefenseInput(cmd);
                    defenseInputRef.current?.focus();
                  }}
                  className="text-left px-3 py-2 rounded bg-green-500/10 border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/20 transition-all text-xs text-gray-300"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl text-cyan-400 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            攻防对比仪表盘
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Attack Success Rate */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-gray-300">攻击成功率</span>
                </div>
                <span className="text-2xl text-red-400">{attackSuccess}%</span>
              </div>
              <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${attackSuccess}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Defense Success Rate */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">防御成功率</span>
                </div>
                <span className="text-2xl text-green-400">{defenseSuccess}%</span>
              </div>
              <div className="relative h-4 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${defenseSuccess}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Attack Types Chart */}
          <div>
            <h4 className="text-lg text-gray-300 mb-4">常见攻击类型统计</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attackData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,240,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 26, 0.9)', 
                    border: '1px solid rgba(0,240,255,0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {attackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
