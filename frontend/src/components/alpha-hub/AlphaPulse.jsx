import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, TrendingUp, TrendingDown, Users, BrainCircuit } from 'lucide-react';

const AlphaPulse = () => {
    // Mock Data
    const tokens = [
        { symbol: 'BTC', community: 85, ai: 40, price: '$64,230' },
        { symbol: 'ETH', community: 45, ai: 55, price: '$3,450' },
        { symbol: 'SOL', community: 92, ai: 20, price: '$145' }, // Herd Mentality Candidate
        { symbol: 'DOGE', community: 30, ai: 30, price: '$0.12' },
    ];

    const [activeToken, setActiveToken] = useState(tokens[0]);
    const [showAlert, setShowAlert] = useState(false);

    // Herd Mentality Check: difference > 40 points logic
    useEffect(() => {
        if (Math.abs(activeToken.community - activeToken.ai) > 40) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [activeToken]);

    return (
        <div className="flex flex-col h-full h-full relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold font-display uppercase tracking-widest">Alpha Pulse</h2>
            </div>
            <p className="font-mono text-sm opacity-70 uppercase tracking-widest mb-8">Crowdsourced Sentiment vs AI Reality</p>

            {/* Token Selector */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
                {tokens.map(token => (
                    <button
                        key={token.symbol}
                        onClick={() => setActiveToken(token)}
                        className={`px-6 py-3 font-mono font-bold uppercase tracking-widest text-sm transition-brutal border shrink-0 ${activeToken.symbol === token.symbol ? 'bg-white text-background border-white' : 'bg-transparent text-white border-white/30 hover:border-white'}`}
                    >
                        {token.symbol}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                {/* Community Heatmap */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center font-mono text-sm font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Community Bias</span>
                        <span>{activeToken.community}% Bullish</span>
                    </div>
                    <div className="h-4 w-full bg-white/10 relative overflow-hidden border border-white/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${activeToken.community}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`absolute top-0 left-0 h-full ${activeToken.community > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                    </div>
                </div>

                {/* AI News Sentiment */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center font-mono text-sm font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> AI News Sentiment</span>
                        <span>{activeToken.ai}% Bullish</span>
                    </div>
                    <div className="h-4 w-full bg-white/10 relative overflow-hidden border border-white/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${activeToken.ai}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`absolute top-0 left-0 h-full ${activeToken.ai > 50 ? 'bg-green-500/50' : 'bg-red-500/50'}`}
                        // Using /50 to make it look distinct from community
                        />
                    </div>
                </div>
            </div>

            {/* Herd Mentality Alert Card */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-8 p-6 bg-red-500/10 border border-red-500/50 relative overflow-hidden group"
                    >
                        {/* Background warning pattern */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>

                        <div className="flex items-start gap-4 relative z-10">
                            <ShieldAlert className="w-8 h-8 text-red-500 shrink-0 animate-pulse" />
                            <div>
                                <h3 className="text-xl font-bold font-display uppercase tracking-widest text-red-500 mb-2">Herd Mentality Alert</h3>
                                <p className="font-mono text-sm text-white/80 leading-relaxed">
                                    Extreme divergence detected. The community is heavily {activeToken.community > 50 ? 'optimistic' : 'pessimistic'} about {activeToken.symbol}, but AI analysis of global news and fundamentals indicates the opposite reality.
                                    <br /><br />
                                    <span className="font-bold text-white uppercase">Don't be exit liquidity. Re-evaluate your thesis.</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlphaPulse;
