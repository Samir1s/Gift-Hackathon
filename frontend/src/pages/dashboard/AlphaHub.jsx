import React from 'react';
import AlphaPulse from '@/components/alpha-hub/AlphaPulse';
import ReputationLeaderboard from '@/components/alpha-hub/ReputationLeaderboard';
import DebateList from '@/components/alpha-hub/DebateList';
import { Users } from 'lucide-react';

const AlphaHub = () => {
    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white font-display uppercase tracking-tight mb-2 leading-none">Alpha Hub</h1>
                    <p className="text-white/70 font-mono text-sm uppercase tracking-widest leading-relaxed">Community Sentiment & Intelligence</p>
                </div>
                <Users className="w-10 h-10 text-white/20 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left Column: Alpha Pulse */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex-1 bg-background border border-white p-6 relative overflow-hidden group">
                        <AlphaPulse />
                    </div>
                    {/* Bottom Left: Debate Rooms */}
                    <div className="flex-[0.8] bg-background border border-white p-6 relative overflow-hidden group">
                        <DebateList />
                    </div>
                </div>

                {/* Right Column: Reputation Leaderboard */}
                <div className="bg-background border border-white p-6 relative overflow-hidden group">
                    <ReputationLeaderboard />
                </div>
            </div>
        </div>
    );
};

export default AlphaHub;
