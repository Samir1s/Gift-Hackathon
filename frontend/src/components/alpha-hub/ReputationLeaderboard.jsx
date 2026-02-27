import React from 'react';
import { Trophy, Star, ShieldCheck, Wallet, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ReputationLeaderboard = () => {
    const leaderboard = [
        { id: 1, name: "CryptoWhale99", rank: "Master", accuracy: "94%", xp: "14,500", walletVerified: true, isCurrentUser: false },
        { id: 2, name: "PatternTrader", rank: "Master", accuracy: "89%", xp: "12,200", walletVerified: true, isCurrentUser: false },
        { id: 3, name: "AlphaSeeker", rank: "Expert", accuracy: "82%", xp: "9,800", walletVerified: false, isCurrentUser: false },
        { id: 4, name: "DefiDegen", rank: "Expert", accuracy: "78%", xp: "8,450", walletVerified: true, isCurrentUser: false },
        { id: 5, name: "ZenTrader", rank: "Advanced", accuracy: "71%", xp: "6,100", walletVerified: false, isCurrentUser: false },
        { id: 42, name: "You", rank: "Intermediate", accuracy: "62%", xp: "2,450", walletVerified: true, isCurrentUser: true }
    ];

    return (
        <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-white" />
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest leading-none">Reputation</h2>
                </div>
                <div className="flex items-center gap-2 border border-white px-3 py-1 bg-white/5 cursor-help" title="Connect Wallet to verify on-chain">
                    <Wallet className="w-4 h-4 text-white/70" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Web3 Portfolio</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-none space-y-3">
                {leaderboard.map((user, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={user.id}
                        className={`p-4 border transition-brutal flex items-center gap-4 ${user.isCurrentUser ? 'bg-white text-background border-white' : 'bg-transparent border-white/20 hover:border-white'}`}
                    >
                        <div className="w-8 text-center font-display text-xl font-bold opacity-50">
                            #{user.id === 42 ? '42' : index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-mono text-sm font-bold uppercase tracking-widest truncate">{user.name}</p>
                                {user.walletVerified && (
                                    <ShieldCheck className={`w-4 h-4 shrink-0 ${user.isCurrentUser ? 'text-background' : 'text-blue-400'}`} title="Verified Web3 Wallet" />
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${user.isCurrentUser ? 'border-background/30' : 'border-white/30'}`}>
                                    {user.rank}
                                </span>
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <div className="flex items-center justify-end gap-1 font-mono text-sm font-bold">
                                {user.accuracy} <Star className="w-3 h-3" />
                            </div>
                            <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{user.xp} XP</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-6 py-4 border border-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-background transition-brutal flex items-center justify-center gap-2">
                Connect Wallet to Boost Reputation <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ReputationLeaderboard;
