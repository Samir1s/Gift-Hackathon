import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const quickReplies = [
    "What's a candlestick pattern?",
    "Analyze my portfolio",
    "Explain risk management",
    "Market sentiment today",
];

const initialMessages = [
    { role: 'ai', content: "Hi! I'm your TradeQuest AI assistant. I can help you learn about trading, analyze your portfolio, explain market concepts, and more. What would you like to know?" },
];

const ChatbotFAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const sendMessage = (text) => {
        const msg = text || input;
        if (!msg.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            const responses = {
                "candlestick": "A candlestick pattern shows price movement over a specific time period. The 'body' shows open/close prices, while 'wicks' show high/low. Green candles mean price went up, red means it went down. Common patterns include Doji, Hammer, and Engulfing patterns.",
                "portfolio": "Your portfolio is up 24.78% overall with a strong allocation across stocks (42%), crypto (24%), ETFs (20%), and commodities (14%). I'd suggest taking partial profits on BTC and considering more defensive positions.",
                "risk": "Risk management involves position sizing (never risk more than 1-2% per trade), stop-losses, diversification, and understanding your risk tolerance. The key rule: protect your capital first, profits come second.",
                "sentiment": "Today's market sentiment is predominantly bullish. Fed's dovish signals and strong tech earnings are driving a risk-on environment. BTC just hit $60K, and major indices are near highs. Watch for potential rate decision volatility.",
            };
            const key = Object.keys(responses).find(k => msg.toLowerCase().includes(k));
            const aiResponse = key ? responses[key] : "That's a great question! In the full version, I'd use the Gemini API to give you a detailed, personalized answer. For now, I can help with topics like candlestick patterns, portfolio analysis, risk management, and market sentiment.";
            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-[0_0_30px_rgba(123,63,228,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                whileHover={{ boxShadow: "0 0 40px rgba(123,63,228,0.6)" }}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>

            {/* Chat Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] rounded-2xl border border-white/[0.08] bg-[#151824] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(123,63,228,0.1)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/[0.06] bg-[#0F1117] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-[0_0_12px_rgba(123,63,228,0.3)]">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">TradeQuest AI</h3>
                                <p className="text-xs text-[#00E0A4]">Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'ai' && (
                                        <div className="w-6 h-6 rounded-full bg-[#7B3FE4]/20 flex items-center justify-center shrink-0 mt-1">
                                            <Bot className="w-3 h-3 text-[#9B6DFF]" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'gradient-primary text-white rounded-br-md shadow-[0_4px_12px_rgba(123,63,228,0.2)]'
                                        : 'bg-[#1C1F2E] text-[#A8B0C3] rounded-bl-md'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                            <User className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#7B3FE4]/20 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="w-3 h-3 text-[#9B6DFF]" />
                                    </div>
                                    <div className="bg-[#1C1F2E] px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2 flex gap-2 flex-wrap">
                                {quickReplies.map((qr, i) => (
                                    <button key={i} onClick={() => sendMessage(qr)}
                                        className="px-3 py-1.5 text-xs rounded-full bg-[#1C1F2E] border border-white/[0.08] text-[#A8B0C3] hover:text-white hover:border-[#7B3FE4]/30 transition-all cursor-pointer">
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 border-t border-white/[0.06] bg-[#0F1117]">
                            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 h-10 px-4 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white placeholder-[#6B7280] text-sm focus:outline-none input-glow transition-all" />
                                <button type="submit" className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-[0_4px_12px_rgba(123,63,228,0.25)] hover:shadow-[0_4px_20px_rgba(123,63,228,0.4)] transition-shadow cursor-pointer">
                                    <Send className="w-4 h-4" />
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
