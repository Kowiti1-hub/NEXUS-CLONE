import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Delete, X, Shield, Cpu, Database, MessageSquare, AppWindow, Wifi, Bluetooth, Radio } from 'lucide-react';

type CloneState = 'targeting' | 'ready' | 'cloning' | 'completed';
type TargetType = 'number' | 'model' | 'radio';
type RadioType = 'wifi' | 'bluetooth';

const PacketFlow = ({ type }: { type: TargetType | RadioType }) => {
  const Icon = type === 'wifi' ? Wifi : type === 'bluetooth' ? Bluetooth : Radio;
  
  return (
    <div className="relative w-full h-24 border border-[#00ff41]/10 bg-black/40 rounded flex items-center justify-between px-8 overflow-hidden">
      <div className="flex flex-col items-center gap-1 z-10">
        <div className="w-10 h-10 rounded-full border border-[#00ff41]/30 flex items-center justify-center bg-[#00ff41]/5">
          <Database className="w-5 h-5 opacity-60" />
        </div>
        <span className="text-[8px] opacity-40 uppercase tracking-tighter">Target</span>
      </div>

      <div className="flex-1 relative h-full flex items-center justify-center">
        {/* Animated Packets */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00ff41] rounded-full shadow-[0_0_8px_#00ff41]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: 100, 
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Radio Wave Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          {[1, 1.5, 2].map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: s * 1.5, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
              className="absolute w-16 h-16 border border-[#00ff41] rounded-full"
            />
          ))}
        </div>
        
        <div className="flex flex-col items-center z-10 bg-black/60 px-3 py-1 rounded-full border border-[#00ff41]/10">
          <Icon className="w-3 h-3 text-[#00ff41] animate-pulse" />
          <span className="text-[6px] mt-0.5 opacity-50 uppercase tracking-[0.2em]">{type}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 z-10">
        <div className="w-10 h-10 rounded-full border border-[#00ff41]/30 flex items-center justify-center bg-[#00ff41]/5">
          <Shield className="w-5 h-5 text-[#00ff41]" />
        </div>
        <span className="text-[8px] opacity-40 uppercase tracking-tighter">Nexus</span>
      </div>
    </div>
  );
};

export default function NexusCloneSystem() {
  const [state, setState] = useState<CloneState>('targeting');
  const [targetType, setTargetType] = useState<TargetType>('number');
  const [radioType, setRadioType] = useState<RadioType>('wifi');
  const [targetValue, setTargetValue] = useState('');
  const [dialed, setDialed] = useState('');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const isValidPhone = (phone: string) => {
    // Basic regex for phone validation: allows +, digits, spaces, (), -
    // Requires at least 7 digits
    const digitCount = (phone.match(/\d/g) || []).length;
    return digitCount >= 7 && /^\+?[\d\s\-\(\)]+$/.test(phone);
  };

  const formatPhoneNumber = (value: string) => {
    // Simple auto-formatter for +1 (XXX) XXX-XXXX
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
  };

  const MODELS = [
    { name: 'iPhone 15 Pro Max', origin: 'USA' },
    { name: 'Google Pixel 8 Pro', origin: 'USA' },
    { name: 'Motorola Edge 50', origin: 'USA' },
    { name: 'Samsung Galaxy S24', origin: 'S. KOREA' },
    { name: 'Xiaomi 14 Ultra', origin: 'CHINA' },
    { name: 'Huawei Mate 60 Pro', origin: 'CHINA' },
    { name: 'OnePlus 12', origin: 'CHINA' },
    { name: 'Oppo Find X7', origin: 'CHINA' },
    { name: 'VSmart Aris Pro', origin: 'VIETNAM' },
    { name: 'Bphone B86', origin: 'VIETNAM' },
    { name: 'Sony Xperia 1 VI', origin: 'JAPAN' },
    { name: 'Sharp Aquos R8', origin: 'JAPAN' },
    { name: 'ASUS ROG Phone 8', origin: 'TAIWAN' },
    { name: 'Nothing Phone (2)', origin: 'UK' },
    { name: 'Nokia G42', origin: 'FINLAND' },
    { name: 'Fairphone 5', origin: 'NETHERLANDS' }
  ];

  const WIFI_NETWORKS = [
    'Starbucks_Guest_WiFi',
    'Airport_Free_HighSpeed',
    'Corporate_Secure_Net',
    'Home_Network_5G',
    'Public_Library_Access'
  ];

  const BT_DEVICES = [
    'Bose QuietComfort 45',
    'Tesla Model 3 BT',
    'SmartWatch_X2',
    'Unknown_Device_88AF',
    'JBL_Flip_6'
  ];

  const KEYPAD = [
    ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
    ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
    ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
    ['*', ''], ['0', '+'], ['#', '']
  ];

  const handleKeyPress = (num: string) => {
    if (state !== 'ready') return;
    const newDialed = dialed + num;
    setDialed(newDialed);

    // "CLONE" is 25663
    if (newDialed.includes('25663')) {
      startCloning();
    }
  };

  const startCloning = () => {
    setState('cloning');
    const method = targetType === 'radio' ? radioType.toUpperCase() : targetType.toUpperCase();
    setLogs([
      `Target identified: ${targetValue}`,
      `Link Protocol: ${method} WAVE`,
      'Initializing secure link...', 
      'Bypassing encryption layers...', 
      'Establishing peer-to-peer tunnel...'
    ]);
  };

  const selectTarget = (value: string) => {
    setTargetValue(value);
    setState('ready');
  };

  useEffect(() => {
    if (state === 'cloning') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setState('completed'), 1000);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 200);

      const logInterval = setInterval(() => {
        const newLogs = [
          'Extracting SMS database...',
          'Cloning application binaries...',
          'Decrypting secure enclaves...',
          'Mapping file system...',
          'Syncing media assets...',
          'Finalizing data integrity check...'
        ];
        setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(-5));
      }, 1500);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [state]);

  const reset = () => {
    setState('targeting');
    setTargetValue('');
    setDialed('');
    setProgress(0);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00ff41 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="w-full max-w-4xl relative z-10">
        <header className="mb-8 border-b border-[#00ff41]/30 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
              <Shield className="w-8 h-8" />
              NEXUS CLONE SYSTEM v4.0
            </h1>
            <p className="text-xs opacity-60 mt-1 uppercase tracking-widest">Authorized Access Only // Secure Terminal</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs">STATUS: <span className={state === 'cloning' ? 'animate-pulse text-red-500' : ''}>{state.toUpperCase()}</span></p>
            <p className="text-[10px] opacity-40">TARGET: {targetValue || 'NONE'}</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {state === 'targeting' ? (
            <motion.div 
              key="targeting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-8 max-w-2xl mx-auto w-full"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold tracking-widest uppercase">Target Acquisition</h2>
                <p className="text-xs opacity-40">Select identification protocol to proceed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setTargetType('number')}
                  className={`p-4 border transition-all text-left space-y-3 ${targetType === 'number' ? 'border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_15px_rgba(0,255,65,0.2)]' : 'border-[#00ff41]/20 hover:border-[#00ff41]/50 bg-black/40'}`}
                >
                  <Phone className={`w-6 h-6 ${targetType === 'number' ? 'text-[#00ff41]' : 'opacity-40'}`} />
                  <div>
                    <h3 className="font-bold text-[11px]">PHONE NUMBER</h3>
                    <p className="text-[9px] opacity-40">Cellular link</p>
                  </div>
                </button>

                <button 
                  onClick={() => setTargetType('model')}
                  className={`p-4 border transition-all text-left space-y-3 ${targetType === 'model' ? 'border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_15px_rgba(0,255,65,0.2)]' : 'border-[#00ff41]/20 hover:border-[#00ff41]/50 bg-black/40'}`}
                >
                  <Cpu className={`w-6 h-6 ${targetType === 'model' ? 'text-[#00ff41]' : 'opacity-40'}`} />
                  <div>
                    <h3 className="font-bold text-[11px]">DEVICE MODEL</h3>
                    <p className="text-[9px] opacity-40">Hardware signature</p>
                  </div>
                </button>

                <button 
                  onClick={() => setTargetType('radio')}
                  className={`p-4 border transition-all text-left space-y-3 ${targetType === 'radio' ? 'border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_15px_rgba(0,255,65,0.2)]' : 'border-[#00ff41]/20 hover:border-[#00ff41]/50 bg-black/40'}`}
                >
                  <Radio className={`w-6 h-6 ${targetType === 'radio' ? 'text-[#00ff41]' : 'opacity-40'}`} />
                  <div>
                    <h3 className="font-bold text-[11px]">RADIO WAVE</h3>
                    <p className="text-[9px] opacity-40">WiFi / Bluetooth</p>
                  </div>
                </button>
              </div>

              <div className="mt-8">
                {targetType === 'number' ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="tel"
                        placeholder="+1 (___) ___-____"
                        className={`w-full bg-black/60 border p-4 text-center text-xl tracking-[0.2em] focus:outline-none transition-colors ${targetValue && !isValidPhone(targetValue) ? 'border-red-500 text-red-500' : 'border-[#00ff41]/30 focus:border-[#00ff41]'}`}
                        onChange={(e) => setTargetValue(formatPhoneNumber(e.target.value))}
                        value={targetValue}
                      />
                      {targetValue && !isValidPhone(targetValue) && (
                        <p className="text-[10px] text-red-500 mt-2 text-center uppercase tracking-widest animate-pulse">Invalid Protocol Format</p>
                      )}
                    </div>
                    <button 
                      disabled={!isValidPhone(targetValue)}
                      onClick={() => setState('ready')}
                      className="w-full py-4 bg-[#00ff41] text-black font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-[#00ff41]/80 transition-colors"
                    >
                      Initialize Link
                    </button>
                  </div>
                ) : targetType === 'model' ? (
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {MODELS.map((model) => (
                      <button 
                        key={model.name}
                        onClick={() => selectTarget(model.name)}
                        className="p-3 border border-[#00ff41]/20 text-[10px] text-left hover:bg-[#00ff41]/10 hover:border-[#00ff41]/50 transition-all uppercase tracking-tighter group flex flex-col justify-between h-16"
                      >
                        <span className="font-bold group-hover:text-white">{model.name}</span>
                        <span className="text-[8px] opacity-30 group-hover:opacity-60 self-end">ORIGIN: {model.origin}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setRadioType('wifi')}
                        className={`flex-1 p-3 border flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${radioType === 'wifi' ? 'border-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/20 opacity-40'}`}
                      >
                        <Wifi className="w-4 h-4" /> WIFI
                      </button>
                      <button 
                        onClick={() => setRadioType('bluetooth')}
                        className={`flex-1 p-3 border flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${radioType === 'bluetooth' ? 'border-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/20 opacity-40'}`}
                      >
                        <Bluetooth className="w-4 h-4" /> BLUETOOTH
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {(radioType === 'wifi' ? WIFI_NETWORKS : BT_DEVICES).map((item) => (
                        <button 
                          key={item}
                          onClick={() => selectTarget(item)}
                          className="p-3 border border-[#00ff41]/10 bg-black/40 text-[10px] text-left hover:bg-[#00ff41]/10 hover:border-[#00ff41]/30 transition-all flex justify-between items-center group"
                        >
                          <span className="group-hover:text-white">{item}</span>
                          <span className="text-[8px] opacity-30 uppercase">{radioType === 'wifi' ? 'SSID' : 'MAC_ADDR'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : state === 'ready' ? (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, y: 20, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 text-center">
                <div className="text-[10px] opacity-40 uppercase tracking-[0.3em] mb-2">Target Locked</div>
                <div className="text-xl font-bold text-white mb-8 border-b border-[#00ff41]/20 pb-2 inline-block px-8">
                  {targetValue}
                </div>
                
                <div className="h-16 flex items-center justify-center text-5xl font-bold tracking-[0.2em] text-white">
                  {dialed || <span className="opacity-20 animate-pulse">_ _ _ _ _</span>}
                </div>
                <p className="text-xs mt-4 opacity-40 uppercase tracking-widest">Dial &apos;CLONE&apos; (25663) to execute</p>
              </div>

              <div className="grid grid-cols-3 gap-6 md:gap-8">
                {KEYPAD.map(([num, letters]) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#00ff41]/20 flex flex-col items-center justify-center hover:bg-[#00ff41]/10 transition-colors group active:scale-95"
                  >
                    <span className="text-3xl font-bold group-hover:text-white">{num}</span>
                    <span className="text-[10px] opacity-40 group-hover:opacity-100">{letters}</span>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex gap-8">
                <button 
                  onClick={() => setDialed('')}
                  className="p-4 rounded-full border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <button 
                  className="w-16 h-16 rounded-full bg-[#00ff41] text-black flex items-center justify-center hover:bg-[#00ff41]/80 transition-transform active:scale-90"
                  onClick={() => handleKeyPress('')}
                >
                  <Phone className="w-8 h-8 fill-current" />
                </button>
                <button 
                  onClick={() => setDialed(prev => prev.slice(0, -1))}
                  className="p-4 rounded-full border border-[#00ff41]/30 hover:bg-[#00ff41]/10 transition-colors"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ) : state === 'cloning' ? (
            <motion.div 
              key="cloning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="relative h-2 bg-[#00ff41]/10 rounded-full overflow-hidden border border-[#00ff41]/20">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <PacketFlow type={targetType === 'radio' ? radioType : targetType} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-[#00ff41]/20 p-6 bg-[#00ff41]/5 rounded-lg">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 animate-spin" />
                    SYSTEM LOGS
                  </h3>
                  <div className="space-y-2 h-48 overflow-hidden">
                    {logs.map((log, i) => (
                      <motion.p 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i} 
                        className="text-[11px] opacity-70"
                      >
                        {`> [${new Date().toLocaleTimeString()}] ${log}`}
                      </motion.p>
                    ))}
                  </div>
                </div>

                <div className="border border-[#00ff41]/20 p-6 bg-[#00ff41]/5 rounded-lg flex flex-col items-center justify-center text-center">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-[#00ff41]/10"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray="377"
                        initial={{ strokeDashoffset: 377 }}
                        animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
                        className="text-[#00ff41]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                      {Math.round(progress)}%
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Extracting Data Packets</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-6 h-6 text-[#00ff41]" />
                  EXTRACTION COMPLETE
                </h2>
                <button 
                  onClick={reset}
                  className="text-[10px] border border-[#00ff41]/30 px-3 py-1 hover:bg-[#00ff41]/10"
                >
                  NEW SESSION
                </button>
              </div>

              <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 p-4 rounded mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] opacity-40 uppercase tracking-widest">Source Device</p>
                  <p className="text-lg font-bold text-white">{targetValue}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-40 uppercase tracking-widest">Status</p>
                  <p className="text-xs font-bold text-[#00ff41]">MIRRORED & SECURED</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#00ff41]/20 p-4 rounded bg-[#00ff41]/5">
                  <h3 className="text-xs font-bold mb-3 flex items-center gap-2 opacity-60">
                    <MessageSquare className="w-4 h-4" />
                    RECENT MESSAGES
                  </h3>
                  <div className="space-y-3">
                    {[
                      { from: '+1 (555) 012-3456', text: 'The package has been delivered to the drop point.' },
                      { from: 'Bank Alert', text: 'Your account ending in 4492 has a new login.' },
                      { from: 'Unknown', text: 'Meet at the usual spot at 22:00.' }
                    ].map((msg, i) => (
                      <div key={i} className="border-l-2 border-[#00ff41]/30 pl-3 py-1">
                        <p className="text-[10px] font-bold text-[#00ff41]">{msg.from}</p>
                        <p className="text-[11px] text-white/80">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-[#00ff41]/20 p-4 rounded bg-[#00ff41]/5">
                  <h3 className="text-xs font-bold mb-3 flex items-center gap-2 opacity-60">
                    <AppWindow className="w-4 h-4" />
                    CLONED APPLICATIONS
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'Signal', version: 'v5.2.1', status: 'ACTIVE' },
                      { name: 'WhatsApp', version: 'v2.24.1', status: 'ACTIVE' },
                      { name: 'Telegram', version: 'v10.3.0', status: 'ACTIVE' },
                      { name: 'Banking App', version: 'v4.0.2', status: 'ENCRYPTED' },
                      { name: 'Notes', version: 'v1.0.0', status: 'ACTIVE' },
                      { name: 'Photos', version: 'v3.5.1', status: 'MIRRORED' }
                    ].map((app, i) => (
                      <div 
                        key={i} 
                        className="p-3 border border-[#00ff41]/10 bg-black/40 rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41]/30 transition-all group cursor-default"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
                          <p className="text-[11px] font-bold text-white group-hover:text-[#00ff41] transition-colors">{app.name}</p>
                        </div>
                        <div className="flex items-center justify-between pl-[1.125rem]">
                          <p className="text-[9px] opacity-40 uppercase tracking-tighter">{app.version}</p>
                          <span className="text-[8px] px-1.5 py-0.5 border border-[#00ff41]/20 rounded text-[#00ff41] opacity-60 group-hover:opacity-100 transition-opacity">
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-[#00ff41]/20 p-4 rounded bg-[#00ff41]/5">
                <h3 className="text-xs font-bold mb-2 opacity-60 uppercase tracking-widest">Security Analysis</h3>
                <p className="text-[11px] leading-relaxed">
                  Target device successfully mirrored. All application states preserved. 
                  End-to-end encryption bypassed via Nexus Tunnel. 
                  Session tokens harvested and active.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 pt-4 border-t border-[#00ff41]/10 flex justify-between text-[10px] opacity-30">
          <p>© 2026 NEXUS CYBERNETICS CORP</p>
          <p>ENCRYPTION: AES-256-GCM // PROTOCOL: NX-7</p>
        </footer>
      </div>
    </div>
  );
}
