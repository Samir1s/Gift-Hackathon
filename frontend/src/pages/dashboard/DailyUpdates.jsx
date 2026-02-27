import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, Bell, Flame, Zap, Globe, Loader2, X, Info, Target } from 'lucide-react';
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

const generateMockCandleData = (sentiment = 'Neutral', count = 100) => {
    let data = [];
    let time = Math.floor(Date.now() / 1000) - count * 3600;
    let basePrice = 50000;
    let lastClose = basePrice + (Math.random() - 0.5) * (basePrice * 0.1);

    const trend = sentiment === 'Bullish' ? 0.002 : sentiment === 'Bearish' ? -0.002 : 0;

    for (let i = 0; i < count; i++) {
        const volatility = 0.01;
        const open = lastClose;
        const move = (Math.random() - 0.5 + trend) * (open * volatility);
        const close = open + move;
        const high = Math.max(open, close) + Math.random() * (open * 0.002);
        const low = Math.min(open, close) - Math.random() * (open * 0.002);

        data.push({
            time: time,
            open,
            high,
            low,
            close,
        });

        time += 3600;
        lastClose = close;
    }
    return data;
};

const NewsChartModal = ({ isOpen, onClose, news }) => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !chartContainerRef.current) return;

        let chart;
        let cancelled = false;
        let resizeHandler;

        const initChart = async () => {
            try {
                const { createChart, CandlestickSeries } = await import('lightweight-charts');
                if (cancelled || !chartContainerRef.current) return;

                chartContainerRef.current.innerHTML = '';

                chart = createChart(chartContainerRef.current, {
                    layout: { background: { color: 'transparent' }, textColor: '#fff' },
                    grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
                    crosshair: { mode: 0, vertLine: { color: '#fff', style: 0 }, horzLine: { color: '#fff', style: 0 } },
                    rightPriceScale: { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent' },
                    timeScale: { borderColor: 'rgba(255,255,255,0.2)' },
                    width: chartContainerRef.current.clientWidth,
                    height: 400,
                });

                if (cancelled) { chart.remove(); chart = null; return; }

                const series = chart.addSeries(CandlestickSeries, {
                    upColor: '#00E0A4', downColor: '#FF4D6D',
                    borderUpColor: '#00E0A4', borderDownColor: '#FF4D6D',
                    wickUpColor: '#00E0A4', wickDownColor: '#FF4D6D',
                });

                const chartData = generateMockCandleData(news?.sentiment);
                series.setData(chartData);
                chart.timeScale().fitContent();

                resizeHandler = () => {
                    if (!cancelled && chartContainerRef.current && chart) {
                        try {
                            chart.applyOptions({
                                width: chartContainerRef.current.clientWidth,
                            });
                        } catch (e) { /* chart may be disposed */ }
                    }
                };

                window.addEventListener('resize', resizeHandler);

            } catch (err) { console.error('Chart error:', err); }
        };

        initChart();

        return () => {
            cancelled = true;
            if (resizeHandler) window.removeEventListener('resize', resizeHandler);
            if (chart) { try { chart.remove(); } catch (e) { /* already disposed */ } }
        };
    }, [isOpen, news]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 30, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 30, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-5xl bg-background border border-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Left Side: Content */}
                    <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] px-3 py-1 border border-white/30 text-white/50">
                                TradeQuest Intelligence
                            </span>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border ${news?.sentiment === 'Bullish' ? 'border-[#00E0A4] text-[#00E0A4]' : news?.sentiment === 'Bearish' ? 'border-[#FF4D6D] text-[#FF4D6D]' : 'border-white/50 text-white/50'}`}>
                                    {news?.sentiment}
                                </span>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">{news?.category}</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold font-display uppercase leading-[0.9] text-white tracking-tighter">
                                {news?.title}
                            </h2>

                            <p className="text-lg font-serif text-white/70 leading-relaxed italic border-l-2 border-white/20 pl-6 py-2">
                                {news?.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Source</p>
                                    <p className="text-sm font-mono font-bold text-white uppercase">{news?.source}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Impact Level</p>
                                    <p className={`text-sm font-mono font-bold uppercase ${news?.impact === 'Critical' ? 'text-red-500' : 'text-white'}`}>{news?.impact}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Simulation */}
                    <div className="w-full md:w-[45%] bg-white/2 flex flex-col">
                        <div className="p-6 border-b border-white flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#00E0A4]" />
                                <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">Market Simulation</span>
                            </div>
                            <div className="px-2 py-1 border border-white/20 text-[10px] font-mono text-white/50">LIVE-ISH</div>
                        </div>

                        <div className="flex-1 p-4 flex flex-col">
                            <div ref={chartContainerRef} className="flex-1 min-h-[300px] w-full" />

                            <div className="mt-6 p-6 border border-white/20 bg-background/50">
                                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#00E0A4] mb-3">
                                    <Target className="w-3 h-3" />
                                    <span>AI Trading Insight</span>
                                </div>
                                <p className="text-xs font-mono text-white/60 leading-relaxed uppercase tracking-wider">
                                    {news?.sentiment === 'Bullish'
                                        ? "Positioning for a breakout above psychological resistance. Volume indicator suggests strong institutional accumulation."
                                        : news?.sentiment === 'Bearish'
                                            ? "Bearish momentum accelerating. Liquidity sweep expected below current support levels before any reversal."
                                            : "Market indecision in progress. Wait for confirmed candle close above current range highs for directional bias."
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 mt-auto">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-white text-background font-mono font-bold uppercase tracking-widest text-xs hover:invert transition-all flex items-center justify-center gap-2 group"
                            >
                                Acknowledge Simulation <Info className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const DailyUpdates = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [newsData, setNewsData] = useState(fallbackNews);
    const [alerts, setAlerts] = useState(fallbackAlerts);
    const [loading, setLoading] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

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
                            onClick={() => setSelectedNews(news)}
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

            <NewsChartModal
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
                news={selectedNews}
            />
        </div>
    );
};

export default DailyUpdates;
