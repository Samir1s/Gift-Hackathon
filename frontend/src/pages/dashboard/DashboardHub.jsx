import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Newspaper, Briefcase, ArrowRight, Trophy, Flame, Star } from 'lucide-react';

const modules = [
    { name: 'Learn', description: 'AI-curated trading lessons', icon: BookOpen, path: '/dashboard/learn', gradient: 'from-[#7B3FE4]/20 to-[#9B6DFF]/5', border: 'hover:border-[#7B3FE4]/30' },
    { name: 'Playgrounds', description: 'Practice with virtual currency', icon: Gamepad2, path: '/dashboard/playground', gradient: 'from-[#6C7CFF]/20 to-[#6C7CFF]/5', border: 'hover:border-[#6C7CFF]/30' },
    { name: 'Daily Updates', description: 'Live market news & alerts', icon: Newspaper, path: '/dashboard/daily-updates', gradient: 'from-[#FFC857]/15 to-[#FFC857]/5', border: 'hover:border-[#FFC857]/30' },
    { name: 'Portfolio', description: 'Track your performance', icon: Briefcase, path: '/dashboard/portfolio', gradient: 'from-[#00E0A4]/15 to-[#00E0A4]/5', border: 'hover:border-[#00E0A4]/30' },
];

const DashboardHub = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <h1 className="text-4xl font-bold text-white font-[var(--font-outfit)] mb-2">
                    Welcome back, <span className="font-[var(--font-aesthetic)] italic font-light text-[#A8B0C3]">Trader</span>
                </h1>
                <p className="text-[#6B7280]">Continue your journey to financial mastery</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                    { label: 'Total XP', value: '2,450', icon: Star, color: 'text-[#FFC857]', glow: 'shadow-[0_0_12px_rgba(255,200,87,0.1)]' },
                    { label: 'Day Streak', value: '7 Days', icon: Flame, color: 'text-[#FF4D6D]', glow: 'shadow-[0_0_12px_rgba(255,77,109,0.1)]' },
                    { label: 'Level', value: 'Level 5', icon: Trophy, color: 'text-[#9B6DFF]', glow: 'shadow-[0_0_12px_rgba(155,109,255,0.1)]' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-5 rounded-2xl border border-white/[0.06] bg-[#151824] flex items-center gap-4 hover:translate-y-[-2px] hover:border-[#7B3FE4]/20 transition-all duration-200 ${stat.glow}`}
                    >
                        <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-[#6B7280]">{stat.label}</p>
                            <p className="text-lg font-bold text-white font-[var(--font-outfit)] tabular-nums">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-2 gap-5">
                {modules.map((mod, i) => (
                    <motion.div
                        key={mod.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => navigate(mod.path)}
                        className={`group p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${mod.gradient} bg-[#151824] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(123,63,228,0.1)] ${mod.border} transition-all duration-200 cursor-pointer`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center mb-4 group-hover:bg-white/[0.12] transition-colors">
                            <mod.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-[var(--font-outfit)] mb-1">{mod.name}</h3>
                        <p className="text-sm text-[#A8B0C3] mb-4">{mod.description}</p>
                        <div className="flex items-center gap-1 text-sm text-[#6B7280] group-hover:text-[#9B6DFF] transition-colors">
                            Open <ArrowRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DashboardHub;
