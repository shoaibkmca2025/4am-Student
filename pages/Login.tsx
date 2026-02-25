import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '../4am logo.jpeg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', role);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Gradients for 'Overall Project' Feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 flex items-center text-slate-500 hover:text-white transition-colors z-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      {/* Main Container */}
      <motion.div 
        className="relative w-full max-w-[420px] aspect-square flex items-center justify-center group"
        initial="initial"
        whileHover="hover"
      >
        
        {/* ANIMATED RINGS CONTAINER */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           
           {/* Ring 1 - Outer (Indigo) */}
           <motion.div 
             animate={{ rotate: 360 }}
             variants={{
                initial: { boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)' },
                hover: { boxShadow: '0 0 60px rgba(99, 102, 241, 0.6)', borderColor: 'rgba(99, 102, 241, 0.8)', scale: 1.05 }
             }}
             transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 0.5 },
                borderColor: { duration: 0.5 },
                scale: { duration: 0.5 }
             }}
             className="absolute w-[130%] h-[130%] rounded-full border"
             style={{ borderWidth: '1px' }}
           />
           {/* Ring 1 Decorative Dot */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute w-[130%] h-[130%] rounded-full"
           >
              <div className="absolute top-1/2 left-0 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
           </motion.div>


           {/* Ring 2 - Middle (Purple) */}
           <motion.div 
             animate={{ rotate: -360 }}
             variants={{
                initial: { boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)' },
                hover: { boxShadow: '0 0 50px rgba(168, 85, 247, 0.6)', borderColor: 'rgba(168, 85, 247, 0.8)', scale: 1.05 }
             }}
             transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 0.5 },
                borderColor: { duration: 0.5 },
                scale: { duration: 0.5 }
             }}
             className="absolute w-[100%] h-[100%] rounded-full border"
             style={{ borderWidth: '1px' }}
           />
           {/* Ring 2 Decorative Dot */}
           <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute w-[100%] h-[100%] rounded-full"
           >
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
           </motion.div>


           {/* Ring 3 - Inner (Pink) */}
           <motion.div 
             animate={{ rotate: 360 }}
             variants={{
                initial: { boxShadow: '0 0 20px rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)' },
                hover: { boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)', borderColor: 'rgba(236, 72, 153, 0.8)', scale: 1.05 }
             }}
             transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 0.5 },
                borderColor: { duration: 0.5 },
                scale: { duration: 0.5 }
             }}
             className="absolute w-[70%] h-[70%] rounded-full border"
             style={{ borderWidth: '1px' }}
           />
           
           {/* Hover Effect Ring - Glows on interaction */}
           <motion.div 
             className="absolute w-[85%] h-[85%] rounded-full border border-cyan-500/0"
             whileHover={{ borderColor: 'rgba(6, 182, 212, 0.5)', scale: 1.05 }}
             transition={{ duration: 0.3 }}
           />
        </div>

        {/* Login Form Card */}
        <div className="relative z-10 w-full p-8 flex flex-col justify-center items-center">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-8">
            
            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                required
                className="w-full px-6 py-3.5 bg-slate-900/80 border border-slate-700 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-transparent transition-all text-center peer shadow-lg backdrop-blur-sm"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label 
                className={`absolute left-1/2 -translate-x-1/2 transition-all pointer-events-none ${
                  email || document.activeElement === document.querySelector('input[type="email"]') 
                    ? '-top-6 text-xs text-indigo-400 font-semibold' 
                    : 'top-3.5 text-slate-400 text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-indigo-400 peer-focus:font-semibold'
                }`}
              >
                Username
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type="password"
                required
                className="w-full px-6 py-3.5 bg-slate-900/80 border border-slate-700 rounded-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 text-white placeholder-transparent transition-all text-center peer shadow-lg backdrop-blur-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label 
                className={`absolute left-1/2 -translate-x-1/2 transition-all pointer-events-none ${
                  password 
                    ? '-top-6 text-xs text-purple-400 font-semibold' 
                    : 'top-3.5 text-slate-400 text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-purple-400 peer-focus:font-semibold'
                }`}
              >
                Password
              </label>
            </div>

            {/* Role Selection Toggle */}
            <div className="flex justify-center items-center gap-3 py-2">
                <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${role === 'student' ? 'bg-indigo-400 scale-125 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-slate-700 hover:bg-slate-600'}`}
                      title="Student"
                    />
                    <button
                      type="button"
                      onClick={() => setRole('company')}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${role === 'company' ? 'bg-purple-400 scale-125 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-slate-700 hover:bg-slate-600'}`}
                      title="Company"
                    />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{role}</span>
            </div>

            {/* Gradient Sign In Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold rounded-full shadow-[0_10px_20px_rgba(168,85,247,0.2)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-white/10"
            >
              Sign In
            </button>

            {/* Footer Links */}
            <div className="flex justify-between text-xs text-slate-400 px-6">
              <button type="button" className="hover:text-white transition-colors">Forget Password</button>
              <button type="button" onClick={() => navigate('/register')} className="hover:text-white transition-colors">Signup</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
