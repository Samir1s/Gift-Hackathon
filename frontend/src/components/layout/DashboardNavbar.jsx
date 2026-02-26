import React from 'react';
import { Bell, Search, User, Send, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardNavbar = () => {
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
                {/* CTA */}
                <Button className="bg-white text-background font-mono uppercase font-bold tracking-widest rounded-none h-12 px-6 hover:bg-transparent hover:text-white border border-white transition-brutal cursor-pointer">
                    <Send className="w-4 h-4 mr-2" /> Send & Receive
                </Button>

                {/* Notification */}
                <button className="relative w-12 h-12 bg-transparent border border-white flex items-center justify-center text-white/70 hover:text-background hover:bg-white transition-brutal cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-white" />
                </button>

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
