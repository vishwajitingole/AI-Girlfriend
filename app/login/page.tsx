"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Heart, Loader2, Lock, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...formData, type: isLogin ? 'login' : 'register' }),
    });
    const data = await res.json();
    if (data.success) {
      // Refresh page to let middleware see the new cookie
      window.location.href = data.role === 'admin' ? '/admin' : '/';
    } else {
      setError(data.error);
    }
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="h-screen bg-[#0d0208] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/40 border border-rose-500/20 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Heart className="text-rose-600 fill-rose-600 mb-4" size={56} />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-[0.2em] uppercase text-white">V-Rose</h2>
          <p className="text-rose-500/50 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">
            {isLogin ? "Welcome Back" : "Create Connection"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="relative group">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500/40 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input 
              required
              name="username" 
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username" 
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-rose-600/50 outline-none transition-all text-rose-100 placeholder:text-zinc-600" 
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500/40 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input 
              required
              name="password" 
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password" 
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-rose-600/50 outline-none transition-all text-rose-100 placeholder:text-zinc-600" 
            />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-rose-500 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full bg-rose-600 py-4 rounded-2xl font-bold uppercase tracking-widest text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              isLogin ? 'Enter Heart' : 'Join V-Rose'
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
           <button 
             onClick={() => {
               setIsLogin(!isLogin);
               setError("");
             }} 
             className="text-rose-500/40 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-rose-400 transition-colors"
           >
              {isLogin ? "Need a new account? Sign Up" : "Already have a heart? Login"}
           </button>
        </div>
      </motion.div>

      {/* Footer Branded Note */}
      <div className="absolute bottom-8 text-[9px] uppercase tracking-[0.5em] text-rose-900/40 font-bold">
        Engineered by Vishwajit
      </div>
    </div>
  );
}