import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Gamepad2, Newspaper, Briefcase, TrendingUp, ChevronLeft, ChevronRight, Settings, LogOut, Trophy } from 'lucide-react';

const navItems = [
    { name: 'Learn', path: '/dashboard/learn', icon: BookOpen },
    { name: 'Playgrounds', path: '/dashboard/playground', icon: Gamepad2 },
    { name: 'Daily Updates', path: '/dashboard/daily-updates', icon: Newspaper },
    { name: 'Portfolio', path: '/dashboard/portfolio', icon: Briefcase },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen sticky top-0 flex flex-col border-r border-white/[0.06] bg-[#0F1117] z-40"
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-6">
                <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-[0_0_16px_rgba(123,63,228,0.3)]">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-0.5">
                                <span className="font-[var(--font-aesthetic)] italic text-lg text-white">Trade</span>
                                <span className="font-[var(--font-outfit)] font-bold text-lg text-white">Quest</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button onClick={() => setCollapsed(!collapsed)} className={`text-[#A8B0C3] hover:text-white transition-colors cursor-pointer ${collapsed ? 'hidden' : ''}`}>
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>

            {/* XP Badge */}
            <div className={`mx-4 mb-5 px-4 py-3 rounded-xl gradient-primary shadow-[0_4px_20px_rgba(123,63,228,0.25)] ${collapsed ? 'mx-2 px-2 flex justify-center' : ''}`}>
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#FFC857] shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <span className="text-xs font-bold text-white">2,450 XP</span>
                                <span className="text-xs text-white/60 ml-1">Level 5</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${isActive
                                ? 'text-white'
                                : 'text-[#A8B0C3] hover:text-white hover:bg-white/[0.04]'
                                } ${collapsed ? 'justify-center px-2' : ''}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl gradient-primary shadow-[0_4px_16px_rgba(123,63,228,0.25)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
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
            <div className="px-3 pb-4 space-y-1">
                <NavLink to="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#A8B0C3] hover:text-white hover:bg-white/[0.04] transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
                    <Settings className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Settings</span>}
                </NavLink>
                <NavLink to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#A8B0C3] hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/5 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Log out</span>}
                </NavLink>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
