import React, { useState } from 'react';
import { Bell, Search, User, Send, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardNavbar = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    return (
        <header className="h-20 border-b border-white bg-background flex items-center justify-between px-8 sticky top-0 z-30">
            {/* Search */}
            <div className="relative max-w-xl w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                    type="text"
                    placeholder="Search modules, lessons, assets..."
                    className="w-full h-12 pl-12 pr-4 bg-transparent border border-white text-white placeholder-white/50 font-mono text-sm uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-brutal"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
                {/* Notification */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`relative w-12 h-12 bg-transparent border border-white flex items-center justify-center transition-brutal cursor-pointer ${isNotificationsOpen ? 'bg-white text-background' : 'text-white/70 hover:text-background hover:bg-white'}`}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-white" />
                    </button>

                    {/* Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-4 w-80 bg-background border border-white z-50 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <div className="p-4 border-b border-white bg-white">
                                <h3 className="text-background font-mono font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> Critical Alerts
                                </h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {[
                                    { id: 1, title: 'CRITICAL MARGIN CALL', description: 'Your account margin level has dropped below 20%. Action required.', time: '2m ago' },
                                    { id: 2, title: 'SYSTEM VULNERABILITY', description: 'Attempted login from unrecognized terminal in London, UK.', time: '15m ago' },
                                    { id: 3, title: 'MARKET VOLATILITY', description: 'BTC/USD has dropped 12% in the last 10 minutes. Liquidity is low.', time: '1h ago' },
                                ].map((notif) => (
                                    <div key={notif.id} className="p-4 border-b border-white hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-white font-mono font-bold text-xs uppercase tracking-tighter bg-red-600 px-1 py-0.5">CRITICAL</span>
                                            <span className="text-white/30 font-mono text-[10px] uppercase">{notif.time}</span>
                                        </div>
                                        <h4 className="text-white font-mono font-bold uppercase text-[13px] tracking-widest mb-1 group-hover:text-red-500 transition-colors">{notif.title}</h4>
                                        <p className="text-white/50 font-mono text-[11px] leading-relaxed lowercase">{notif.description}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full p-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors border-t border-white" onClick={() => setIsNotificationsOpen(false)}>
                                Dismiss All
                            </button>
                        </div>
                    )}
                </div>

                {/* User */}
                <div className="flex items-center gap-4 px-4 py-2 border border-transparent hover:border-white transition-brutal cursor-pointer">
                    <div className="w-10 h-10 border border-white p-1">
                        <div className="w-full h-full bg-white flex items-center justify-center">
                            <User className="w-5 h-5 text-background" />
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-mono uppercase font-bold tracking-widest text-white">Trader</p>
                        <p className="text-xs font-mono uppercase tracking-widest text-white/50">Level 5</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
