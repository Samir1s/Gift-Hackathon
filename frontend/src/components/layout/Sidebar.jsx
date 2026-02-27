import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Gamepad2, Newspaper, Briefcase, ChevronLeft, Settings, LogOut, Trophy, Users } from 'lucide-react';

const navItems = [
    { name: 'Learn', path: '/dashboard/learn', icon: BookOpen },
    { name: 'Playgrounds', path: '/dashboard/playground', icon: Gamepad2 },
    { name: 'Daily Updates', path: '/dashboard/daily-updates', icon: Newspaper },
    { name: 'Portfolio', path: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Community', path: '/dashboard/community', icon: Users },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 300 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="h-screen sticky top-0 flex flex-col border-r border-white bg-background z-40"
        >
            {/* Logo */}
            <div className="flex items-start justify-between px-8 py-8 border-b border-white">
                <div className={`flex flex-col items-start gap-0 cursor-pointer ${collapsed ? 'hidden' : ''}`}>
                    <span className="font-display uppercase font-bold text-3xl text-white leading-none">Trade</span>
                    <span className="font-display uppercase font-bold text-3xl text-white leading-none">Quest</span>
                </div>
                <button onClick={() => setCollapsed(!collapsed)} className="text-white hover:text-white/70 transition-colors cursor-pointer mt-1">
                    <ChevronLeft className={`w-6 h-6 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* XP Badge */}
            <div className={`mx-6 mt-8 mb-6 border border-white p-4 ${collapsed ? 'hidden' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-white" />
                        <span className="font-mono text-sm uppercase tracking-widest text-white">2,450 XP</span>
                    </div>
                </div>
                <div className="mt-2 text-xs font-mono uppercase text-white/50">Level 5</div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-4 mt-2 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-4 font-mono uppercase text-sm tracking-widest transition-brutal group relative ${isActive
                                ? 'text-background bg-white'
                                : 'text-white/70 hover:text-background hover:bg-white'
                                } ${collapsed ? 'justify-center px-0' : ''}`}
                        >
                            <item.icon className="w-5 h-5 shrink-0 relative z-10" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-4 pb-8 space-y-2 border-t border-white pt-6">
                <NavLink to="/dashboard/settings" className={`flex items-center gap-4 px-4 py-4 font-mono uppercase text-sm tracking-widest text-white/70 hover:text-background hover:bg-white transition-brutal ${collapsed ? 'justify-center px-0' : ''}`}>
                    <Settings className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Settings</span>}
                </NavLink>
                <NavLink to="/" className={`flex items-center gap-4 px-4 py-4 font-mono uppercase text-sm tracking-widest text-white/70 hover:text-background hover:bg-white transition-brutal ${collapsed ? 'justify-center px-0' : ''}`}>
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Log out</span>}
                </NavLink>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
