"use client";
import { motion } from 'framer-motion';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const res = await fetch('/api/admin/all-chats');
    const data = await res.json();
    if (!data.error) setChats(data);
  };

  useEffect(() => { fetchChats(); }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#050103] text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-rose-500/20 pb-6">
        <div className="flex items-center gap-4">
          <Shield className="text-rose-600" size={32} />
          <h1 className="text-2xl font-bold italic tracking-tighter">COMMAND CENTER</h1>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-rose-600/10 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2">
          <LogOut size={18} /> Exit
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chats.map((chat: any) => (
          <motion.div key={chat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <UserIcon className="text-rose-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-rose-100">{chat.username}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{new Date(chat.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {chat.messages.map((m: any, idx: number) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] ${
                    m.role === 'user' ? 'bg-zinc-800 text-zinc-300' : 'bg-rose-500/10 text-rose-200 border border-rose-500/10'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}