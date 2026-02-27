import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Download, Brain, Loader2, Activity } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { getPortfolio, getPortfolioAIReview, getBatchForecast } from '@/lib/api';

const fallbackHoldings = [
    { name: 'NVIDIA', ticker: 'NVDA', qty: 25, avgPrice: 890, currentPrice: 945, dayChange: 2.3 },
    { name: 'Bitcoin', ticker: 'BTC', qty: 0.5, avgPrice: 42000, currentPrice: 60500, dayChange: 4.1 },
    { name: 'Apple', ticker: 'AAPL', qty: 50, avgPrice: 178, currentPrice: 195, dayChange: -0.8 },
    { name: 'S&P 500 ETF', ticker: 'SPY', qty: 30, avgPrice: 450, currentPrice: 512, dayChange: 0.5 },
    { name: 'Gold', ticker: 'GLD', qty: 15, avgPrice: 185, currentPrice: 210, dayChange: 1.2 },
    { name: 'Tesla', ticker: 'TSLA', qty: 20, avgPrice: 240, currentPrice: 255, dayChange: -1.5 },
];

const fallbackAllocation = [
    { name: 'Stocks', value: 42, color: '#ffffff' },
    { name: 'Crypto', value: 24, color: '#bbbbbb' },
    { name: 'ETFs', value: 20, color: '#888888' },
    { name: 'Commodities', value: 14, color: '#555555' },
];

const fallbackPerformance = [
    { month: 'Sep', value: 1000000 }, { month: 'Oct', value: 1034000 }, { month: 'Nov', value: 1065000 },
    { month: 'Dec', value: 1120000 }, { month: 'Jan', value: 1180000 }, { month: 'Feb', value: 1247830 },
];

const fallbackAIReview = [
    { title: "Diversification: Good", description: "Your portfolio spans 4 asset classes with reasonable distribution. Consider adding fixed income for stability." },
    { title: "Risk: Moderate", description: "24% crypto allocation adds volatility. Your Sharpe ratio of 1.4 is healthy but could improve with rebalancing." },
    { title: "Suggestion: Take Profits", description: "Consider taking partial profits on BTC (+44% gain) and reallocating to index ETFs to reduce individual asset risk." },
];

const Portfolio = () => {
    const [portfolioValue, setPortfolioValue] = useState(1247830);
    const [dailyPnl, setDailyPnl] = useState(24570);
    const [totalPnl, setTotalPnl] = useState(247830);
    const [winRate, setWinRate] = useState(68.4);
    const [holdings, setHoldings] = useState(fallbackHoldings);
    const [allocationData, setAllocationData] = useState(fallbackAllocation);
    const [performanceData, setPerformanceData] = useState(fallbackPerformance);
    const [aiReview, setAiReview] = useState(fallbackAIReview);
    const [loadingAI, setLoadingAI] = useState(false);
    const [forecasts, setForecasts] = useState([]);
    const [loadingForecasts, setLoadingForecasts] = useState(false);

    useEffect(() => {
        getPortfolio().then(data => {
            if (data) {
                setPortfolioValue(data.total_value);
                setDailyPnl(data.daily_pnl);
                setTotalPnl(data.total_pnl);
                setWinRate(data.win_rate);
                if (data.holdings) setHoldings(data.holdings);
                if (data.allocation) setAllocationData(data.allocation);
                if (data.performance) setPerformanceData(data.performance);
            }
        }).catch(() => { });

        setLoadingAI(true);
        getPortfolioAIReview().then(data => {
            if (data && Array.isArray(data)) setAiReview(data);
        }).catch(() => { }).finally(() => setLoadingAI(false));

        // Fetch LSTM forecasts for all holdings
        setLoadingForecasts(true);
        const tickers = (holdings || fallbackHoldings).map(h => h.ticker);
        getBatchForecast(tickers, 7).then(data => {
            if (data && Array.isArray(data)) setForecasts(data);
        }).catch(() => { }).finally(() => setLoadingForecasts(false));
    }, []);

    const dailyPnlPct = portfolioValue ? ((dailyPnl / (portfolioValue - dailyPnl)) * 100).toFixed(2) : '0';
    const totalPnlPct = portfolioValue ? ((totalPnl / (portfolioValue - totalPnl)) * 100).toFixed(2) : '0';

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] border-t border-white border-l-0 overflow-y-auto no-scrollbar bg-background text-white">
            <div className="p-8 border-b border-white flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold font-display uppercase tracking-tight mb-2 leading-none">Portfolio</h1>
                    <p className="text-white/70 font-mono text-sm uppercase tracking-widest leading-relaxed">Track your virtual portfolio performance</p>
                </div>
                <button className="px-6 py-3 border border-white font-mono font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-background transition-brutal flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-white shrink-0">
                {[
                    { label: 'Total Value', value: `₹${portfolioValue.toLocaleString('en-IN')}`, icon: DollarSign },
                    { label: 'Daily P&L', value: `${dailyPnl >= 0 ? '+' : ''}₹${Math.abs(dailyPnl).toLocaleString('en-IN')}`, icon: TrendingUp, badge: `${dailyPnl >= 0 ? '+' : ''}${dailyPnlPct}%` },
                    { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}₹${Math.abs(totalPnl).toLocaleString('en-IN')}`, icon: ArrowUpRight, badge: `${totalPnl >= 0 ? '+' : ''}${totalPnlPct}%` },
                    { label: 'Win Rate', value: `${winRate}%`, icon: PieChart },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-8 border-b md:border-b-0 md:border-r border-white last:border-r-0 transition-brutal"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/50">{card.label}</span>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <p className="text-4xl font-mono font-bold uppercase tracking-tight tabular-nums mb-2">{card.value}</p>
                        {card.badge && <span className={`text-xs font-mono font-bold uppercase tracking-widest border border-current px-2 py-1 inline-block`}>{card.badge}</span>}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-b border-white shrink-0">
                {/* Performance Chart */}
                <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-white p-8 transition-brutal">
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-8">Portfolio Performance</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7B3FE4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7B3FE4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1C1F2E', border: '1px solid rgba(123,63,228,0.2)', borderRadius: '12px', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                                <Area type="monotone" dataKey="value" stroke="#9B6DFF" fill="url(#perfGradient)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Allocation */}
                <div className="p-8">
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-8">Asset Allocation</h2>
                    <div className="h-40 w-full mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                                    {allocationData.map((entry, idx) => {
                                        const colors = ['#7B3FE4', '#00E0A4', '#FFC857', '#FF4D6D'];
                                        return <Cell key={idx} fill={colors[idx % colors.length]} />;
                                    })}
                                </Pie>
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        {allocationData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border border-white" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-mono font-bold uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-sm font-mono font-bold tabular-nums">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-0">
                {/* AI Review */}
                <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white p-8 shrink-0 flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <Brain className="w-8 h-8 text-white" />
                        <h2 className="text-2xl font-bold font-display uppercase tracking-widest">AI Review</h2>
                        {loadingAI && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
                    </div>
                    <div className="space-y-6 flex-1">
                        {aiReview.map((item, i) => (
                            <div key={i} className="p-6 border border-white transition-brutal">
                                <h3 className="text-sm font-mono font-bold uppercase tracking-widest mb-3 leading-tight">{item.title}</h3>
                                <p className="text-sm font-serif leading-relaxed text-white/80">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="flex-1 shrink-0 bg-background overflow-x-auto no-scrollbar">
                    <div className="p-8 border-b border-white">
                        <h2 className="text-2xl font-bold font-display uppercase tracking-widest">Holdings Details</h2>
                    </div>
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="border-b border-white">
                                {['Asset', 'Quantity', 'Avg Price', 'Current', 'P&L', 'Day Change'].map((h) => (
                                    <th key={h} className="text-left px-8 py-6 text-xs font-mono font-bold text-white/50 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((h, i) => {
                                const pnl = (h.currentPrice - h.avgPrice) * h.qty;
                                const pnlPct = ((h.currentPrice - h.avgPrice) / h.avgPrice * 100).toFixed(2);
                                return (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-b border-white transition-colors cursor-default"
                                    >
                                        <td className="px-8 py-6">
                                            <p className="text-lg font-bold font-serif leading-none mb-1">{h.name}</p>
                                            <p className="text-xs font-mono uppercase tracking-widest">{h.ticker}</p>
                                        </td>
                                        <td className="px-8 py-6 text-xl font-mono tabular-nums font-bold">{h.qty}</td>
                                        <td className="px-8 py-6 text-sm font-mono tabular-nums text-current/80">₹{h.avgPrice.toLocaleString()}</td>
                                        <td className="px-8 py-6 text-xl font-mono tabular-nums font-bold">₹{h.currentPrice.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-lg font-mono tabular-nums font-bold flex flex-col">
                                                <span>{pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()}</span>
                                                <span className="text-xs font-mono text-current/50 mt-1 uppercase">({pnlPct}%)</span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-2 text-lg font-mono tabular-nums font-bold">
                                                {h.dayChange >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                                {Math.abs(h.dayChange)}%
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* LSTM Forecast Section */}
            <div className="border-b border-white p-8 shrink-0">
                <div className="flex items-center gap-4 mb-8">
                    <Activity className="w-8 h-8 text-[#7B3FE4]" />
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest">LSTM Forecast</h2>
                    {loadingForecasts && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest ml-auto">7-Day Prediction</span>
                </div>

                {loadingForecasts ? (
                    <div className="flex items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#7B3FE4]" />
                        <span className="text-sm font-mono text-white/60">Training LSTM models for your holdings...</span>
                    </div>
                ) : forecasts.length > 0 ? (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full min-w-max">
                            <thead>
                                <tr className="border-b border-white">
                                    {['Asset', 'Current', 'Predicted (7d)', 'Change', 'Trend', 'RMSE'].map((h) => (
                                        <th key={h} className="text-left px-8 py-4 text-xs font-mono font-bold text-white/50 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {forecasts.map((f, i) => {
                                    if (f.error) {
                                        return (
                                            <tr key={i} className="border-b border-white/10">
                                                <td className="px-8 py-5 text-sm font-mono font-bold">{f.ticker}</td>
                                                <td colSpan={5} className="px-8 py-5 text-sm font-mono text-white/40 italic">Forecast unavailable</td>
                                            </tr>
                                        );
                                    }
                                    const predicted7d = f.predictions?.[f.predictions.length - 1]?.price;
                                    return (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-8 py-5">
                                                <p className="text-lg font-bold font-serif">{f.ticker}</p>
                                            </td>
                                            <td className="px-8 py-5 text-lg font-mono tabular-nums font-bold">${f.current_price}</td>
                                            <td className="px-8 py-5 text-lg font-mono tabular-nums font-bold">${predicted7d}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-lg font-mono tabular-nums font-bold ${(f.change_pct || 0) >= 0 ? 'text-[#00E0A4]' : 'text-[#FF4D6D]'}`}>
                                                    {(f.change_pct || 0) >= 0 ? '+' : ''}{f.change_pct}%
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 border ${f.trend === 'bullish' ? 'border-[#00E0A4] text-[#00E0A4]' :
                                                        f.trend === 'bearish' ? 'border-[#FF4D6D] text-[#FF4D6D]' :
                                                            'border-white/30 text-white/50'
                                                    }`}>
                                                    {f.trend || 'neutral'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-mono tabular-nums text-white/60">{f.train_rmse}</td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm font-mono text-white/40 py-8 text-center">No forecast data available. Backend may be offline.</p>
                )}
            </div>
        </div>
    );
};

export default Portfolio;
