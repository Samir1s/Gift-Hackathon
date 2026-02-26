import React from 'react';
import { Bell, Search, User, Send, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardNavbar = () => {
    return (
        <header className="h-16 border-b border-white/[0.06] bg-[#0F1117]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Search */}
            <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                    type="text"
                    placeholder="Search modules, lessons, assets..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white placeholder-[#6B7280] text-sm focus:outline-none input-glow transition-all"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* CTA */}
                <Button className="gradient-primary text-white rounded-xl h-9 px-4 text-xs font-semibold shadow-[0_4px_16px_rgba(123,63,228,0.25)] hover:shadow-[0_4px_24px_rgba(123,63,228,0.35)] transition-shadow btn-press">
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Send & Receive
                </Button>

                {/* Notification */}
                <button className="relative w-10 h-10 rounded-xl bg-[#1C1F2E] border border-white/[0.06] flex items-center justify-center text-[#A8B0C3] hover:text-white hover:border-[#7B3FE4]/30 transition-all cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF4D6D] rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full gradient-primary p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#0F1117] flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-white">Trader</p>
                        <p className="text-xs text-[#6B7280]">Level 5</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
