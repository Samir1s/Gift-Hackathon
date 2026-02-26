import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';
import { useLocation } from 'react-router-dom';

const quickReplies = [
    "What's a candlestick pattern?",
    "Analyze my portfolio",
    "Explain risk management",
    "Market sentiment today",
];

const initialMessages = [
    { role: 'ai', content: "SYSTEM ONLINE. TradeQuest AI powered by Gemini. Query market concepts, portfolio analysis, or trading strategies." },
];

const ChatbotFAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const getContext = () => {
        const path = location.pathname;
        if (path.includes('learn')) return 'learn';
        if (path.includes('playground')) return 'playground';
        if (path.includes('daily-updates')) return 'daily-updates';
        if (path.includes('portfolio')) return 'portfolio';
        return 'dashboard';
    };

    const sendMessage = async (text) => {
        const msg = text || input;
        if (!msg.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setInput('');
        setIsTyping(true);
        try {
            const response = await sendChatMessage(msg, getContext());
            if (response && response.content) {
                setMessages(prev => [...prev, { role: 'ai', content: response.content }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: "ERROR: Connection failed. Check port 8000." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "FATAL ERROR: Backend offline." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-white text-background flex items-center justify-center border-t-4 border-l-4 border-r-8 border-b-8 border-transparent hover:border-white hover:bg-background hover:text-white transition-all cursor-pointer shadow-[8px_8px_0_0_#fff0eb] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
            </motion.button>

            {/* Chat Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-28 right-6 z-50 w-[380px] h-[520px] bg-background border border-white flex flex-col overflow-hidden shadow-[12px_12px_0_0_#fff0eb]"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white bg-white text-background flex items-center gap-3">
                            <div className="w-8 h-8 bg-background flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-display uppercase tracking-widest leading-none">TradeQuest AI</h3>
                                <p className="text-[10px] font-mono font-bold uppercase tracking-widest mt-1">[ GEMINI Core ]</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">{msg.role === 'ai' ? 'AI_SYS' : 'USR'}</span>
                                    </div>
                                    <div className={`max-w-[85%] px-4 py-3 font-mono text-sm leading-relaxed border ${msg.role === 'user'
                                        ? 'bg-white text-background border-white'
                                        : 'bg-background text-white border-white'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">AI_SYS</span>
                                    </div>
                                    <div className="bg-background border border-white px-4 py-3 font-mono text-sm">
                                        PROCESSING_
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-4 flex gap-2 flex-wrap">
                                {quickReplies.map((qr, i) => (
                                    <button key={i} onClick={() => sendMessage(qr)}
                                        className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-white hover:bg-white hover:text-background transition-brutal cursor-pointer text-left">
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-white bg-background">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                                    placeholder="ENTER COMMAND..."
                                    disabled={isTyping}
                                    className="flex-1 h-12 px-4 bg-background border border-white text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white transition-all disabled:opacity-50 uppercase placeholder-white/30" />
                                <button type="submit" disabled={isTyping} className="w-12 h-12 bg-white flex items-center justify-center text-background hover:bg-white/90 transition-brutal cursor-pointer disabled:opacity-50 border border-white">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatbotFAB;
