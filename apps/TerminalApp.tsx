
import React, { useState, useRef, useEffect } from 'react';

export const TerminalApp: React.FC = () => {
  const [lines, setLines] = useState<string[]>([
    'XPFuture OS Kernel v2.5.0-Preview-2050',
    'Copyright (c) 2001-2050 Microsoft / Neuralink Corp.',
    '',
    'Initializing quantum subsystems...',
    '[OK] Virtual Memory: 1.2 Petabytes',
    '[OK] Neural Engine: Active',
    '[OK] Clippy Protocol: Version 9.0 Enabled',
    '',
    'Type "help" for a list of commands.'
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      setLines(prev => [...prev, `> ${input}`]);
      setInput('');

      switch(cmd) {
        case 'help':
          setLines(prev => [...prev, 'Available: help, status, clear, date, whoami, reboot']);
          break;
        case 'status':
          setLines(prev => [...prev, 'SYSTEM: STABLE', 'UPTIME: 42,069 minutes', 'THREADS: 1024 Quantum Cores']);
          break;
        case 'clear':
          setLines([]);
          break;
        case 'reboot':
          setLines(prev => [...prev, 'REBOOTING... (Simulated)']);
          setTimeout(() => window.location.reload(), 2000);
          break;
        case 'whoami':
          setLines(prev => [...prev, 'Authorized Admin User #49102']);
          break;
        default:
          setLines(prev => [...prev, `Command not found: ${cmd}`]);
      }
    }
  };

  return (
    <div className="p-4 font-mono text-sm h-full overflow-y-auto bg-black text-green-400">
      <div className="whitespace-pre-wrap">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <div className="flex mt-2">
        <span className="mr-2">&gt;</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          className="bg-transparent border-none outline-none flex-1 text-green-400"
        />
      </div>
      <div ref={scrollRef} />
    </div>
  );
};
