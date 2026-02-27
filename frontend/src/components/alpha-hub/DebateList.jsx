import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Activity, Play, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const DebateList = () => {
    const navigate = useNavigate();

    const debates = [
        {
            id: 1,
            topic: "Fed Rate Cut Impact on BTC",
            status: "Live",
            participants: 142,
            type: "AI Moderated",
            participants_dna: ["Aggressive", "Conservative"],
            news_trigger: "FOMC Meeting Minutes Released"
        },
        {
            id: 2,
            topic: "Solana Network Congestion Recovery",
            status: "Scheduled",
            participants: 89,
            type: "Community Led",
            participants_dna: ["Technical", "Fundamentalist"],
            news_trigger: "Mainnet Beta Patch v1.17"
        }
    ];

    return (
        <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold font-display uppercase tracking-widest">Debate Rooms</h2>
            </div>
            <p className="font-mono text-xs opacity-70 uppercase tracking-widest mb-6">Watch opposing Financial DNAs clash live.</p>

            <div className="flex-1 overflow-x-auto flex gap-4 pb-2 scrollbar-none">
                {debates.map((debate, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={debate.id}
                        onClick={() => navigate(`/dashboard/alpha-hub/debate/${debate.id}`)}
                        className="min-w-[300px] border border-white/20 hover:border-white transition-brutal p-5 flex flex-col justify-between cursor-pointer group hover:bg-white hover:text-background"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 flex items-center gap-2 border ${debate.status === 'Live' ? 'border-green-500 text-green-500 group-hover:border-background group-hover:text-background' : 'border-white/30 text-white/50 group-hover:border-background group-hover:text-background'}`}>
                                    {debate.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>}
                                    {debate.status}
                                </span>
                                <span className="font-mono text-[10px] font-bold uppercase tracking-widest border border-current px-2 py-1 opacity-70">
                                    {debate.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold font-serif leading-tight mb-2 group-hover:text-background">{debate.topic}</h3>
                            <div className="flex items-start gap-2 text-xs font-mono uppercase text-white/60 group-hover:text-background/80 mb-4">
                                <Zap className="w-3 h-3 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{debate.news_trigger}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-widest mb-3 opacity-80">
                                <Users className="w-4 h-4" /> {debate.participants} Viewers
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-current text-background group-hover:bg-background group-hover:text-white">
                                    {debate.participants_dna[0]}
                                </div>
                                <span className="font-mono text-xs font-bold italic opacity-50">VS</span>
                                <div className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-current text-background group-hover:bg-background group-hover:text-white">
                                    {debate.participants_dna[1]}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Create New Debate CTA */}
                <div className="min-w-[250px] border border-dashed border-white/30 hover:border-white transition-brutal p-5 flex flex-col items-center justify-center cursor-pointer group bg-white/5 hover:bg-white hover:text-background text-center">
                    <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4 group-hover:rotate-90 transition-transform duration-300">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold font-display uppercase tracking-widest mb-2">Propose Topic</h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">Suggest a debate based on breaking news.</p>
                </div>
            </div>
        </div>
    );
};

export default DebateList;
