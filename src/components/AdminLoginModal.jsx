import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Key, X, ArrowRight } from 'lucide-react';

const AdminLoginModal = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- HARDCODED CHECK ---
    const USER = 'jp';
    const PASS = 'Cadellin3315!?!';

    if (username === USER && password === PASS) {
      onLoginSuccess();
      // Note: We deliberately do not call onClose() here
      // because onLoginSuccess will change the parent state, destroying this modal.
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-slate-900 shadow-2xl"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-indigo-400">
                <Lock size={24} />
                <h3 className="text-xl font-bold text-white font-display">Admin Portal</h3>
              </div>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 ml-3 flex items-center gap-1">
                  <User size={12} /> Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="jp"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 ml-3 flex items-center gap-1">
                  <Key size={12} /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-rose-400 font-medium pt-2"
                  >
                    Authentication failed. Check credentials.
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
              >
                Enter Portal <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminLoginModal;
