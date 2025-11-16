import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Swords, Info, X, Activity, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommandHistory {
  command: string;
  output: string[];
  type: 'attack' | 'defense';
  timestamp: string;
}

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'server' | 'firewall' | 'database' | 'client' | 'router';
  label: string;
  status: 'normal' | 'warning' | 'danger' | 'protected';
}

interface NetworkEffect {
  type: 'attack' | 'defense' | 'scan' | 'exploit' | 'block';
  sourceNodeId?: number;
  targetNodeId?: number;
  color: string;
}

const attackCommands: Record<string, { output: string[], effect?: NetworkEffect, targetNode?: number }> = {
  'help': {
    output: [
      '可用攻击命令：',
      '  nmap <target>          - 端口扫描目标主机',
      '  nmap -sV <target>      - 服务版本检测',
      '  nmap -O <target>       - 操作系统检测',
      '  sqlmap <url>           - SQL注入测试',
      '  sqlmap --dbs <url>     - 枚举数据库',
      '  nikto <url>            - Web漏洞扫描',
      '  hydra <target>         - SSH暴力破解',
      '  metasploit <exploit>   - 漏洞利用框架',
      '  msfvenom <payload>     - 生成攻击载荷',
      '  burpsuite <url>        - Web应用测试',
      '  wireshark              - 抓包分析',
      '  aircrack <interface>   - WiFi密码破解',
      '  john <hashfile>        - 密码哈希破解',
      '  clear                  - 清空终端',
    ]
  },
  'nmap 192.168.1.100': {
    output: [
      'Starting Nmap 7.94 ( https://nmap.org )',
      'Nmap scan report for 192.168.1.100',
      'Host is up (0.00023s latency).',
      '',
      'PORT     STATE SERVICE',
      '22/tcp   open  ssh',
      '80/tcp   open  http',
      '443/tcp  open  https',
      '3306/tcp open  mysql',
      '8080/tcp open  http-proxy',
      '',
      'Nmap done: 1 IP address (1 host up) scanned in 0.52 seconds',
      '[INFO] 发现5个开放端口'
    ],
    effect: { type: 'scan', sourceNodeId: 1, targetNodeId: 3, color: '#ff6b35' },
    targetNode: 3
  },
  'nmap -sV 192.168.1.100': {
    output: [
      'Starting Nmap 7.94 ( https://nmap.org )',
      'Nmap scan report for 192.168.1.100',
      'Host is up (0.00015s latency).',
      '',
      'PORT     STATE SERVICE    VERSION',
      '22/tcp   open  ssh        OpenSSH 8.2p1 Ubuntu 4ubuntu0.5',
      '80/tcp   open  http       Apache httpd 2.4.41 ((Ubuntu))',
      '443/tcp  open  ssl/http   Apache httpd 2.4.41',
      '3306/tcp open  mysql      MySQL 8.0.32-0ubuntu0.20.04.2',
      '8080/tcp open  http-proxy Jetty 9.4.43.v20210629',
      '',
      '[SUCCESS] 服务指纹识别完成'
    ],
    effect: { type: 'scan', sourceNodeId: 1, targetNodeId: 3, color: '#ffa500' },
    targetNode: 3
  },
  'nmap -O 192.168.1.100': {
    output: [
      'Starting Nmap 7.94 ( https://nmap.org )',
      'Nmap scan report for 192.168.1.100',
      '',
      'OS detection performed:',
      'Running: Linux 5.X',
      'OS CPE: cpe:/o:linux:linux_kernel:5',
      'OS details: Linux 5.4 - 5.10',
      'Network Distance: 1 hop',
      '',
      '[INFO] 目标系统: Ubuntu 20.04 LTS'
    ],
    effect: { type: 'scan', sourceNodeId: 1, targetNodeId: 3, color: '#ff0055' },
    targetNode: 3
  },
  'sqlmap http://target.com/login.php?id=1': {
    output: [
      '[*] Starting sqlmap...',
      '[*] Testing connection to the target URL',
      '[*] Testing parameter "id"',
      '[INFO] GET parameter "id" is vulnerable',
      '[INFO] Testing MySQL',
      '',
      '[CRITICAL] SQL injection vulnerability found!',
      '[INFO] The back-end DBMS is MySQL',
      '[INFO] Fetching database names',
      '',
      'available databases [3]:',
      '[*] information_schema',
      '[*] mysql',
      '[*] webapp_db',
      '',
      '[WARNING] 发现严重的SQL注入漏洞！'
    ],
    effect: { type: 'exploit', sourceNodeId: 1, targetNodeId: 5, color: '#ff0055' },
    targetNode: 5
  },
  'sqlmap --dbs http://target.com/api': {
    output: [
      '[*] Starting database enumeration...',
      '[*] Injecting payload: UNION SELECT',
      '[*] Bypassing WAF filters...',
      '',
      '[SUCCESS] Databases enumerated:',
      '  [1] admin_panel',
      '  [2] customer_data',
      '  [3] financial_records',
      '  [4] user_credentials',
      '',
      '[CRITICAL] 敏感数据库暴露！'
    ],
    effect: { type: 'exploit', sourceNodeId: 1, targetNodeId: 5, color: '#ff1744' },
    targetNode: 5
  },
  'nikto -h http://target.com': {
    output: [
      '- Nikto v2.5.0',
      '+ Target IP:          192.168.1.100',
      '+ Target Hostname:    target.com',
      '+ Target Port:        80',
      '+ Start Time:         ' + new Date().toLocaleTimeString(),
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '+ Server: Apache/2.4.41 (Ubuntu)',
      '',
      '[MEDIUM] OSVDB-3233: /icons/README: Apache default file found',
      '[HIGH]   OSVDB-3092: /admin/: Admin directory exposed',
      '[HIGH]   OSVDB-3268: /config/: Configuration directory found',
      '[MEDIUM] OSVDB-637: User enumeration possible',
      '[LOW]    X-Frame-Options header not set',
      '',
      '+ 7 vulnerabilities found',
      '[WARNING] 发现多个安全配置问题！'
    ],
    effect: { type: 'scan', sourceNodeId: 1, targetNodeId: 3, color: '#ffa500' },
    targetNode: 3
  },
  'hydra -l admin -P /wordlist.txt ssh://192.168.1.100': {
    output: [
      'Hydra v9.5 starting...',
      '[DATA] max 16 tasks per 1 server',
      '[DATA] attacking ssh://192.168.1.100:22/',
      '',
      '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "password"',
      '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "123456"',
      '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "qwerty"',
      '[ATTEMPT] target 192.168.1.100 - login "admin" - pass "admin123"',
      '',
      '[22][ssh] host: 192.168.1.100   login: admin   password: admin123',
      '[STATUS] attack finished for 192.168.1.100',
      '',
      '[SUCCESS] SSH密码破解成功！'
    ],
    effect: { type: 'exploit', sourceNodeId: 1, targetNodeId: 3, color: '#ff0055' },
    targetNode: 3
  },
  'metasploit ms17-010': {
    output: [
      '[*] Metasploit Framework v6.3.0',
      '[*] Loading exploit: exploit/windows/smb/ms17_010_eternalblue',
      '[*] Configured target: 192.168.1.100',
      '',
      '[*] Checking if target is vulnerable...',
      '[+] Target is VULNERABLE to MS17-010!',
      '[*] Sending exploit payload...',
      '[*] Shellcode buffer prepared',
      '[*] Connecting to target...',
      '',
      '[+] Exploit completed successfully!',
      '[*] Session 1 opened (192.168.1.1:4444 -> 192.168.1.100:445)',
      '[*] Meterpreter session established',
      '',
      '[SUCCESS] 成功获取目标系统权限！'
    ],
    effect: { type: 'exploit', sourceNodeId: 1, targetNodeId: 3, color: '#ff0055' },
    targetNode: 3
  },
  'msfvenom -p windows/meterpreter/reverse_tcp': {
    output: [
      '[*] Generating payload...',
      '[*] Payload: windows/meterpreter/reverse_tcp',
      '[*] LHOST: 192.168.1.1',
      '[*] LPORT: 4444',
      '',
      '[*] Encoding with shikata_ga_nai...',
      '[*] Iterations: 3',
      '',
      '[SUCCESS] Payload generated successfully',
      '[*] Payload size: 73802 bytes',
      '[*] Final size: 73802 bytes',
      '',
      '[INFO] 攻击载荷已生成'
    ],
    effect: { type: 'attack', sourceNodeId: 1, color: '#ff6b35' }
  },
  'burpsuite http://target.com': {
    output: [
      '[*] Burp Suite Professional v2023.10.2',
      '[*] Starting web application security test',
      '[*] Target: http://target.com',
      '',
      '[*] Passive scanning enabled',
      '[*] Active scanning in progress...',
      '',
      'Vulnerabilities found:',
      '  [HIGH]   SQL Injection in /api/users',
      '  [HIGH]   Cross-Site Scripting (XSS) in /search',
      '  [MEDIUM] CSRF token not validated',
      '  [MEDIUM] Insecure Direct Object Reference',
      '  [LOW]    Missing security headers',
      '',
      '[WARNING] 发现5个安全漏洞'
    ],
    effect: { type: 'scan', sourceNodeId: 1, targetNodeId: 3, color: '#ffa500' },
    targetNode: 3
  },
  'wireshark': {
    output: [
      '[*] Starting Wireshark packet capture...',
      '[*] Interface: eth0',
      '[*] Capture filter: tcp port 80 or tcp port 443',
      '',
      'Captured packets:',
      '  1. 192.168.1.50 → 192.168.1.100 TCP [SYN]',
      '  2. 192.168.1.100 → 192.168.1.50 TCP [SYN, ACK]',
      '  3. 192.168.1.50 → 192.168.1.100 HTTP GET /admin',
      '  4. 192.168.1.100 → 192.168.1.50 HTTP 200 OK',
      '',
      '[INFO] 捕获到未加密的HTTP流量',
      '[WARNING] 检测到明文密码传输'
    ],
    effect: { type: 'scan', sourceNodeId: 1, targetNodeId: 2, color: '#00f0ff' },
    targetNode: 2
  },
  'aircrack -ng wlan0': {
    output: [
      '[*] Aircrack-ng 1.7',
      '[*] Starting WiFi password cracking...',
      '[*] Interface: wlan0',
      '[*] Target BSSID: 00:11:22:33:44:55',
      '',
      '[*] Collecting packets...',
      '[*] Captured 4-way handshake',
      '[*] Loading wordlist: rockyou.txt',
      '',
      '[*] Testing: password123',
      '[*] Testing: wifi2023',
      '[SUCCESS] KEY FOUND: SecureWiFi2023',
      '',
      '[INFO] WiFi密码破解成功'
    ],
    effect: { type: 'exploit', sourceNodeId: 1, targetNodeId: 4, color: '#ff0055' },
    targetNode: 4
  },
  'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt': {
    output: [
      'John the Ripper 1.9.0',
      'Loaded 5 password hashes',
      '',
      '[*] Starting password cracking...',
      '[*] Wordlist: rockyou.txt (14,344,392 words)',
      '',
      'Cracked passwords:',
      '  admin:password123',
      '  user1:qwerty123',
      '  dbadmin:P@ssw0rd',
      '  root:toor',
      '',
      '[SUCCESS] 4/5 密码破解成功',
      '[INFO] Cracking time: 2m 34s'
    ],
    effect: { type: 'exploit', sourceNodeId: 1, color: '#ff0055' }
  },
};

const defenseCommands: Record<string, { output: string[], effect?: NetworkEffect, targetNode?: number }> = {
  'help': {
    output: [
      '可用防御命令：',
      '  firewall status        - 查看防火墙状态',
      '  firewall block <ip>    - 封禁IP地址',
      '  firewall rules         - 查看防火墙规则',
      '  ips detect             - 入侵检测系统',
      '  ips block <ip>         - IPS自动阻断',
      '  scan malware           - 恶意软件扫描',
      '  scan ports             - 端口安全扫描',
      '  monitor traffic        - 实时流量监控',
      '  monitor logs           - 日志监控分析',
      '  patch system           - 系统补丁更新',
      '  backup database        - 数据库备份',
      '  encrypt data           - 数据加密',
      '  audit security         - 安全审计',
      '  clear                  - 清空终端',
    ]
  },
  'firewall status': {
    output: [
      '╔════════════════════════════════════════╗',
      '║       FIREWALL STATUS REPORT          ║',
      '╚════════════════════════════════════════╝',
      '',
      'Status: ACTIVE 🛡️',
      'Mode: STRICT',
      'Active Rules: 247',
      'Blocked IPs: 1,523',
      'Allowed Ports: 80, 443, 22',
      'Default Policy: DROP',
      '',
      'Protection Modules:',
      '  ✓ DDoS Protection: ENABLED',
      '  ✓ SQL Injection Filter: ENABLED',
      '  ✓ XSS Protection: ENABLED',
      '  ✓ Rate Limiting: ENABLED',
      '',
      'Recent Blocks (Last 5 min):',
      '  192.168.1.50  - SQL Injection attempt',
      '  10.0.0.123    - Port scanning detected',
      '  172.16.0.88   - DDoS attack blocked',
      '',
      '[SUCCESS] 防火墙运行正常'
    ],
    effect: { type: 'defense', targetNodeId: 2, color: '#00ff88' },
    targetNode: 2
  },
  'firewall block 192.168.1.50': {
    output: [
      '[*] Executing firewall block command',
      '[*] Target IP: 192.168.1.50',
      '',
      '[*] Adding DROP rule to iptables...',
      '[*] Updating firewall ruleset...',
      '[*] Syncing with IDS/IPS...',
      '',
      '[SUCCESS] IP address blocked successfully',
      '',
      'Firewall Rule Added:',
      '  Chain: INPUT',
      '  Source: 192.168.1.50',
      '  Action: DROP',
      '  Reason: SQL Injection Attack',
      '',
      '[INFO] 所有来自该IP的连接已被拒绝'
    ],
    effect: { type: 'block', targetNodeId: 2, color: '#00ff88' },
    targetNode: 2
  },
  'firewall rules': {
    output: [
      'Active Firewall Rules:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'INPUT Chain:',
      '  1. ACCEPT tcp -- 0.0.0.0/0  dpt:22 (SSH)',
      '  2. ACCEPT tcp -- 0.0.0.0/0  dpt:80 (HTTP)',
      '  3. ACCEPT tcp -- 0.0.0.0/0  dpt:443 (HTTPS)',
      '  4. DROP   all -- 192.168.1.50 (Blacklisted)',
      '  5. DROP   all -- 10.0.0.123 (Port Scanner)',
      '',
      'FORWARD Chain:',
      '  1. ACCEPT all -- 192.168.1.0/24',
      '  2. DROP   all -- 0.0.0.0/0',
      '',
      '[INFO] 共计12条活动规则'
    ],
    effect: { type: 'defense', targetNodeId: 2, color: '#00ff88' }
  },
  'ips detect': {
    output: [
      '[*] Starting Intrusion Prevention System...',
      '[*] Initializing detection engines...',
      '[*] Loading signature database (v2023.11.15)',
      '[*] Monitoring network traffic...',
      '',
      '╔════════════════════════════════════════╗',
      '║       THREAT DETECTION REPORT         ║',
      '╚════════════════════════════════════════╝',
      '',
      'Active Threats:',
      '  [CRITICAL] SQL Injection - 192.168.1.50',
      '            Target: /api/users?id=1',
      '            Payload: UNION SELECT',
      '',
      '  [HIGH]     XSS Attack - 10.0.0.123',
      '            Target: /search?q=<script>',
      '            Vector: Reflected XSS',
      '',
      '  [MEDIUM]   Port Scan - 172.16.0.88',
      '            Ports: 1-65535',
      '            Tool: Nmap',
      '',
      '  [LOW]      Suspicious User-Agent',
      '            Source: 192.168.1.77',
      '',
      '[*] Auto-blocking malicious IPs...',
      '[SUCCESS] 4 threats blocked automatically',
      '[INFO] 威胁已成功阻止'
    ],
    effect: { type: 'defense', targetNodeId: 2, color: '#00ff88' },
    targetNode: 2
  },
  'ips block 192.168.1.50': {
    output: [
      '[*] IPS Auto-Block Initiated',
      '[*] Threat Source: 192.168.1.50',
      '[*] Threat Type: SQL Injection',
      '',
      '[*] Executing countermeasures...',
      '  ✓ Firewall rule added',
      '  ✓ Connection terminated',
      '  ✓ IP blacklisted globally',
      '  ✓ Alert sent to SOC',
      '',
      '[SUCCESS] Threat neutralized',
      '[INFO] IPS持续监控中'
    ],
    effect: { type: 'block', targetNodeId: 2, color: '#00ff88' },
    targetNode: 2
  },
  'scan malware': {
    output: [
      '[*] Starting comprehensive malware scan...',
      '[*] Engine: ClamAV + Custom Signatures',
      '[*] Scanning system files...',
      '[*] Checking running processes...',
      '[*] Analyzing network connections...',
      '[*] Inspecting startup items...',
      '',
      'Progress: [████████████████████] 100%',
      '',
      '╔════════════════════════════════════════╗',
      '║         SCAN RESULTS                  ║',
      '╚════════════════════════════════════════╝',
      '',
      'Files scanned: 45,782',
      'Threats found: 3',
      'Time elapsed: 2m 18s',
      '',
      'Detected Threats:',
      '  [CRITICAL] Trojan.Generic.KD.1234',
      '            Location: /tmp/suspicious.exe',
      '            Action: QUARANTINED',
      '',
      '  [HIGH]     Backdoor.SSH.1',
      '            Location: /usr/bin/.hidden',
      '            Action: REMOVED',
      '',
      '  [MEDIUM]   Adware.Tracking',
      '            Location: /var/log/tracker.js',
      '            Action: CLEANED',
      '',
      '[SUCCESS] All threats eliminated',
      '[INFO] 系统已清理完毕'
    ],
    effect: { type: 'defense', targetNodeId: 3, color: '#00ff88' },
    targetNode: 3
  },
  'scan ports': {
    output: [
      '[*] Starting port security audit...',
      '[*] Target: localhost',
      '',
      'Open Ports Analysis:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '  ✓ Port 22  (SSH)       - SECURE',
      '           Key-based auth enabled',
      '           Root login disabled',
      '',
      '  ✓ Port 80  (HTTP)      - REDIRECT TO HTTPS',
      '           Auto-redirect configured',
      '',
      '  ✓ Port 443 (HTTPS)     - SECURE',
      '           TLS 1.3 enabled',
      '           Strong cipher suites',
      '',
      '  ⚠ Port 3306 (MySQL)    - WARNING',
      '           Exposed to internet',
      '           Recommend: Bind to localhost only',
      '',
      '[INFO] 1 security recommendation',
      '[SUCCESS] 端口扫描完成'
    ],
    effect: { type: 'defense', targetNodeId: 3, color: '#00ff88' }
  },
  'monitor traffic': {
    output: [
      '[*] Starting real-time traffic monitor...',
      '[*] Interface: eth0',
      '[*] Capturing packets...',
      '',
      '╔════════════════════════════════════════╗',
      '║    REAL-TIME TRAFFIC ANALYSIS         ║',
      '╚════════════════════════════════════════╝',
      '',
      'Network Statistics:',
      '  ↓ Incoming: 2.4 MB/s',
      '  ↑ Outgoing: 1.8 MB/s',
      '  Total Connections: 47',
      '  Suspicious: 2',
      '',
      'Top Connections:',
      '  ✓ 192.168.1.100 → 8.8.8.8:443     (HTTPS) - Google DNS',
      '  ✓ 192.168.1.100 → 1.1.1.1:53      (DNS) - Cloudflare',
      '  ✓ 192.168.1.100 → 140.82.114.4:443 (HTTPS) - GitHub',
      '',
      'Suspicious Activity:',
      '  ⚠ 192.168.1.50  → 192.168.1.100:3306 (MySQL)',
      '           Multiple failed login attempts',
      '           [ACTION] Connection logged and monitored',
      '',
      '  ⚠ 10.0.0.123    → 192.168.1.100:* (Multiple ports)',
      '           Port scanning detected',
      '           [ACTION] IP has been blocked',
      '',
      '[WARNING] 检测到可疑连接',
      '[INFO] 流量监控持续进行中'
    ],
    effect: { type: 'defense', targetNodeId: 2, color: '#00ff88' },
    targetNode: 2
  },
  'monitor logs': {
    output: [
      '[*] Analyzing system logs...',
      '[*] Sources: auth.log, syslog, apache2/access.log',
      '',
      'Security Events (Last 24h):',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '[CRITICAL] 15:23:41',
      '  Multiple SSH brute-force attempts',
      '  Source: 192.168.1.50',
      '  Status: BLOCKED',
      '',
      '[HIGH] 16:45:12',
      '  SQL injection attempt detected',
      '  Target: /api/users',
      '  Status: BLOCKED BY WAF',
      '',
      '[MEDIUM] 18:12:33',
      '  Unusual file access pattern',
      '  User: www-data',
      '  Files: /etc/passwd, /etc/shadow',
      '  Status: ALERTED',
      '',
      '[INFO] 21:30:45',
      '  System update completed',
      '  Packages: 24 upgraded',
      '',
      '[SUCCESS] 日志分析完成'
    ],
    effect: { type: 'defense', color: '#00ff88' }
  },
  'patch system': {
    output: [
      '[*] Checking for system updates...',
      '[*] Connecting to update servers...',
      '',
      'Available Security Patches:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '  [CRITICAL] CVE-2023-12345 - OpenSSH',
      '  [HIGH]     CVE-2023-54321 - Linux Kernel',
      '  [HIGH]     CVE-2023-98765 - Apache httpd',
      '  [MEDIUM]   CVE-2023-11111 - MySQL',
      '',
      '[*] Downloading patches...',
      '[*] Installing security updates...',
      '',
      'Progress: [████████████████████] 100%',
      '',
      '[SUCCESS] All patches installed successfully',
      '[INFO] System reboot recommended',
      '[INFO] 系统已更新至最新安全版本'
    ],
    effect: { type: 'defense', targetNodeId: 3, color: '#00ff88' },
    targetNode: 3
  },
  'backup database': {
    output: [
      '[*] Starting database backup...',
      '[*] Database: webapp_db',
      '[*] Backup method: Full dump',
      '',
      '[*] Creating snapshot...',
      '[*] Compressing data...',
      '[*] Encrypting backup file...',
      '',
      'Progress: [████████████████████] 100%',
      '',
      'Backup Details:',
      '  Size: 2.3 GB',
      '  Compression: gzip',
      '  Encryption: AES-256',
      '  Location: /backup/webapp_db_20231116.sql.gz.enc',
      '  Checksum: a3f7d8c9e2b4f1a6',
      '',
      '[SUCCESS] Database backup completed',
      '[INFO] Backup stored securely',
      '[INFO] 数据库已安全备份'
    ],
    effect: { type: 'defense', targetNodeId: 5, color: '#00ff88' },
    targetNode: 5
  },
  'encrypt data': {
    output: [
      '[*] Initializing encryption module...',
      '[*] Algorithm: AES-256-GCM',
      '[*] Key management: Hardware Security Module',
      '',
      'Encryption Tasks:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '  ✓ Database fields encrypted',
      '           - user passwords',
      '           - credit card numbers',
      '           - personal information',
      '',
      '  ✓ File system encryption enabled',
      '           - /var/www/uploads/*',
      '           - /home/*/sensitive/*',
      '',
      '  ✓ Backup encryption verified',
      '',
      '  ✓ Network traffic encryption (TLS 1.3)',
      '',
      '[SUCCESS] Data encryption completed',
      '[INFO] All sensitive data is now protected',
      '[INFO] 敏感数据已全部加密'
    ],
    effect: { type: 'defense', targetNodeId: 5, color: '#00ff88' },
    targetNode: 5
  },
  'audit security': {
    output: [
      '[*] Running comprehensive security audit...',
      '',
      '╔════════════════════════════════════════╗',
      '║      SECURITY AUDIT REPORT            ║',
      '╚════════════════════════════════════════╝',
      '',
      'System Hardening:',
      '  ✓ Firewall: ACTIVE',
      '  ✓ SELinux: ENFORCING',
      '  ✓ AppArmor: ENABLED',
      '  ✓ Fail2ban: ACTIVE',
      '',
      'Access Controls:',
      '  ✓ Password policy: STRONG',
      '  ✓ 2FA: ENABLED',
      '  ✓ SSH key auth: ENFORCED',
      '  ⚠ Some accounts have weak passwords',
      '',
      'Network Security:',
      '  ✓ HTTPS: ENABLED (TLS 1.3)',
      '  ✓ HSTS: ENABLED',
      '  ✓ Rate limiting: CONFIGURED',
      '  ✓ DDoS protection: ACTIVE',
      '',
      'Data Protection:',
      '  ✓ Encryption at rest: ENABLED',
      '  ✓ Encryption in transit: ENABLED',
      '  ✓ Backup: AUTOMATED',
      '',
      'Overall Security Score: 92/100',
      '',
      '[INFO] 1 recommendation for improvement',
      '[SUCCESS] 安全审计完成'
    ],
    effect: { type: 'defense', color: '#00ff88' }
  },
};

export function CyberDefenseTranslated() {
  const { t, language } = useLanguage();
  
  const [attackHistory, setAttackHistory] = useState<CommandHistory[]>([]);
  const [defenseHistory, setDefenseHistory] = useState<CommandHistory[]>([]);
  const [attackInput, setAttackInput] = useState('');
  const [defenseInput, setDefenseInput] = useState('');
  const [showHelp, setShowHelp] = useState(true);
  const [currentEffect, setCurrentEffect] = useState<NetworkEffect | null>(null);
  
  // Statistics
  const [attackStats, setAttackStats] = useState<Record<string, number>>({});
  const [defenseStats, setDefenseStats] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());
  
  // Network nodes state
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
    { id: 1, x: 10, y: 50, size: 8, type: 'client', label: language === 'zh' ? '攻击者' : 'Attacker', status: 'normal' },
    { id: 2, x: 35, y: 50, size: 10, type: 'firewall', label: language === 'zh' ? '防火墙' : 'Firewall', status: 'normal' },
    { id: 3, x: 60, y: 35, size: 12, type: 'server', label: language === 'zh' ? '目标服务器' : 'Target Server', status: 'normal' },
    { id: 4, x: 60, y: 65, size: 10, type: 'router', label: language === 'zh' ? '路由器' : 'Router', status: 'normal' },
    { id: 5, x: 85, y: 50, size: 10, type: 'database', label: language === 'zh' ? '数据库' : 'Database', status: 'normal' },
  ]);
  
  const attackEndRef = useRef<HTMLDivElement>(null);
  const defenseEndRef = useRef<HTMLDivElement>(null);
  const attackInputRef = useRef<HTMLInputElement>(null);
  const defenseInputRef = useRef<HTMLInputElement>(null);

  // Reset effect after animation
  useEffect(() => {
    if (currentEffect) {
      const timer = setTimeout(() => {
        setCurrentEffect(null);
        // Reset node status
        setNetworkNodes(prev => prev.map(node => ({ ...node, status: 'normal' })));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentEffect]);

  const executeAttackCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const normalizedCmd = cmd.trim().toLowerCase();

    let output: string[] = [];
    let effect: NetworkEffect | undefined;
    let targetNode: number | undefined;

    if (normalizedCmd === 'clear') {
      setAttackHistory([]);
      return;
    }

    // Update statistics
    const cmdType = normalizedCmd.split(' ')[0];
    if (cmdType !== 'help' && cmdType !== 'clear') {
      setAttackStats(prev => ({
        ...prev,
        [cmdType]: (prev[cmdType] || 0) + 1
      }));
    }

    // Check for exact matches first
    if (attackCommands[normalizedCmd]) {
      output = attackCommands[normalizedCmd].output;
      effect = attackCommands[normalizedCmd].effect;
      targetNode = attackCommands[normalizedCmd].targetNode;
    } else {
      // Check for partial matches
      const matchedKey = Object.keys(attackCommands).find(key => 
        normalizedCmd.startsWith(key.split(' ')[0])
      );
      
      if (matchedKey) {
        const baseCommand = matchedKey.split(' ')[0];
        if (attackCommands[baseCommand]) {
          output = attackCommands[baseCommand].output;
          effect = attackCommands[baseCommand].effect;
          targetNode = attackCommands[baseCommand].targetNode;
        }
      } else {
        output = [
          `Command not found: ${cmd}`,
          'Type "help" to see available commands',
        ];
      }
    }

    // Apply visual effect
    if (effect) {
      setCurrentEffect(effect);
      if (targetNode) {
        setNetworkNodes(prev => prev.map(node => 
          node.id === targetNode ? { ...node, status: 'danger' } : node
        ));
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
    let effect: NetworkEffect | undefined;
    let targetNode: number | undefined;

    if (normalizedCmd === 'clear') {
      setDefenseHistory([]);
      return;
    }

    // Update statistics
    const cmdType = normalizedCmd.split(' ')[0];
    if (cmdType !== 'help' && cmdType !== 'clear') {
      setDefenseStats(prev => ({
        ...prev,
        [cmdType]: (prev[cmdType] || 0) + 1
      }));
    }

    // Check for exact matches first
    if (defenseCommands[normalizedCmd]) {
      output = defenseCommands[normalizedCmd].output;
      effect = defenseCommands[normalizedCmd].effect;
      targetNode = defenseCommands[normalizedCmd].targetNode;
    } else {
      // Check for partial matches
      const matchedKey = Object.keys(defenseCommands).find(key => 
        normalizedCmd.startsWith(key.split(' ')[0])
      );
      
      if (matchedKey) {
        const baseCommand = matchedKey.split(' ')[0];
        if (defenseCommands[baseCommand]) {
          output = defenseCommands[baseCommand].output;
          effect = defenseCommands[baseCommand].effect;
          targetNode = defenseCommands[baseCommand].targetNode;
        }
      } else {
        output = [
          `Command not found: ${cmd}`,
          'Type "help" to see available commands',
        ];
      }
    }

    // Apply visual effect
    if (effect) {
      setCurrentEffect(effect);
      if (targetNode) {
        setNetworkNodes(prev => prev.map(node => 
          node.id === targetNode ? { ...node, status: 'protected' } : node
        ));
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

  const getNodeColor = (node: NetworkNode) => {
    if (currentEffect) {
      if (currentEffect.targetNodeId === node.id) {
        if (currentEffect.type === 'attack' || currentEffect.type === 'exploit') {
          return '#ff0055';
        } else if (currentEffect.type === 'defense' || currentEffect.type === 'block') {
          return '#00ff88';
        } else if (currentEffect.type === 'scan') {
          return '#ffa500';
        }
      }
    }
    
    switch (node.status) {
      case 'danger':
        return '#ff0055';
      case 'warning':
        return '#ffa500';
      case 'protected':
        return '#00ff88';
      default:
        return '#00f0ff';
    }
  };

  const getConnectionColor = () => {
    if (!currentEffect) return 'rgba(0, 240, 255, 0.3)';
    return currentEffect.color + '99'; // Add alpha
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-12 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-20 bg-[#00FF88]/50" />
            <Swords className="w-6 h-6 text-[#00FF88]" />
            <div className="h-px w-20 bg-[#00FF88]/50" />
          </div>

          <h1 className="font-mono text-5xl md:text-6xl mb-4 text-[#00FF88] tracking-wider" style={{ textShadow: '0 0 30px rgba(0, 255, 136, 0.5)' }}>
            {t('defense.hero.title')}
          </h1>
          <p className="font-mono text-xl text-[#00FF88]/70 mb-2">
            {t('defense.hero.desc')}
          </p>
          <motion.div
            className="font-mono text-sm text-[#00FF88]/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>█</span> {language === 'zh' ? '实战系统就绪' : 'COMBAT_SYSTEM_READY'}
          </motion.div>
        </motion.div>

        {/* Network Visualization */}
        <motion.div
          className="bg-[#0A0A0A] border-2 border-[#00FF88] p-8 mb-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 cyber-grid opacity-5" />
          
          {/* Network Nodes */}
          <div className="relative h-80">
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
                    stroke={getConnectionColor()}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0.3 }}
                    animate={{ 
                      pathLength: 1,
                      opacity: currentEffect ? 0.8 : 0.3,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                ))
              )}

              {/* Nodes */}
              {networkNodes.map((node) => (
                <g key={node.id}>
                  {/* Main node circle */}
                  <motion.circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={node.size}
                    fill={getNodeColor(node)}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: currentEffect?.targetNodeId === node.id ? [1, 1.3, 1] : 1,
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ 
                      scale: { duration: 0.5 },
                      opacity: { duration: 2, repeat: Infinity }
                    }}
                  />
                  
                  {/* Pulse effect for active nodes */}
                  {currentEffect?.targetNodeId === node.id && (
                    <>
                      <motion.circle
                        cx={`${node.x}%`}
                        cy={`${node.y}%`}
                        r={node.size + 8}
                        fill="none"
                        stroke={currentEffect.color}
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.circle
                        cx={`${node.x}%`}
                        cy={`${node.y}%`}
                        r={node.size + 5}
                        fill="none"
                        stroke={currentEffect.color}
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                      />
                    </>
                  )}
                  
                  {/* Node label */}
                  <text
                    x={`${node.x}%`}
                    y={`${node.y - 15}%`}
                    textAnchor="middle"
                    className="font-mono text-[10px] fill-[#00FF88]"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
              
              {/* Attack/Defense indicator */}
              {currentEffect && currentEffect.sourceNodeId && currentEffect.targetNodeId && (
                <motion.line
                  x1={`${networkNodes.find(n => n.id === currentEffect.sourceNodeId)?.x}%`}
                  y1={`${networkNodes.find(n => n.id === currentEffect.sourceNodeId)?.y}%`}
                  x2={`${networkNodes.find(n => n.id === currentEffect.targetNodeId)?.x}%`}
                  y2={`${networkNodes.find(n => n.id === currentEffect.targetNodeId)?.y}%`}
                  stroke={currentEffect.color}
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </svg>

            {/* Center Status */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <motion.div
                animate={{ 
                  scale: currentEffect ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {currentEffect ? (
                  currentEffect.type === 'defense' || currentEffect.type === 'block' ? (
                    <Shield className="w-12 h-12 text-[#00FF88] mx-auto mb-2" />
                  ) : (
                    <Zap className="w-12 h-12 text-[#ff0055] mx-auto mb-2" />
                  )
                ) : (
                  <Activity className="w-10 h-10 text-[#00FF88] mx-auto mb-2 opacity-50" />
                )}
              </motion.div>
              <p className="font-mono text-sm text-[#00FF88]/70">
                {t('defense.network.monitor')}
              </p>
              {currentEffect && (
                <motion.p
                  className={`font-mono text-xs mt-1 ${
                    currentEffect.type === 'defense' || currentEffect.type === 'block' 
                      ? 'text-[#00FF88]' 
                      : 'text-[#ff0055]'
                  }`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {currentEffect.type === 'defense' || currentEffect.type === 'block' 
                    ? `🛡️ ${t('defense.network.defense')}` 
                    : `🔴 ${t('defense.network.attack')}`}
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Help Banner */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              className="bg-[#0A0A0A] border-2 border-[#00FF88] p-4 mb-6 relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-mono text-sm text-[#00FF88] mb-2">
                    💡 <strong>{t('defense.tip.title')}:</strong> {t('defense.tip.desc')}
                  </p>
                  <p className="font-mono text-xs text-[#00FF88]/70">
                    {t('defense.tip.help')} <code className="text-[#00FF88] bg-black/50 px-1">help</code> {t('defense.tip.help2')}
                  </p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-[#00FF88]/70 hover:text-[#00FF88]"
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
            className="bg-[#0A0A0A] border-2 border-[#ff0055] overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Header */}
            <div className="bg-[#ff0055]/10 border-b-2 border-[#ff0055] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="w-5 h-5 text-[#ff0055]" />
                <span className="font-mono text-[#ff0055] tracking-wider">{t('defense.attack.terminal')}</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#ff0055]"></div>
                <div className="w-3 h-3 bg-[#ffa500]"></div>
                <div className="w-3 h-3 bg-[#00ff88]"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              className="bg-black p-4 h-[500px] overflow-y-auto font-mono text-sm custom-scrollbar"
              onClick={() => attackInputRef.current?.focus()}
            >
              {/* Welcome Message */}
              <div className="text-[#ff0055] mb-4">
                <p>╔═══════════════════════════════════════╗</p>
                <p>║   ATTACK SIMULATION TERMINAL v3.0    ║</p>
                <p>╚═══════════════════════════════════════╝</p>
                <p className="mt-2 text-[#ff0055]/70">Type 'help' for available commands</p>
                <p className="text-[#ff0055]/30">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
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
                    <span className="text-[#ff0055]">attacker@cyber</span>
                    <span className="text-[#ff0055]/30">~</span>
                    <span className="text-[#ff0055]">$</span>
                    <span className="text-[#00FF88]">{item.command}</span>
                  </div>
                  <div className="ml-4">
                    {item.output.map((line, i) => (
                      <div key={i} className={
                        line.includes('[SUCCESS]') || line.includes('[+]') ? 'text-[#00ff88]' :
                        line.includes('[CRITICAL]') || line.includes('[WARNING]') ? 'text-[#ffa500]' :
                        line.includes('[ERROR]') ? 'text-[#ff0055]' :
                        line.includes('[INFO]') ? 'text-[#00f0ff]' :
                        'text-[#00FF88]/60'
                      }>
                        {line}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-[#ff0055]">attacker@cyber</span>
                <span className="text-[#ff0055]/30">~</span>
                <span className="text-[#ff0055]">$</span>
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
                  className="flex-1 bg-transparent outline-none text-[#00FF88] font-mono"
                  placeholder={t('defense.input.placeholder.attack')}
                  autoFocus
                />
              </div>

              <div ref={attackEndRef} />
            </div>
          </motion.div>

          {/* Defense Terminal */}
          <motion.div
            className="bg-[#0A0A0A] border-2 border-[#00FF88] overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Header */}
            <div className="bg-[#00FF88]/10 border-b-2 border-[#00FF88] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#00FF88]" />
                <span className="font-mono text-[#00FF88] tracking-wider">{t('defense.defense.terminal')}</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#ff0055]"></div>
                <div className="w-3 h-3 bg-[#ffa500]"></div>
                <div className="w-3 h-3 bg-[#00ff88]"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div 
              className="bg-black p-4 h-[500px] overflow-y-auto font-mono text-sm custom-scrollbar"
              onClick={() => defenseInputRef.current?.focus()}
            >
              {/* Welcome Message */}
              <div className="text-[#00FF88] mb-4">
                <p>╔═══════════════════════════════════════╗</p>
                <p>║   DEFENSE SYSTEM TERMINAL v3.0       ║</p>
                <p>╚═══════════════════════════════════════╝</p>
                <p className="mt-2 text-[#00FF88]/70">Type 'help' for available commands</p>
                <p className="text-[#00FF88]/30">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
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
                    <span className="text-[#00FF88]">defender@cyber</span>
                    <span className="text-[#00FF88]/30">~</span>
                    <span className="text-[#00FF88]">$</span>
                    <span className="text-[#00f0ff]">{item.command}</span>
                  </div>
                  <div className="ml-4">
                    {item.output.map((line, i) => (
                      <div key={i} className={
                        line.includes('[SUCCESS]') || line.includes('[+]') || line.includes('✓') ? 'text-[#00ff88]' :
                        line.includes('[CRITICAL]') || line.includes('[HIGH]') ? 'text-[#ff0055]' :
                        line.includes('[WARNING]') || line.includes('[MEDIUM]') || line.includes('⚠') ? 'text-[#ffa500]' :
                        line.includes('[INFO]') ? 'text-[#00f0ff]' :
                        line.includes('[LOW]') ? 'text-[#00FF88]/40' :
                        'text-[#00FF88]/60'
                      }>
                        {line}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-[#00FF88]">defender@cyber</span>
                <span className="text-[#00FF88]/30">~</span>
                <span className="text-[#00FF88]">$</span>
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
                  className="flex-1 bg-transparent outline-none text-[#00f0ff] font-mono"
                  placeholder={t('defense.input.placeholder.defense')}
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
          <div className="bg-[#0A0A0A] border-2 border-[#ff0055] p-4">
            <h3 className="font-mono text-lg text-[#ff0055] mb-3 flex items-center gap-2 tracking-wider">
              <Terminal className="w-5 h-5" />
              {t('defense.attack.quick')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['nmap 192.168.1.100', 'sqlmap http://target.com/login.php?id=1', 'nikto -h http://target.com', 'hydra -l admin -P /wordlist.txt ssh://192.168.1.100', 'metasploit ms17-010', 'wireshark'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setAttackInput(cmd);
                    attackInputRef.current?.focus();
                  }}
                  className="text-left px-3 py-2 bg-[#ff0055]/10 border border-[#ff0055]/30 hover:border-[#ff0055] hover:bg-[#ff0055]/20 transition-all font-mono text-xs text-[#00FF88]"
                >
                  {cmd.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Defense Quick Commands */}
          <div className="bg-[#0A0A0A] border-2 border-[#00FF88] p-4">
            <h3 className="font-mono text-lg text-[#00FF88] mb-3 flex items-center gap-2 tracking-wider">
              <Terminal className="w-5 h-5" />
              {t('defense.defense.quick')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['firewall status', 'ips detect', 'scan malware', 'monitor traffic', 'patch system', 'audit security'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setDefenseInput(cmd);
                    defenseInputRef.current?.focus();
                  }}
                  className="text-left px-3 py-2 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs text-[#00f0ff]"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          className="bg-[#0A0A0A] border-2 border-[#00FF88] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-mono text-2xl text-[#00FF88] mb-6 flex items-center gap-2 tracking-wider">
            <Activity className="w-6 h-6" />
            {language === 'zh' ? '[实战统计仪表盘]' : '[COMBAT_STATISTICS_DASHBOARD]'}
          </h3>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-black/50 border border-[#00FF88]/30 p-4">
              <div className="font-mono text-xs text-[#00FF88]/60 mb-1">
                {language === 'zh' ? '攻击命令' : 'ATTACK_COMMANDS'}
              </div>
              <div className="font-mono text-3xl text-[#ff0055]">
                {attackHistory.length}
              </div>
            </div>
            
            <div className="bg-black/50 border border-[#00FF88]/30 p-4">
              <div className="font-mono text-xs text-[#00FF88]/60 mb-1">
                {language === 'zh' ? '防御命令' : 'DEFENSE_COMMANDS'}
              </div>
              <div className="font-mono text-3xl text-[#00FF88]">
                {defenseHistory.length}
              </div>
            </div>

            <div className="bg-black/50 border border-[#00FF88]/30 p-4">
              <div className="font-mono text-xs text-[#00FF88]/60 mb-1">
                {language === 'zh' ? '总命令数' : 'TOTAL_COMMANDS'}
              </div>
              <div className="font-mono text-3xl text-[#00f0ff]">
                {attackHistory.length + defenseHistory.length}
              </div>
            </div>

            <div className="bg-black/50 border border-[#00FF88]/30 p-4">
              <div className="font-mono text-xs text-[#00FF88]/60 mb-1">
                {language === 'zh' ? '会话时长' : 'SESSION_TIME'}
              </div>
              <div className="font-mono text-3xl text-[#ffa500]">
                {Math.floor((Date.now() - sessionStartTime) / 60000)}
                <span className="text-lg text-[#00FF88]/60">m</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attack Command Stats */}
            <div>
              <h4 className="font-mono text-lg text-[#ff0055] mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5" />
                {language === 'zh' ? '攻击工具使用统计' : 'ATTACK_TOOLS_USAGE'}
              </h4>
              <div className="bg-black/50 border border-[#ff0055]/30 p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {Object.keys(attackStats).length > 0 ? (
                  Object.entries(attackStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cmd, count]) => (
                      <div key={cmd} className="flex items-center justify-between">
                        <span className="font-mono text-sm text-[#00FF88]/80">{cmd}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-black relative">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-[#ff0055]"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(count / Math.max(...Object.values(attackStats))) * 100}%` 
                              }}
                              transition={{ duration: 0.5 }}
                              style={{ boxShadow: '0 0 10px rgba(255, 0, 85, 0.5)' }}
                            />
                          </div>
                          <span className="font-mono text-sm text-[#ff0055] w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 font-mono text-sm text-[#00FF88]/40">
                    {language === 'zh' ? '暂无攻击命令记录' : 'NO_ATTACK_COMMANDS_YET'}
                  </div>
                )}
              </div>
            </div>

            {/* Defense Command Stats */}
            <div>
              <h4 className="font-mono text-lg text-[#00FF88] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {language === 'zh' ? '防御工具使用统计' : 'DEFENSE_TOOLS_USAGE'}
              </h4>
              <div className="bg-black/50 border border-[#00FF88]/30 p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {Object.keys(defenseStats).length > 0 ? (
                  Object.entries(defenseStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cmd, count]) => (
                      <div key={cmd} className="flex items-center justify-between">
                        <span className="font-mono text-sm text-[#00FF88]/80">{cmd}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-black relative">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-[#00FF88]"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${(count / Math.max(...Object.values(defenseStats))) * 100}%` 
                              }}
                              transition={{ duration: 0.5 }}
                              style={{ boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)' }}
                            />
                          </div>
                          <span className="font-mono text-sm text-[#00FF88] w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 font-mono text-sm text-[#00FF88]/40">
                    {language === 'zh' ? '暂无防御命令记录' : 'NO_DEFENSE_COMMANDS_YET'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}