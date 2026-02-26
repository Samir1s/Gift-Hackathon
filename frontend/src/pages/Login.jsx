import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#7B3FE4]/8 blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#9B6DFF]/6 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#6C7CFF]/5 blur-[150px]" />
            </div>

            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-10 relative z-10">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-[0_0_20px_rgba(123,63,228,0.3)]">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-[var(--font-aesthetic)] italic text-2xl text-white">Trade</span>
                <span className="font-[var(--font-outfit)] font-bold text-2xl text-white">Quest</span>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-md p-8 rounded-2xl bg-[#151824]/80 backdrop-blur-xl border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(123,63,228,0.08)] relative z-10"
            >
                <h2 className="text-2xl font-bold text-white text-center mb-2 font-[var(--font-outfit)]">
                    {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-[#6B7280] text-center mb-8 text-sm">
                    {isLogin ? 'Enter your credentials to continue' : 'Start your trading journey'}
                </p>

                {/* Google */}
                <button className="w-full h-12 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white font-medium flex items-center justify-center gap-3 hover:bg-[#1C1F2E]/80 hover:border-[#7B3FE4]/20 transition-all cursor-pointer btn-press mb-6">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-xs text-[#6B7280]">or</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <input type="text" placeholder="Full name"
                                className="w-full h-12 pl-4 pr-4 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white placeholder-[#6B7280] text-sm focus:outline-none input-glow transition-all" />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input type="email" placeholder="Email address"
                            className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white placeholder-[#6B7280] text-sm focus:outline-none input-glow transition-all" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password"
                            className="w-full h-12 pl-11 pr-11 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white placeholder-[#6B7280] text-sm focus:outline-none input-glow transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors cursor-pointer">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <button type="submit"
                        className="w-full h-12 rounded-xl gradient-primary text-white font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(123,63,228,0.3)] hover:shadow-[0_4px_30px_rgba(123,63,228,0.45)] transition-all btn-press cursor-pointer">
                        {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <p className="text-sm text-[#6B7280] text-center mt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-[#9B6DFF] font-medium hover:text-white transition-colors cursor-pointer">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
