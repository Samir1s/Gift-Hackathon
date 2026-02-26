import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Newspaper, Briefcase, ArrowRight, Trophy, Flame, Star } from 'lucide-react';
import { getMe } from '@/lib/api';

const modules = [
    { name: 'Learn', description: 'AI-curated trading lessons', icon: BookOpen, path: '/dashboard/learn' },
    { name: 'Playgrounds', description: 'Practice with virtual currency', icon: Gamepad2, path: '/dashboard/playground' },
    { name: 'Daily Updates', description: 'Live market news & alerts', icon: Newspaper, path: '/dashboard/daily-updates' },
    { name: 'Portfolio', description: 'Track your performance', icon: Briefcase, path: '/dashboard/portfolio' },
];

const DashboardHub = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Trader', xp: 2450, streak: 7, level: 5 });

    useEffect(() => {
        getMe().then((data) => {
            if (data) setUser(data);
        }).catch(() => { });
    }, []);

    const stats = [
        { label: 'Total XP', value: user.xp?.toLocaleString() || '2,450', icon: Star },
        { label: 'Day Streak', value: `${user.streak || 7} Days`, icon: Flame },
        { label: 'Level', value: `Level ${user.level || 5}`, icon: Trophy },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 border-b border-white pb-8">
                <h1 className="text-6xl md:text-8xl font-bold text-white font-display uppercase tracking-tight mb-4 leading-none">
                    Welcome,<br />
                    <span className="text-white/70 italic">{user.name || 'Trader'}</span>
                </h1>
                <p className="font-mono text-white/70 uppercase tracking-widest text-sm">Continue your journey to financial mastery</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white mb-16 bg-background">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-8 border-b md:border-b-0 md:border-r border-white last:border-0 flex items-center gap-6 cursor-default transition-brutal text-white"
                    >
                        <div className="w-14 h-14 border border-white flex items-center justify-center">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-mono uppercase tracking-widest text-white/70 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold font-mono uppercase tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white bg-background">
                {modules.map((mod, i) => (
                    <motion.div
                        key={mod.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => navigate(mod.path)}
                        className={`group p-10 border-b md:border-b-0 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 2 ? 'md:border-b' : ''} border-white hover:bg-white hover:text-background transition-brutal cursor-pointer flex flex-col`}
                    >
                        <div className="w-16 h-16 border border-white group-hover:border-background flex items-center justify-center mb-8 transition-colors">
                            <mod.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-4xl font-bold font-display uppercase tracking-tight mb-4">{mod.name}</h3>
                        <p className="text-lg font-serif text-white/70 group-hover:text-background/70 mb-8 flex-1">{mod.description}</p>
                        <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest font-bold group-hover:ml-4 transition-all">
                            Open Module <ArrowRight className="w-5 h-5" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default DashboardHub;
