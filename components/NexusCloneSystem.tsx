import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Delete, X, Shield, Cpu, Database, MessageSquare, AppWindow, Wifi, Bluetooth, Radio, Activity, Lock, Unlock, FileText, ChevronRight, AlertTriangle, ClipboardPaste, Search, Filter, ChevronDown } from 'lucide-react';

type CloneState = 'targeting' | 'ready' | 'cloning' | 'completed' | 'failed';
type TargetType = 'number' | 'model' | 'radio';
type RadioType = 'wifi' | 'bluetooth';

const PacketFlow = ({ type, progress }: { type: TargetType | RadioType, progress: number }) => {
  const Icon = type === 'wifi' ? Wifi : type === 'bluetooth' ? Bluetooth : Radio;
  const speed = 1.5 - (progress / 100) * 1; // Speed up as progress increases
  
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
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00ff41] rounded-full shadow-[0_0_8px_#00ff41]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: 100, 
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: i * (speed / 12),
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

const DataStreamBackground = ({ active }: { active: boolean }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {[...Array(20)].map((_, i) => {
        const top = (i * 5) + (i % 3); // Deterministic distribution
        const width = 50 + (i * 10) % 100;
        const duration = 1 + (i % 5) * 0.5;
        const delay = (i % 10) * 0.2;
        
        return (
          <motion.div
            key={i}
            className="absolute h-px bg-[#00ff41]"
            style={{ 
              top: `${top}%`,
              left: '-10%',
              width: `${width}px`,
            }}
            animate={{ 
              x: ['0vw', '120vw'],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear"
            }}
          />
        );
      })}
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
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [modelFilter, setModelFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isSignalLost, setIsSignalLost] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairingDevice, setPairingDevice] = useState<string | null>(null);
  const [pairingProgress, setPairingProgress] = useState(0);
  const [pairingStatus, setPairingStatus] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  const isValidPhone = (phone: string) => {
    // Strict validation: Must match +X (XXX) XXX-XXXX format exactly
    // and contain exactly 11 digits (standard for the implemented auto-formatter)
    const digits = phone.replace(/\D/g, '');
    const formatRegex = /^\+\d \(\d{3}\) \d{3}-\d{4}$/;
    return digits.length === 11 && formatRegex.test(phone);
  };

  const getPhoneErrorMessage = (phone: string) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) return `Protocol Error: Missing ${11 - digits.length} digits`;
    if (digits.length > 11) return "Protocol Error: Excessive digit count";
    const formatRegex = /^\+\d \(\d{3}\) \d{3}-\d{4}$/;
    if (!formatRegex.test(phone)) return "Protocol Error: Invalid structural encoding";
    return null;
  };

  const formatPhoneNumber = (value: string) => {
    // Simple auto-formatter for +1 (XXX) XXX-XXXX
    // Caps at 11 digits for strict protocol compliance
    const digits = value.replace(/\D/g, '').slice(0, 11);
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
    { name: 'Fairphone 5', origin: 'NETHERLANDS' },
    { name: 'Realme GT5', origin: 'CHINA' },
    { name: 'Vivo X100 Pro', origin: 'CHINA' },
    { name: 'ZTE Nubia Z60', origin: 'CHINA' },
    { name: 'Meizu 21', origin: 'CHINA' }
  ];

  const WIFI_NETWORKS = [
    { name: 'Starbucks_Guest_WiFi', strength: 3 },
    { name: 'Airport_Free_HighSpeed', strength: 2 },
    { name: 'Corporate_Secure_Net', strength: 4 },
    { name: 'Home_Network_5G', strength: 4 },
    { name: 'Public_Library_Access', strength: 1 }
  ];

  const BT_DEVICES = [
    { name: 'Bose QuietComfort 45', mac: '00:1A:7D:DA:71:13', strength: 4 },
    { name: 'Tesla Model 3 BT', mac: '44:61:32:88:AF:90', strength: 2 },
    { name: 'SmartWatch_X2', mac: 'A4:C1:38:99:01:BC', strength: 3 },
    { name: 'Unknown_Device_88AF', mac: '88:AF:90:00:1A:7D', strength: 1 },
    { name: 'JBL_Flip_6', mac: '71:13:00:1A:7D:DA', strength: 4 }
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
    if (targetType === 'radio' && radioType === 'bluetooth') {
      setIsPairing(true);
      setPairingDevice(value);
      setPairingProgress(0);
      setPairingStatus('INITIALIZING HANDSHAKE');
      
      const duration = 2500;
      const interval = 50;
      const steps = duration / interval;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const p = Math.min(Math.round((currentStep / steps) * 100), 100);
        setPairingProgress(p);
        
        if (p < 25) setPairingStatus('INITIALIZING HANDSHAKE');
        else if (p < 50) setPairingStatus('EXCHANGING CRYPTO KEYS');
        else if (p < 75) setPairingStatus('VERIFYING PIN CODE');
        else if (p < 95) setPairingStatus('ESTABLISHING SECURE CHANNEL');
        else setPairingStatus('PAIRING SUCCESSFUL');
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => {
            setIsPairing(false);
            setPairingDevice(null);
            setTargetValue(value);
            setState('ready');
          }, 300);
        }
      }, interval);
    } else {
      setTargetValue(value);
      setState('ready');
    }
  };

  const initializeTarget = () => {
    if (targetType === 'number' && isValidPhone(targetValue)) {
      setHistory(prev => {
        const filtered = prev.filter(h => h !== targetValue);
        return [targetValue, ...filtered].slice(0, 5);
      });
    }
    setState('ready');
  };

  useEffect(() => {
    if (state === 'cloning') {
      const isInvalid = targetType === 'number' && !isValidPhone(targetValue);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (isInvalid && prev >= 35) {
            clearInterval(interval);
            setIsSignalLost(true);
            setTimeout(() => {
              setIsSignalLost(false);
              setState('failed');
            }, 1500);
            return prev;
          }
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setState('completed'), 1000);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 200);

      const logInterval = setInterval(() => {
        const newLogs = isInvalid ? [
          'ERROR: Handshake failed',
          'ERROR: Protocol mismatch',
          'ERROR: Signal interference',
          'ERROR: Target rejected link',
          'CRITICAL: Connection lost'
        ] : [
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
  }, [state, targetType, targetValue]);

  const reset = () => {
    setState('targeting');
    setTargetValue('');
    setDialed('');
    setProgress(0);
    setLogs([]);
    setSelectedApp(null);
  };

  const CLONED_APPS = [
    { name: 'Signal', version: 'v5.2.1', status: 'ACTIVE', size: '42MB', lastSync: '2m ago', data: 'Encrypted' },
    { name: 'WhatsApp', version: 'v2.24.1', status: 'ACTIVE', size: '128MB', lastSync: '5m ago', data: 'Mirrored' },
    { name: 'Telegram', version: 'v10.3.0', status: 'ACTIVE', size: '84MB', lastSync: '1m ago', data: 'Live' },
    { name: 'Banking App', version: 'v4.0.2', status: 'ENCRYPTED', size: '12MB', lastSync: 'Never', data: 'Locked' },
    { name: 'Notes', version: 'v1.0.0', status: 'ACTIVE', size: '5MB', lastSync: '10m ago', data: 'Text' },
    { name: 'Photos', version: 'v3.5.1', status: 'MIRRORED', size: '2.4GB', lastSync: '30m ago', data: 'Media' }
  ];

  const COMMON_TARGETS = [
    '+1 (555) 012-3456',
    '+1 (555) 987-6543',
    '+1 (555) 444-2222'
  ];

  const suggestions = Array.from(new Set([...history, ...COMMON_TARGETS]))
    .filter(target => target.includes(targetValue) && target !== targetValue);

  const ORIGINS = ['ALL', ...Array.from(new Set(MODELS.map(m => m.origin)))];

  const [clipboardError, setClipboardError] = useState(false);

  const handlePaste = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error('Clipboard API not available');
      }
      const text = await navigator.clipboard.readText();
      setTargetValue(formatPhoneNumber(text));
      setClipboardError(false);
    } catch (err: any) {
      // Only log if it's not the expected permission error in the preview environment
      if (!err?.message?.includes('permissions policy') && !err?.message?.includes('NotAllowedError')) {
        console.error('Failed to read clipboard', err);
      }
      setClipboardError(true);
      setTimeout(() => setClipboardError(false), 3000);
    }
  };

  const isFailing = state === 'cloning' && targetType === 'number' && !isValidPhone(targetValue) && progress >= 30;

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden transition-all duration-75 ${state === 'failed' ? 'animate-[shake_0.5s_ease-in-out_infinite] bg-red-950/20' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, -2px); }
          20%, 40%, 60%, 80% { transform: translate(2px, 2px); }
        }
      `}} />
      <DataStreamBackground active={state === 'cloning'} />
      
      {/* Glitch Overlay for Failure */}
      <AnimatePresence>
        {(state === 'failed' || isFailing) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.1, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="fixed inset-0 pointer-events-none z-[100] bg-red-500/10 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Signal Lost Overlay */}
      <AnimatePresence>
        {isSignalLost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-6"
          >
            <div className="text-red-600 animate-pulse">
              <Wifi className="w-24 h-24 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <X className="w-16 h-16" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-4xl font-black text-red-600 tracking-[0.3em]">SIGNAL LOST</h2>
              <p className="text-[10px] text-red-600/60 uppercase tracking-[0.5em] animate-pulse">Attempting Reconnection...</p>
            </div>
            <div className="w-64 h-1 bg-red-900/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-600"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 1.5, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bluetooth Pairing Overlay */}
      <AnimatePresence>
        {isPairing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-[#00ff41]/20 rounded-full blur-2xl"
              />
              <Bluetooth className="w-20 h-20 text-[#00ff41] relative z-10" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white tracking-[0.2em] uppercase">Pairing Protocol</h2>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-[#00ff41] font-mono tracking-widest uppercase animate-pulse">
                  {pairingStatus}...
                </p>
                <p className="text-[8px] text-[#00ff41]/40 font-mono tracking-widest uppercase">
                  Target: {pairingDevice}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-64 h-1.5 bg-[#00ff41]/10 rounded-full overflow-hidden border border-[#00ff41]/20 relative">
                <motion.div 
                  className="h-full bg-[#00ff41] shadow-[0_0_15px_#00ff41]"
                  style={{ width: `${pairingProgress}%` }}
                />
              </div>
              <div className="flex justify-between w-64 px-1">
                <span className="text-[8px] text-[#00ff41]/60 font-mono">{pairingProgress}%</span>
                <span className="text-[8px] text-[#00ff41]/60 font-mono">SECURE_LINK_v4.2</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  className="w-2 h-2 bg-[#00ff41] rounded-sm"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
                  onClick={() => {
                    setTargetType('radio');
                    triggerScan();
                  }}
                  className={`p-4 border transition-all text-left space-y-3 ${targetType === 'radio' ? 'border-[#00ff41] bg-[#00ff41]/10 shadow-[0_0_15px_rgba(0,255,65,0.2)]' : 'border-[#00ff41]/20 hover:border-[#00ff41]/50 bg-black/40'}`}
                >
                  <Radio className={`w-6 h-6 ${targetType === 'radio' ? 'text-[#00ff41]' : 'opacity-40'}`} />
                  <div>
                    <h3 className="font-bold text-[11px]">RADIO WAVE</h3>
                    <div className="flex items-center gap-2 text-[9px] opacity-40">
                      <div className="flex items-center gap-0.5">
                        <Wifi className="w-2 h-2" /> 
                        <div className="flex gap-[1px] items-end h-2">
                          <div className="w-[1px] h-[2px] bg-[#00ff41]" />
                          <div className="w-[1px] h-[4px] bg-[#00ff41]" />
                          <div className="w-[1px] h-[6px] bg-[#00ff41]/30" />
                        </div>
                        WIFI
                      </div>
                      <div className="flex items-center gap-0.5"><Bluetooth className="w-2 h-2" /> BT</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8">
                {targetType === 'number' ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                          <input 
                            type="tel"
                            placeholder="+1 (___) ___-____"
                            className={`w-full bg-black/60 border p-4 text-center text-xl tracking-[0.2em] focus:outline-none transition-colors ${targetValue && !isValidPhone(targetValue) ? 'border-red-500 text-red-500' : 'border-[#00ff41]/30 focus:border-[#00ff41]'}`}
                            onChange={(e) => {
                              setTargetValue(formatPhoneNumber(e.target.value));
                              setIsAutocompleteOpen(true);
                            }}
                            onFocus={() => setIsAutocompleteOpen(true)}
                            onBlur={() => setTimeout(() => setIsAutocompleteOpen(false), 200)}
                            value={targetValue}
                          />
                          
                          <AnimatePresence>
                            {isAutocompleteOpen && suggestions.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#00ff41]/40 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] max-h-48 overflow-y-auto custom-scrollbar"
                              >
                                {suggestions.map(suggestion => (
                                  <button 
                                    key={suggestion}
                                    onClick={() => {
                                      setTargetValue(suggestion);
                                      setIsAutocompleteOpen(false);
                                    }}
                                    className="w-full p-3 text-left text-[11px] uppercase tracking-widest hover:bg-[#00ff41]/10 transition-colors flex items-center justify-between group"
                                  >
                                    <span className="group-hover:text-[#00ff41]">{suggestion}</span>
                                    <span className="text-[8px] opacity-30">MATCH FOUND</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button 
                          onClick={handlePaste}
                          className={`px-4 border transition-colors flex items-center justify-center ${clipboardError ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-[#00ff41]/30 hover:bg-[#00ff41]/10'}`}
                          title={clipboardError ? "Clipboard access blocked by browser" : "Paste from clipboard"}
                        >
                          {clipboardError ? <X className="w-5 h-5" /> : <ClipboardPaste className="w-5 h-5" />}
                        </button>
                      </div>
                      {clipboardError && (
                        <p className="text-[8px] text-red-500 mt-1 text-center uppercase tracking-widest animate-pulse">
                          Clipboard blocked by browser permissions policy
                        </p>
                      )}
                      {targetValue && !isValidPhone(targetValue) && (
                        <p className="text-[10px] text-red-500 mt-2 text-center uppercase tracking-widest animate-pulse">
                          {getPhoneErrorMessage(targetValue)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {history.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[9px] opacity-40 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-2 h-2" /> Recent Signatures
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {history.map(target => (
                              <button 
                                key={target}
                                onClick={() => setTargetValue(target)}
                                className="text-[9px] px-2 py-1 border border-[#00ff41] bg-[#00ff41]/5 hover:bg-[#00ff41]/20 transition-all text-white"
                              >
                                {target}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-[9px] opacity-40 uppercase tracking-widest">Known High-Value Targets</p>
                        <div className="flex flex-wrap gap-2">
                          {COMMON_TARGETS.map(target => (
                            <button 
                              key={target}
                              onClick={() => setTargetValue(target)}
                              className="text-[9px] px-2 py-1 border border-[#00ff41]/20 hover:border-[#00ff41]/60 hover:bg-[#00ff41]/5 transition-all"
                            >
                              {target}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button 
                      disabled={!targetValue}
                      onClick={initializeTarget}
                      className={`w-full py-4 font-bold uppercase tracking-widest transition-colors ${!isValidPhone(targetValue) ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#00ff41] text-black hover:bg-[#00ff41]/80'}`}
                    >
                      {isValidPhone(targetValue) ? 'Initialize Link' : 'Force Protocol (Unstable)'}
                    </button>
                  </div>
                ) : targetType === 'model' ? (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-40" />
                        <input 
                          type="text"
                          placeholder="Search hardware signatures..."
                          className="w-full bg-black/60 border border-[#00ff41]/30 p-3 pl-9 text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#00ff41] transition-colors"
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="text-[8px] uppercase tracking-[0.3em] opacity-30 font-bold">Filter by Origin</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                          {ORIGINS.map(origin => (
                            <button
                              key={origin}
                              onClick={() => setModelFilter(origin)}
                              className={`whitespace-nowrap px-3 py-1.5 border text-[8px] uppercase tracking-widest transition-all ${modelFilter === origin ? 'bg-[#00ff41] text-black border-[#00ff41] font-bold' : 'border-[#00ff41]/20 opacity-40 hover:opacity-100 hover:border-[#00ff41]/50'}`}
                            >
                              {origin}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {MODELS.filter(m => 
                        (modelFilter === 'ALL' || m.origin === modelFilter) &&
                        (m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.origin.toLowerCase().includes(modelSearch.toLowerCase()))
                      ).map((model) => (
                        <button 
                          key={model.name}
                          onClick={() => selectTarget(model.name)}
                          className="p-3 border border-[#00ff41]/20 bg-black/40 text-[10px] text-left hover:bg-[#00ff41]/10 hover:border-[#00ff41]/50 transition-all uppercase tracking-tighter group flex flex-col justify-between h-20 relative overflow-hidden"
                        >
                          <div className="flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold group-hover:text-white leading-tight break-words flex-1">{model.name}</span>
                              <span className="text-[7px] px-1.5 py-0.5 border border-[#00ff41]/30 bg-[#00ff41]/5 text-[#00ff41]/60 group-hover:text-[#00ff41] group-hover:border-[#00ff41] transition-all tracking-tighter whitespace-nowrap shrink-0">
                                {model.origin}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-end mt-2">
                              <Cpu className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setRadioType('wifi');
                          triggerScan();
                        }}
                        className={`flex-1 p-3 border flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${radioType === 'wifi' ? 'border-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/20 opacity-40'}`}
                      >
                        <div className="relative">
                          <Wifi className="w-4 h-4" />
                          <div className="absolute -right-1 -top-1 flex gap-[1px] items-end h-2">
                            <div className="w-[1px] h-[2px] bg-[#00ff41] animate-pulse" />
                            <div className="w-[1px] h-[4px] bg-[#00ff41] animate-pulse [animation-delay:0.2s]" />
                            <div className="w-[1px] h-[6px] bg-[#00ff41] animate-pulse [animation-delay:0.4s]" />
                          </div>
                        </div>
                        WIFI
                      </button>
                      <button 
                        onClick={() => {
                          setRadioType('bluetooth');
                          triggerScan();
                        }}
                        className={`flex-1 p-3 border flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${radioType === 'bluetooth' ? 'border-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/20 opacity-40'}`}
                      >
                        <Bluetooth className="w-4 h-4" /> BLUETOOTH
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2 px-1">
                      <p className="text-[9px] opacity-40 uppercase tracking-widest flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full bg-[#00ff41] ${isScanning ? 'animate-ping' : ''}`} />
                        {isScanning ? `Scanning for ${radioType === 'wifi' ? 'SSIDs' : 'BT_DEVICES'}...` : `${radioType === 'wifi' ? 'WIFI' : 'BLUETOOTH'} SCAN COMPLETE`}
                      </p>
                      <p className="text-[8px] opacity-20 uppercase tracking-widest">Frequency: {radioType === 'wifi' ? '2.4/5GHz' : '2.4GHz ISM'}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar relative">
                      {isScanning ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-sm z-10">
                          <div className="w-8 h-8 border-2 border-[#00ff41]/20 border-t-[#00ff41] rounded-full animate-spin" />
                          <span className="text-[8px] uppercase tracking-[0.3em] opacity-40">Synchronizing Frequencies</span>
                        </div>
                      ) : null}
                      
                      {(radioType === 'wifi' ? WIFI_NETWORKS : BT_DEVICES).map((item: any) => {
                        const name = item.name;
                        const strength = item.strength;
                        const mac = item.mac;
                        
                        return (
                          <button 
                            key={name}
                            onClick={() => selectTarget(name)}
                            disabled={isScanning || isPairing}
                            className="p-3 border border-[#00ff41]/10 bg-black/40 text-[10px] text-left hover:bg-[#00ff41]/10 hover:border-[#00ff41]/30 transition-all flex justify-between items-center group disabled:opacity-50"
                          >
                            <div className="flex items-center gap-2">
                              {radioType === 'wifi' ? <Wifi className="w-3 h-3 opacity-40 group-hover:opacity-100" /> : <Bluetooth className="w-3 h-3 opacity-40 group-hover:opacity-100" />}
                              <div className="flex flex-col">
                                <span className="group-hover:text-white font-bold">{name}</span>
                                {mac && <span className="text-[7px] opacity-30 tracking-widest">{mac}</span>}
                              </div>
                              <div className="flex gap-0.5 ml-1">
                                {[1, 2, 3, 4].map((bar) => (
                                  <div 
                                    key={bar} 
                                    className={`w-0.5 rounded-full transition-all ${bar <= strength ? 'bg-[#00ff41] shadow-[0_0_3px_#00ff41]' : 'bg-[#00ff41]/10'}`}
                                    style={{ height: `${bar * 2 + 2}px` }}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-[8px] opacity-30 uppercase">{radioType === 'wifi' ? 'SSID' : 'MAC_ADDR'}</span>
                          </button>
                        );
                      })}
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
                  className={`absolute inset-y-0 left-0 shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-colors ${isFailing ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-[#00ff41]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
                {/* Bit Indicators */}
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-px h-full ${progress > (i * 10) ? 'bg-black/40' : 'bg-[#00ff41]/20'}`} />
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {isFailing && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-600 text-white py-2 px-4 rounded text-center font-black uppercase tracking-[0.5em] text-xs animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  >
                    Warning: Link Unstable // Signal Degrading
                  </motion.div>
                )}
              </AnimatePresence>

              <PacketFlow type={targetType === 'radio' ? radioType : targetType} progress={progress} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-[#00ff41]/20 p-6 bg-[#00ff41]/5 rounded-lg relative overflow-hidden">
                  {isFailing && (
                    <div className="absolute inset-0 bg-red-600/10 animate-pulse flex items-center justify-center pointer-events-none">
                      <span className="text-[40px] font-black text-red-600/20 rotate-12 uppercase tracking-[0.5em]">Breach</span>
                    </div>
                  )}
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
                        className={`transition-colors ${isFailing ? 'text-red-500' : 'text-[#00ff41]'}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold transition-colors ${isFailing ? 'text-red-500' : 'text-white'}`}>{Math.round(progress)}%</span>
                      {isFailing && <span className="text-[8px] text-red-500 uppercase tracking-widest animate-pulse">Terminated</span>}
                    </div>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Extracting Data Packets</p>
                </div>
              </div>
            </motion.div>
          ) : state === 'failed' ? (
            <motion.div 
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-8 max-w-2xl mx-auto w-full text-center relative"
            >
              {/* Glitch Text Effect */}
              <div className="absolute -inset-10 pointer-events-none overflow-hidden opacity-20">
                <div className="text-[120px] font-bold text-red-500 blur-3xl animate-pulse">ERROR</div>
              </div>

              <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-bounce">
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-5xl font-black text-red-500 tracking-[0.2em] italic uppercase">
                    Link Severed
                  </h2>
                  <p className="text-red-400 text-[10px] tracking-[0.5em] uppercase font-bold">Protocol Breach Detected</p>
                </div>

                <div className="p-6 border-2 border-red-500/50 bg-black/80 rounded-lg w-full backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                  <div className="flex items-center gap-2 mb-4 border-b border-red-500/30 pb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">System Forensic Log</p>
                  </div>
                  <p className="text-sm font-mono text-red-500 text-left leading-relaxed">
                    [CRITICAL] Handshake rejected by remote gateway.<br/>
                    [FAILURE] Signature validation failed for target: {targetValue}<br/>
                    [WARNING] Nexus Tunnel collapsed. Trace-back initiated.<br/>
                    [ACTION] Purging local session cache to prevent detection.
                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <button 
                    onClick={reset}
                    className="group relative px-8 py-4 bg-red-600 text-white overflow-hidden transition-all hover:bg-red-700"
                  >
                    <span className="relative z-10 font-black uppercase tracking-[0.3em] text-xs">Emergency Reboot</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </button>
                  <p className="text-[8px] text-red-500/50 uppercase tracking-widest">Connection lost // Signal flatlined</p>
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
                    {CLONED_APPS.map((app, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedApp(app)}
                        className={`p-3 border rounded transition-all group text-left w-full relative ${selectedApp?.name === app.name ? 'border-[#00ff41] bg-[#00ff41]/10' : 'border-[#00ff41]/10 bg-black/40 hover:bg-[#00ff41]/5 hover:border-[#00ff41]/30'}`}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#00ff41] text-black px-2 py-1 rounded text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-[0_0_10px_rgba(0,255,65,0.5)] flex items-center gap-2">
                          <span className="flex items-center gap-1"><Database className="w-2 h-2" /> {app.size}</span>
                          <span className="w-px h-2 bg-black/20" />
                          <span className="flex items-center gap-1"><Activity className="w-2 h-2" /> {app.lastSync}</span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00ff41] rotate-45" />
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'ENCRYPTED' ? 'bg-yellow-500' : 'bg-[#00ff41]'} shadow-[0_0_8px_currentColor]`} />
                            <p className="text-[11px] font-bold text-white group-hover:text-[#00ff41] transition-colors">{app.name}</p>
                          </div>
                          <ChevronRight className={`w-3 h-3 transition-transform ${selectedApp?.name === app.name ? 'rotate-90 text-[#00ff41]' : 'opacity-20'}`} />
                        </div>
                        <div className="flex items-center justify-between pl-[1.125rem]">
                          <p className="text-[9px] opacity-40 uppercase tracking-tighter">{app.version}</p>
                          <span className="text-[8px] px-1.5 py-0.5 border border-[#00ff41]/20 rounded text-[#00ff41] opacity-60 group-hover:opacity-100 transition-opacity">
                            {app.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {selectedApp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-[#00ff41]/40 bg-[#00ff41]/5 p-4 rounded mt-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#00ff41]/10 rounded border border-[#00ff41]/20">
                            <AppWindow className="w-5 h-5 text-[#00ff41]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{selectedApp.name}</h4>
                            <p className="text-[10px] opacity-50 uppercase tracking-tighter">Package: com.nexus.{selectedApp.name.toLowerCase().replace(' ', '')}</p>
                          </div>
                        </div>
                        <button onClick={() => setSelectedApp(null)} className="opacity-40 hover:opacity-100 p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="space-y-1">
                          <p className="text-[9px] opacity-40 uppercase">Size</p>
                          <p className="text-[11px] font-bold flex items-center gap-1.5"><Database className="w-3 h-3" /> {selectedApp.size}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] opacity-40 uppercase">Last Sync</p>
                          <p className="text-[11px] font-bold flex items-center gap-1.5"><Activity className="w-3 h-3" /> {selectedApp.lastSync}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] opacity-40 uppercase">Data Type</p>
                          <p className="text-[11px] font-bold flex items-center gap-1.5"><FileText className="w-3 h-3" /> {selectedApp.data}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] opacity-40 uppercase">Security</p>
                          <p className="text-[11px] font-bold flex items-center gap-1.5">
                            {selectedApp.status === 'ENCRYPTED' ? <Lock className="w-3 h-3 text-yellow-500" /> : <Unlock className="w-3 h-3 text-[#00ff41]" />}
                            {selectedApp.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 bg-[#00ff41] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#00ff41]/80 transition-colors">
                          Open Interface
                        </button>
                        <button className="px-4 py-2 border border-[#00ff41]/30 text-[#00ff41] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00ff41]/10 transition-colors">
                          Dump Database
                        </button>
                        <button className="px-4 py-2 border border-[#00ff41]/30 text-[#00ff41] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00ff41]/10 transition-colors">
                          Intercept Tokens
                        </button>
                        {selectedApp.status === 'ENCRYPTED' && (
                          <button className="px-4 py-2 border border-yellow-500/30 text-yellow-500 text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-500/10 transition-colors">
                            Brute Force Key
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
