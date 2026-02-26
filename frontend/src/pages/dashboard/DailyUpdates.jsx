import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, Bell, Flame, Zap, Globe, Loader2 } from 'lucide-react';
import { getNews, getAlerts } from '@/lib/api';

const categories = ['All', 'Stocks', 'Crypto', 'Forex', 'Commodities', 'Macro'];

const fallbackNews = [
    { id: 1, title: "Fed Signals Potential Rate Cut in Q2 2026", source: "Reuters", time: "2 min ago", category: "Macro", impact: "Critical", sentiment: "Bullish", description: "Federal Reserve hints at possible rate reduction citing easing inflation numbers." },
    { id: 2, title: "Bitcoin Breaks $60K Resistance Level", source: "CoinDesk", time: "15 min ago", category: "Crypto", impact: "High", sentiment: "Bullish", description: "BTC surges past key resistance with record institutional inflows." },
    { id: 3, title: "NVIDIA Reports Record Quarterly Revenue", source: "Bloomberg", time: "1 hour ago", category: "Stocks", impact: "High", sentiment: "Bullish", description: "Chip giant posts $30B quarterly revenue, beating all analyst estimates." },
    { id: 4, title: "Oil Prices Surge on OPEC+ Supply Cut Extension", source: "CNBC", time: "2 hours ago", category: "Commodities", impact: "Medium", sentiment: "Bullish", description: "OPEC+ agrees to extend production cuts through Q3 2026." },
    { id: 5, title: "EUR/USD Falls Below 1.05 on ECB Dovish Signal", source: "Forex Factory", time: "3 hours ago", category: "Forex", impact: "Medium", sentiment: "Bearish", description: "Euro weakens as ECB members signal continued accommodative stance." },
    { id: 6, title: "Major Cybersecurity Breach at Cloud Provider", source: "TechCrunch", time: "4 hours ago", category: "Stocks", impact: "High", sentiment: "Bearish", description: "Leading cloud company faces data breach affecting millions of users." },
    { id: 7, title: "Emerging Markets Rally on Dollar Weakness", source: "Financial Times", time: "5 hours ago", category: "Macro", impact: "Low", sentiment: "Neutral", description: "EM currencies gain as dollar index hits monthly low." },
];

const fallbackAlerts = [
    { id: 1, message: "BTC reached $60,000 — 5-month high", severity: "Critical", time: "Just now" },
    { id: 2, message: "Fed rate decision announcement in 30 min", severity: "High", time: "30 min ago" },
    { id: 3, message: "NVDA earnings beat consensus by 12%", severity: "Medium", time: "1 hour ago" },
    { id: 4, message: "Oil crossed $85/barrel resistance", severity: "Low", time: "2 hours ago" },
];

const sentimentIcons = {
    Bullish: <TrendingUp className="w-4 h-4" />,
    Bearish: <TrendingDown className="w-4 h-4" />,
    Neutral: <Minus className="w-4 h-4" />,
};

const DailyUpdates = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [newsData, setNewsData] = useState(fallbackNews);
    const [alerts, setAlerts] = useState(fallbackAlerts);
    const [loading, setLoading] = useState(false);

    const fetchNewsData = async (category) => {
        setLoading(true);
        try {
            const data = await getNews(category);
            if (data && data.length > 0) {
                setNewsData(data);
            } else {
                if (category === 'All') {
                    setNewsData(fallbackNews);
                } else {
                    setNewsData(fallbackNews.filter(n => n.category === category));
                }
            }
        } catch {
            if (category === 'All') {
                setNewsData(fallbackNews);
            } else {
                setNewsData(fallbackNews.filter(n => n.category === category));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsData('All');
        getAlerts().then(data => { if (data) setAlerts(data); }).catch(() => { });
    }, []);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        fetchNewsData(cat);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-80px)] border-t border-white border-l-0">
            {/* News Feed */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-white">
                <div className="p-8 border-b border-white bg-background shrink-0">
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display uppercase tracking-tight mb-2 leading-none">Daily Updates</h1>
                    <p className="text-white/70 font-mono text-sm uppercase tracking-widest">Live market-impacting news with AI analysis</p>
                </div>

                {/* Category Filters */}
                <div className="flex gap-0 border-b border-white overflow-x-auto shrink-0 bg-background no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-6 py-4 border-r border-white text-xs font-mono font-bold uppercase tracking-widest transition-brutal whitespace-nowrap cursor-pointer ${activeCategory === cat
                                ? 'bg-white text-background'
                                : 'bg-background text-white hover:bg-white hover:text-background'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    {loading && <div className="px-6 py-4 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>}
                </div>

                {/* News Cards */}
                <div className="flex-1 overflow-y-auto bg-background">
                    {newsData.map((news, i) => (
                        <motion.div
                            key={news.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="p-8 border-b border-white hover:bg-white hover:text-background transition-brutal cursor-pointer group flex flex-col"
                            onClick={() => news.url && window.open(news.url, '_blank')}
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h3 className="text-2xl font-bold font-serif leading-tight group-hover:text-background">{news.title}</h3>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 border border-current shrink-0`}>
                                    {news.impact}
                                </span>
                            </div>
                            <p className="text-sm font-mono text-white/70 group-hover:text-background/70 mb-6 flex-1 leading-relaxed max-w-3xl">{news.description}</p>
                            <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-widest text-white/50 group-hover:text-background/60 font-bold">
                                <span className="flex items-center gap-2 border border-current px-2 py-1">{sentimentIcons[news.sentiment] || sentimentIcons.Neutral} {news.sentiment}</span>
                                <span>{news.source}</span>
                                <span className="flex items-center gap-2 border-l pl-6 border-current"><Clock className="w-4 h-4" /> {news.time}</span>
                                <span className="border-l pl-6 border-current">{news.category}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Alert Panel */}
            <div className="w-full lg:w-96 shrink-0 bg-background flex flex-col overflow-hidden">
                <div className="flex items-center gap-4 p-8 border-b border-white shrink-0">
                    <Bell className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white font-display uppercase tracking-widest">Live Alerts</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {alerts.map((alert, i) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 border-b border-white transition-brutal"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center w-8 h-8 border border-current">
                                    {alert.severity === 'Critical' && <Flame className="w-4 h-4" />}
                                    {alert.severity === 'High' && <Zap className="w-4 h-4" />}
                                    {alert.severity === 'Medium' && <AlertTriangle className="w-4 h-4" />}
                                    {alert.severity === 'Low' && <Globe className="w-4 h-4" />}
                                </span>
                                <span className="text-xs font-mono font-bold uppercase tracking-widest">{alert.severity}</span>
                            </div>
                            <p className="text-sm font-serif leading-relaxed mb-3">{alert.message}</p>
                            <p className="text-xs font-mono uppercase tracking-widest text-white/50">{alert.time}</p>
                        </motion.div>
                    ))}

                    <div className="p-8 pb-12">
                        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2"><Flame className="w-4 h-4" /> AI Market Insight</h3>
                        <div className="p-6 border border-white bg-transparent">
                            <p className="text-sm font-serif text-white/80 leading-relaxed">
                                Market sentiment is predominantly bullish today. The Fed's dovish stance combined with strong tech earnings creates a risk-on environment. Watch for potential volatility around the rate decision announcement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyUpdates;
