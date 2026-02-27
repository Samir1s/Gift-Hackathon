import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ShieldAlert, Bot, BrainCircuit, Activity, Eye, Zap, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RealityCheckCard = ({ currentBias, currentNews, triggerWords }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md mx-auto my-6 p-6 border border-red-500/50 bg-background relative overflow-hidden group shadow-[0_0_30px_rgba(239,68,68,0.1)]"
    >
        {/* Background grid */}
        <div className="absolute inset-0 z-0 flex rounded bg-[length:14px_14px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-background to-background opacity-50" />

        <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-red-500 animate-pulse" />
                    <span className="font-display font-bold uppercase tracking-widest text-red-500">Echo Chamber Detected</span>
                </div>
                <span className="font-mono text-[10px] uppercase text-red-500/70 border border-red-500/30 px-2 py-0.5">Automated NLP Alert</span>
            </div>

            <p className="font-mono text-xs text-white/80 leading-relaxed border-l-2 border-red-500 pl-3 py-1">
                The NLP Engine has detected multiple instances of unfounded hype. Real-time metrics show a significant divergence from the community narrative.
            </p>

            <div className="space-y-3 bg-red-500/5 border border-red-500/20 p-4">
                <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest text-white/90">
                    <span className="opacity-70">Community Bias</span>
                    <span className="font-bold text-green-400">Bullish ({currentBias}%)</span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest text-white/90">
                    <span className="opacity-70">Global News Sentiment</span>
                    <span className="font-bold text-red-400">Bearish ({currentNews}%)</span>
                </div>
                <div className="pt-3 border-t border-red-500/10 flex justify-between items-center font-mono text-xs uppercase tracking-widest text-red-400/80">
                    <span className="opacity-70 flex items-center gap-1"><Zap className="w-3 h-3" /> Flagged Words</span>
                    <span>{triggerWords.join(', ')}</span>
                </div>
            </div>

            <button className="w-full mt-2 py-3 border border-red-500/50 font-mono text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-brutal">
                View Objective Reality Report
            </button>
        </div>
    </motion.div>
);

const DebateRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Mock initial chat data based on Debate List
    const initialMessages = [
        {
            id: 1,
            type: "system",
            content: "Debate Room initialized. Topic: Fed Rate Cut Impact on BTC. AI Moderator is active."
        },
        {
            id: 2,
            type: "moderator",
            content: "Welcome participants. We have 'CryptoWhale99' representing the Aggressive DNA, and 'ZenTrader' representing the Conservative DNA. The floor is open."
        },
        {
            id: 3,
            type: "user",
            author: "CryptoWhale99",
            dna: "Aggressive",
            rank: "Master",
            content: "A 50bps cut is basically guaranteed liquidity. If you aren't heavily allocated right now, you hate money. The DXY is slipping and BTC always front-runs the actual injection.",
            timestamp: "10:02 AM",
            isMaster: true
        }
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [echoCount, setEchoCount] = useState(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            type: "user",
            author: "You",
            dna: "Unknown",
            rank: "Beginner",
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMaster: false
        };

        setMessages(prev => [...prev, newUserMessage]);

        // Simple mock of NLP Engine checking for echo chamber buzzwords
        const hypeWords = ['to the moon', 'pump', 'lambo', 'guaranteed', 'all in', 'wgmi'];
        const inputLower = inputValue.toLowerCase();

        const foundHype = hypeWords.some(word => inputLower.includes(word));

        if (foundHype) {
            setEchoCount(prev => prev + 1);
            if (echoCount + 1 >= 2) {
                // Inject Reality Check Card
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        type: "reality_check",
                        triggerWords: hypeWords.filter(word => inputLower.includes(word)),
                        bias: 85,
                        news: 32
                    }]);
                    setEchoCount(0); // Reset after triggering
                }, 1500);
            }
        }

        setInputValue("");
    };

    return (
        <div className="flex flex-col h-full bg-background border-t border-l border-white overflow-hidden relative">
            {/* Header */}
            <div className="p-6 border-b border-white flex items-center justify-between shrink-0 bg-background z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/alpha-hub')}
                        className="p-3 border border-white hover:bg-white hover:text-background transition-brutal cursor-pointer flex items-center gap-3"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest hidden sm:inline">Back</span>
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight leading-none text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none">Debate: Fed Rate Cuts</h1>
                        <p className="font-mono text-xs uppercase text-white/70 tracking-widest mt-1">AI-Moderated Discussion</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 border border-white/20 px-3 py-1 font-mono text-[10px] uppercase text-white/70 mr-4">
                        <Users className="w-3 h-3" /> 142 Viewers
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 border border-white text-white font-mono text-xs font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                        Live
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 relative pb-20">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className="flex flex-col gap-1 w-full"
                        >
                            {msg.type === "system" && (
                                <div className="text-center py-4 text-white/30 font-mono text-xs uppercase tracking-widest">
                                    <span className="w-16 h-px bg-white/10 inline-block align-middle mr-4"></span>
                                    {msg.content}
                                    <span className="w-16 h-px bg-white/10 inline-block align-middle ml-4"></span>
                                </div>
                            )}

                            {msg.type === "moderator" && (
                                <div className="max-w-3xl self-start w-full bg-blue-500/10 border-l-2 border-blue-500 p-4">
                                    <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-400">
                                        <Bot className="w-4 h-4" /> AI Moderator
                                    </div>
                                    <p className="font-mono text-sm leading-relaxed text-white/90">{msg.content}</p>
                                </div>
                            )}

                            {msg.type === "reality_check" && (
                                <RealityCheckCard currentBias={msg.bias} currentNews={msg.news} triggerWords={msg.triggerWords} />
                            )}

                            {msg.type === "user" && (
                                <div className={`flex flex-col ${msg.author === 'You' ? 'items-end' : 'items-start'} max-w-3xl w-full ${msg.author === 'You' ? 'self-end' : 'self-start'}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 ${msg.author === 'You' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className={`font-mono text-sm font-bold uppercase ${msg.isMaster ? 'text-yellow-400' : 'text-white'}`}>{msg.author}</span>
                                        <span className="font-mono text-[10px] uppercase opacity-50 tracking-widest">{msg.timestamp}</span>
                                        {msg.dna !== "Unknown" && (
                                            <span className="font-mono text-[10px] uppercase border px-1 py-0.5 opacity-70 ml-2">
                                                {msg.dna}
                                            </span>
                                        )}
                                        {msg.isMaster && (
                                            <span className="font-mono text-[10px] font-bold uppercase bg-yellow-400/20 text-yellow-400 px-1 py-0.5 ml-1 flex items-center gap-1">
                                                <Eye className="w-3 h-3" /> Master Insight
                                            </span>
                                        )}
                                    </div>
                                    <div className={`p-4 border ${msg.author === 'You'
                                        ? 'border-white bg-white text-background rounded-tr-none'
                                        : msg.isMaster
                                            ? 'border-yellow-400 bg-yellow-400/5 rounded-tl-none shadow-[0_0_15px_rgba(250,204,21,0.05)]'
                                            : 'border-white/20 bg-background rounded-tl-none'
                                        }`}
                                    >
                                        <p className="font-mono text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-background border-t border-white shrink-0 z-20">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4 w-full">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="ENTER YOUR ARGUMENT (Try 'to the moon')..."
                        className="flex-1 bg-transparent border border-white p-4 font-mono text-sm uppercase tracking-widest text-white placeholder:text-white/40 focus:outline-none focus:bg-white/5 transition-brutal"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`px-6 sm:px-8 py-4 border border-white font-mono font-bold uppercase tracking-widest text-sm whitespace-nowrap transition-brutal ${inputValue.trim() ? 'bg-white text-background hover:bg-white/90' : 'text-white/30 cursor-not-allowed'}`}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DebateRoom;
