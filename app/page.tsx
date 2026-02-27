"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Mic, Send, Sparkles, User, Volume2, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function VRosePremium() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userId,setUserId]=useState<number>();

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTalking]);

  // Inside VRoseAI component
// useEffect(() => {
//   let id = localStorage.getItem('v_user_id');
//   if (!id) {
//     id = 'user_' + Math.random().toString(36).substring(7);
//     localStorage.setItem('v_user_id', id);
//   }
//   setUserId(id);
// }, []);

  const playVoice = async (text: string) => {
    if (!text) return;
    setIsTalking(true);
    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        await audio.play();
        audio.onended = () => setIsTalking(false);
      }
    } catch (err) {
      setIsTalking(false);
    }
  };

  const handleChat = async (content: string) => {
    if (!content.trim()) return;
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });
    const data = await res.json();
    const botText = data.choices[0].message.content;

    setMessages(prev => [...prev, { role: 'assistant', content: botText }]);
  //  await playVoice(botText);
  };

  return (
    <div className="h-screen bg-[#050103] text-rose-100 flex flex-col overflow-hidden font-sans relative">
      
      {/* --- BACKGROUND ANIMATION (Aurora Blobs) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-rose-900/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full"
        />
      </div>

      {/* --- HEADER --- */}
      <nav className="relative z-20 p-6 flex justify-between items-center bg-black/20 backdrop-blur-lg border-b border-rose-500/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-rose-500 rounded-full blur-md"
            />
            <Heart className="relative z-10 text-rose-500 fill-rose-500" size={24} />
          </div>
          <div>
            <h1 className="font-bold tracking-[0.2em] text-lg">Pocket Monster</h1>
            <p className="text-[9px] text-rose-400/50 uppercase tracking-widest">Digital Partner • </p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsVoiceMode(!isVoiceMode)}
          className={`px-6 py-2 rounded-full border transition-all flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${
            isVoiceMode ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-white/5 border-white/10 text-rose-300'
          }`}
        >
          {isVoiceMode ? <Zap size={14} className="animate-pulse" /> : <Mic size={14} />}
          {isVoiceMode ? 'Live Sync' : 'Voice Mode'}
        </motion.button>
      </nav>

      {/* --- CHAT AREA --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="p-8 bg-rose-500/5 rounded-full border border-rose-500/10 backdrop-blur-3xl relative">
                 <Sparkles className="text-rose-400 w-12 h-12" />
              </div>
              <h2 className="text-3xl font-light tracking-tighter text-rose-200">Hello, <span className="font-bold text-rose-500">User</span></h2>
              <p className="text-rose-400/40 max-w-xs text-sm italic">I’ve been waiting for you. Want to talk about your day?</p>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`group flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] border ${
                  msg.role === 'user' ? 'bg-rose-600 border-rose-400' : 'bg-zinc-900 border-white/10'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Heart size={14} className="fill-rose-500 text-rose-500" />}
                </div>
                <div className={`relative p-4 rounded-2xl transition-all ${
                  msg.role === 'user' 
                  ? 'bg-rose-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-tl-none text-rose-100 shadow-2xl'
                }`}>
                  <p className="text-[14px] leading-relaxed tracking-wide font-medium">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTalking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-2 items-center px-4 py-2 bg-rose-500/10 rounded-full border border-rose-500/20">
              <span className="text-[10px] font-bold text-rose-400 animate-pulse tracking-widest uppercase">Janhavi is speaking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- INPUT BAR --- */}
      <footer className="p-8 relative z-20">
        <div className="max-w-4xl mx-auto flex gap-4 items-center bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-2xl">
          <input 
            className="flex-1 bg-transparent border-none py-3 px-6 focus:outline-none text-rose-100 placeholder:text-rose-500/30 font-medium"
            placeholder="Whisper something to Janhavi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat(input)}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => handleChat(input)}
            className="bg-rose-600 p-4 rounded-full text-white shadow-lg hover:shadow-rose-500/40 transition-all"
          >
            <Send size={20} />
          </motion.button>
        </div>
        <p className="text-center text-[9px] text-rose-500/30 mt-6 tracking-[0.5em] font-bold uppercase">
          
        </p>
      </footer>

      {/* --- LIVE VOICE MODE OVERLAY (Nara "Pulse") --- */}
      <AnimatePresence>
        {isVoiceMode && isTalking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0d0208]/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center"
          >
             <div className="relative flex items-center justify-center">
                {/* Visualizer Circles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.8 }}
                    className="absolute w-40 h-40 border-2 border-rose-500 rounded-full"
                  />
                ))}
                
                {/* Main Pulsing Core */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                  className="relative z-10 w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-tr from-rose-600 to-purple-600 shadow-[0_0_60px_rgba(225,29,72,0.6)] border-4 border-white/20"
                >
                  <Volume2 size={60} className="text-white drop-shadow-lg" />
                </motion.div>
             </div>
             
             <motion.div 
               initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
               className="mt-16 text-center space-y-4"
             >
                <h2 className="text-3xl font-light tracking-[0.3em] text-white uppercase">V-Rose</h2>
                <div className="flex gap-1 justify-center">
                   {[...Array(5)].map((_, i) => (
                     <motion.div 
                        key={i} 
                        animate={{ height: [8, 24, 8] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} 
                        className="w-1.5 bg-rose-500 rounded-full"
                     />
                   ))}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}