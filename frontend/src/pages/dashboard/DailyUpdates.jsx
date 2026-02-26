import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, Bell, Flame, Zap, Globe } from 'lucide-react';

const categories = ['All', 'Stocks', 'Crypto', 'Forex', 'Commodities', 'Macro'];

const newsData = [
    { id: 1, title: "Fed Signals Potential Rate Cut in Q2 2026", source: "Reuters", time: "2 min ago", category: "Macro", impact: "Critical", sentiment: "Bullish", description: "Federal Reserve hints at possible rate reduction citing easing inflation numbers." },
    { id: 2, title: "Bitcoin Breaks $60K Resistance Level", source: "CoinDesk", time: "15 min ago", category: "Crypto", impact: "High", sentiment: "Bullish", description: "BTC surges past key resistance with record institutional inflows." },
    { id: 3, title: "NVIDIA Reports Record Quarterly Revenue", source: "Bloomberg", time: "1 hour ago", category: "Stocks", impact: "High", sentiment: "Bullish", description: "Chip giant posts $30B quarterly revenue, beating all analyst estimates." },
    { id: 4, title: "Oil Prices Surge on OPEC+ Supply Cut Extension", source: "CNBC", time: "2 hours ago", category: "Commodities", impact: "Medium", sentiment: "Bullish", description: "OPEC+ agrees to extend production cuts through Q3 2026." },
    { id: 5, title: "EUR/USD Falls Below 1.05 on ECB Dovish Signal", source: "Forex Factory", time: "3 hours ago", category: "Forex", impact: "Medium", sentiment: "Bearish", description: "Euro weakens as ECB members signal continued accommodative stance." },
    { id: 6, title: "Major Cybersecurity Breach at Cloud Provider", source: "TechCrunch", time: "4 hours ago", category: "Stocks", impact: "High", sentiment: "Bearish", description: "Leading cloud company faces data breach affecting millions of users." },
    { id: 7, title: "Emerging Markets Rally on Dollar Weakness", source: "Financial Times", time: "5 hours ago", category: "Macro", impact: "Low", sentiment: "Neutral", description: "EM currencies gain as dollar index hits monthly low." },
];

const alerts = [
    { id: 1, message: "BTC reached $60,000 — 5-month high", severity: "Critical", time: "Just now" },
    { id: 2, message: "Fed rate decision announcement in 30 min", severity: "High", time: "30 min ago" },
    { id: 3, message: "NVDA earnings beat consensus by 12%", severity: "Medium", time: "1 hour ago" },
    { id: 4, message: "Oil crossed $85/barrel resistance", severity: "Low", time: "2 hours ago" },
];

const impactColors = {
    Critical: 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20',
    High: 'text-[#FFC857] bg-[#FFC857]/10 border-[#FFC857]/20',
    Medium: 'text-[#6C7CFF] bg-[#6C7CFF]/10 border-[#6C7CFF]/20',
    Low: 'text-[#00E0A4] bg-[#00E0A4]/10 border-[#00E0A4]/20',
};

const sentimentIcons = {
    Bullish: <TrendingUp className="w-3 h-3 text-[#00E0A4]" />,
    Bearish: <TrendingDown className="w-3 h-3 text-[#FF4D6D]" />,
    Neutral: <Minus className="w-3 h-3 text-[#6B7280]" />,
};

const DailyUpdates = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const filtered = activeCategory === 'All' ? newsData : newsData.filter(n => n.category === activeCategory);

    return (
        <div className="flex gap-6 h-[calc(100vh-112px)]">
            {/* News Feed */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white font-[var(--font-outfit)] mb-2">Daily Updates</h1>
                    <p className="text-[#A8B0C3] text-sm">Live market-impacting news with AI analysis</p>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer btn-press ${activeCategory === cat
                                ? 'gradient-primary text-white shadow-[0_4px_12px_rgba(123,63,228,0.25)]'
                                : 'bg-[#1C1F2E] text-[#A8B0C3] hover:text-white border border-white/[0.06]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* News Cards */}
                <div className="space-y-3">
                    {filtered.map((news, i) => (
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="p-5 rounded-2xl border border-white/[0.06] bg-[#151824] hover:translate-y-[-2px] hover:border-[#7B3FE4]/20 hover:shadow-[0_8px_30px_rgba(123,63,228,0.08)] transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-base font-semibold text-white group-hover:text-[#9B6DFF] transition-colors">{news.title}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${impactColors[news.impact]}`}>{news.impact}</span>
                            </div>
                            <p className="text-sm text-[#6B7280] mb-3">{news.description}</p>
                            <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                <span className="flex items-center gap-1">{sentimentIcons[news.sentiment]} {news.sentiment}</span>
                                <span>{news.source}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.time}</span>
                                <span className="text-[#A8B0C3] font-medium">{news.category}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Alert Panel */}
            <div className="w-80 shrink-0 rounded-2xl border border-white/[0.06] bg-[#151824] p-5 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-5 h-5 text-[#9B6DFF]" />
                    <h2 className="text-lg font-bold text-white font-[var(--font-outfit)]">Live Alerts</h2>
                </div>

                <div className="space-y-3">
                    {alerts.map((alert, i) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-3 rounded-xl border ${impactColors[alert.severity]}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {alert.severity === 'Critical' && <Flame className="w-3 h-3" />}
                                {alert.severity === 'High' && <Zap className="w-3 h-3" />}
                                {alert.severity === 'Medium' && <AlertTriangle className="w-3 h-3" />}
                                {alert.severity === 'Low' && <Globe className="w-3 h-3" />}
                                <span className="text-xs font-bold">{alert.severity}</span>
                            </div>
                            <p className="text-sm text-white">{alert.message}</p>
                            <p className="text-xs text-[#6B7280] mt-1">{alert.time}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <h3 className="text-sm font-bold text-white mb-3">AI Market Insight</h3>
                    <div className="p-3 rounded-xl bg-[#7B3FE4]/5 border border-[#7B3FE4]/15">
                        <p className="text-xs text-[#A8B0C3] leading-relaxed">
                            Market sentiment is predominantly bullish today. The Fed's dovish stance combined with strong tech earnings creates a risk-on environment. Watch for potential volatility around the rate decision announcement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyUpdates;
