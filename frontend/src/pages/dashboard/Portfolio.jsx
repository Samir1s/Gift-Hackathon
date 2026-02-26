import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, Download, Brain } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';

const portfolioValue = 12_47_830;
const dailyPnl = 24_570;
const totalPnl = 2_47_830;

const holdings = [
    { name: 'NVIDIA', ticker: 'NVDA', qty: 25, avgPrice: 890, currentPrice: 945, dayChange: 2.3 },
    { name: 'Bitcoin', ticker: 'BTC', qty: 0.5, avgPrice: 42000, currentPrice: 60500, dayChange: 4.1 },
    { name: 'Apple', ticker: 'AAPL', qty: 50, avgPrice: 178, currentPrice: 195, dayChange: -0.8 },
    { name: 'S&P 500 ETF', ticker: 'SPY', qty: 30, avgPrice: 450, currentPrice: 512, dayChange: 0.5 },
    { name: 'Gold', ticker: 'GLD', qty: 15, avgPrice: 185, currentPrice: 210, dayChange: 1.2 },
    { name: 'Tesla', ticker: 'TSLA', qty: 20, avgPrice: 240, currentPrice: 255, dayChange: -1.5 },
];

const allocationData = [
    { name: 'Stocks', value: 42, color: '#7B3FE4' },
    { name: 'Crypto', value: 24, color: '#6C7CFF' },
    { name: 'ETFs', value: 20, color: '#00E0A4' },
    { name: 'Commodities', value: 14, color: '#FFC857' },
];

const performanceData = [
    { month: 'Sep', value: 1000000 }, { month: 'Oct', value: 1034000 }, { month: 'Nov', value: 1065000 },
    { month: 'Dec', value: 1120000 }, { month: 'Jan', value: 1180000 }, { month: 'Feb', value: 1247830 },
];

const Portfolio = () => {
    return (
        <div className="space-y-6 overflow-y-auto h-[calc(100vh-112px)] pr-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-[var(--font-outfit)] mb-1">Portfolio</h1>
                    <p className="text-[#A8B0C3] text-sm">Track your virtual portfolio performance</p>
                </div>
                <Button variant="secondary" className="text-[#A8B0C3]">
                    <Download className="w-4 h-4 mr-2" /> Export
                </Button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Value', value: `₹${portfolioValue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-white', gradientOverlay: 'from-[#7B3FE4]/5 to-transparent' },
                    { label: 'Daily P&L', value: `+₹${dailyPnl.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-[#00E0A4]', badge: '+1.97%', gradientOverlay: 'from-[#00E0A4]/5 to-transparent' },
                    { label: 'Total P&L', value: `+₹${totalPnl.toLocaleString('en-IN')}`, icon: ArrowUpRight, color: 'text-[#00E0A4]', badge: '+24.78%', gradientOverlay: 'from-[#00E0A4]/5 to-transparent' },
                    { label: 'Win Rate', value: '68.4%', icon: PieChart, color: 'text-[#9B6DFF]', gradientOverlay: 'from-[#9B6DFF]/5 to-transparent' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-5 rounded-2xl border border-white/[0.06] bg-[#151824] bg-gradient-to-br ${card.gradientOverlay} hover:translate-y-[-2px] hover:border-[#7B3FE4]/20 hover:shadow-[0_8px_30px_rgba(123,63,228,0.08)] transition-all duration-200`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#6B7280]">{card.label}</span>
                            <card.icon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <p className={`text-xl font-bold font-[var(--font-outfit)] tabular-nums ${card.color}`}>{card.value}</p>
                        {card.badge && <span className="text-xs text-[#00E0A4] font-medium tabular-nums">{card.badge}</span>}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#151824] p-6">
                    <h2 className="text-lg font-bold text-white font-[var(--font-outfit)] mb-4">Portfolio Performance</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7B3FE4" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#7B3FE4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                            <Tooltip contentStyle={{ background: '#1C1F2E', border: '1px solid rgba(123,63,228,0.2)', borderRadius: '12px', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                            <Area type="monotone" dataKey="value" stroke="#9B6DFF" fill="url(#perfGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Allocation */}
                <div className="rounded-2xl border border-white/[0.06] bg-[#151824] p-6">
                    <h2 className="text-lg font-bold text-white font-[var(--font-outfit)] mb-4">Asset Allocation</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <RechartsPie>
                            <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                {allocationData.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                        </RechartsPie>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                        {allocationData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-[#A8B0C3]">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium text-white tabular-nums">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Holdings Table */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#151824] overflow-hidden">
                <div className="p-5 border-b border-white/[0.06]">
                    <h2 className="text-lg font-bold text-white font-[var(--font-outfit)]">Holdings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['Asset', 'Quantity', 'Avg Price', 'Current', 'P&L', 'Day Change'].map((h) => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">{h}</th>
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
                                        className="border-b border-white/[0.03] hover:bg-[#1C1F2E] transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-white">{h.name}</p>
                                            <p className="text-xs text-[#6B7280]">{h.ticker}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#A8B0C3] tabular-nums">{h.qty}</td>
                                        <td className="px-5 py-4 text-sm text-[#A8B0C3] tabular-nums">₹{h.avgPrice.toLocaleString()}</td>
                                        <td className="px-5 py-4 text-sm text-white font-medium tabular-nums">₹{h.currentPrice.toLocaleString()}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-sm font-medium tabular-nums ${pnl >= 0 ? 'text-[#00E0A4]' : 'text-[#FF4D6D]'}`}>
                                                {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()} ({pnlPct}%)
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`flex items-center gap-1 text-sm font-medium tabular-nums ${h.dayChange >= 0 ? 'text-[#00E0A4]' : 'text-[#FF4D6D]'}`}>
                                                {h.dayChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
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

            {/* AI Review */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#151824] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-[#9B6DFF]" />
                    <h2 className="text-lg font-bold text-white font-[var(--font-outfit)]">AI Portfolio Review</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#00E0A4]/5 border border-[#00E0A4]/15">
                        <h3 className="text-sm font-bold text-[#00E0A4] mb-2">Diversification: Good</h3>
                        <p className="text-xs text-[#A8B0C3]">Your portfolio spans 4 asset classes with reasonable distribution. Consider adding fixed income for stability.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FFC857]/5 border border-[#FFC857]/15">
                        <h3 className="text-sm font-bold text-[#FFC857] mb-2">Risk: Moderate</h3>
                        <p className="text-xs text-[#A8B0C3]">24% crypto allocation adds volatility. Your Sharpe ratio of 1.4 is healthy but could improve with rebalancing.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#7B3FE4]/5 border border-[#7B3FE4]/15">
                        <h3 className="text-sm font-bold text-[#9B6DFF] mb-2">Suggestion</h3>
                        <p className="text-xs text-[#A8B0C3]">Consider taking partial profits on BTC (+44% gain) and reallocating to index ETFs to reduce individual asset risk.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
