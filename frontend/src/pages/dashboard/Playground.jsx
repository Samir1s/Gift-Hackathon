import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Info, X, Zap, Target, Shield } from 'lucide-react';
import { getScenarios, startSession, executeTrade, getChartData } from '@/lib/api';

const generateMockCandleData = (count = 100) => {
    let data = [];
    let time = Math.floor(Date.now() / 1000) - count * 3600;
    let lastClose = 50000 + (Math.random() - 0.5) * 10000;

    for (let i = 0; i < count; i++) {
        const open = lastClose;
        const close = open + (Math.random() - 0.5) * (open * 0.02);
        const high = Math.max(open, close) + Math.random() * (open * 0.005);
        const low = Math.min(open, close) - Math.random() * (open * 0.005);

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

const TradeInsightPopup = ({ isOpen, onClose, tradeData, insights }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-lg bg-background border border-white shadow-2xl relative overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#00E0A4]" />
                            <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">Trade Execution Insight</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Trade Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-white/20 bg-white/5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Position</p>
                                <p className={`text-xl font-bold font-mono ${tradeData.type === 'buy' ? 'text-[#00E0A4]' : 'text-[#FF4D6D]'}`}>
                                    {tradeData.type.toUpperCase()}
                                </p>
                            </div>
                            <div className="p-4 border border-white/20 bg-white/5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Asset</p>
                                <p className="text-xl font-bold font-mono text-white">{tradeData.asset}</p>
                            </div>
                            <div className="p-4 border border-white/20 bg-white/5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Quantity</p>
                                <p className="text-xl font-bold font-mono text-white">{tradeData.quantity}</p>
                            </div>
                            <div className="p-4 border border-white/20 bg-white/5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Price</p>
                                <p className="text-xl font-bold font-mono text-white">₹{parseFloat(tradeData.price).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* AI Insights Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white/60">
                                <Target className="w-4 h-4" />
                                <span>Risk Analysis & Insights</span>
                            </div>

                            <div className="space-y-3">
                                {insights.map((insight, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 border border-white/10 bg-white/2 hover:bg-white/5 transition-colors items-start">
                                        <div className="shrink-0 mt-1">
                                            {insight.type === 'positive' ? <TrendingUp className="w-4 h-4 text-[#00E0A4]" /> :
                                                insight.type === 'negative' ? <TrendingDown className="w-4 h-4 text-[#FF4D6D]" /> :
                                                    <Info className="w-4 h-4 text-white/50" />}
                                        </div>
                                        <p className="text-sm text-white/80 leading-relaxed font-serif italic">
                                            {insight.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-white/5 text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 border border-white bg-white text-background font-mono font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all"
                        >
                            Acknowledge
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const fallbackScenarios = [
    { id: 'zero-day-vulnerability', title: 'The Zero-Day Vulnerability', asset: 'CYBERFORT (CBFT)', difficulty: 'Beginner', xp: 150 },
    { id: 'earnings-surprise-rally', title: 'Earnings Surprise Rally', asset: 'NVIDIA (NVDA)', difficulty: 'Beginner', xp: 100 },
    { id: 'interest-rate-shock', title: 'Interest Rate Shock', asset: 'S&P 500 (SPY)', difficulty: 'Intermediate', xp: 200 },
    { id: 'crypto-flash-crash', title: 'Crypto Flash Crash', asset: 'Bitcoin (BTC)', difficulty: 'Advanced', xp: 350 },
    { id: 'oil-supply-disruption', title: 'Oil Supply Disruption', asset: 'Crude Oil (CL)', difficulty: 'Intermediate', xp: 250 },
];

const Playground = () => {
    const [balance, setBalance] = useState(1000000);
    const [position, setPosition] = useState(null);
    const [scenarios, setScenarios] = useState(fallbackScenarios);
    const [selectedScenario, setSelectedScenario] = useState(fallbackScenarios[0]);
    const [orderType, setOrderType] = useState('buy');
    const [quantity, setQuantity] = useState('100');
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [currentTradeInsights, setCurrentTradeInsights] = useState([]);
    const [lastTradeData, setLastTradeData] = useState(null);

    const chartContainerRef = useRef(null);

    useEffect(() => {
        getScenarios().then(data => {
            if (data && data.length > 0) {
                setScenarios(data);
                setSelectedScenario(data[0]);
            }
        }).catch(() => { });
    }, []);

    useEffect(() => {
        startSession(selectedScenario.id).then(data => {
            if (data && data.id) {
                setSessionId(data.id);
                setBalance(data.balance);
                setPosition(data.position);
            }
        }).catch(() => { });
    }, [selectedScenario]);

    useEffect(() => {
        let chart;
        let cancelled = false;
        let resizeHandler;

        const initChart = async () => {
            try {
                const { createChart, CandlestickSeries } = await import('lightweight-charts');
                if (cancelled || !chartContainerRef.current) return;

                // Clear existing content
                chartContainerRef.current.innerHTML = '';

                chart = createChart(chartContainerRef.current, {
                    layout: { background: { color: 'transparent' }, textColor: '#fff' },
                    grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
                    crosshair: { mode: 0, vertLine: { color: '#fff', style: 0 }, horzLine: { color: '#fff', style: 0 } },
                    rightPriceScale: { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'transparent' },
                    timeScale: { borderColor: 'rgba(255,255,255,0.2)' },
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });

                if (cancelled) { chart.remove(); chart = null; return; }

                const series = chart.addSeries(CandlestickSeries, {
                    upColor: '#00E0A4', downColor: '#FF4D6D',
                    borderUpColor: '#00E0A4', borderDownColor: '#FF4D6D',
                    wickUpColor: '#00E0A4', wickDownColor: '#FF4D6D',
                });

                let chartData;
                try {
                    chartData = await getChartData(selectedScenario.id);
                } catch {
                    chartData = null;
                }

                if (cancelled) { chart.remove(); chart = null; return; }

                if (!chartData || chartData.length === 0) {
                    chartData = generateMockCandleData();
                }

                series.setData(chartData);
                chart.timeScale().fitContent();

                resizeHandler = () => {
                    if (!cancelled && chartContainerRef.current && chart) {
                        try {
                            chart.applyOptions({
                                width: chartContainerRef.current.clientWidth,
                                height: chartContainerRef.current.clientHeight
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
    }, [selectedScenario]);

    const handleTrade = async () => {
        setLoading(true);
        let tradeResult = null;
        let executionPrice = 0;

        try {
            const sid = sessionId || 'local';
            const result = await executeTrade(sid, orderType, parseInt(quantity) || 0, selectedScenario.id);
            if (result) {
                setBalance(result.balance);
                setPosition(result.position);
                setSessionId(result.id);
                tradeResult = result;
                executionPrice = parseFloat(result.position?.price || 0);
            }
        } catch { }

        if (!tradeResult) {
            // Local fallback logic
            const qty = parseInt(quantity) || 0;
            let basePrice = 45000;
            switch (selectedScenario.id) {
                case 'zero-day-vulnerability': basePrice = 450; break;
                case 'earnings-surprise-rally': basePrice = 850; break;
                case 'interest-rate-shock': basePrice = 5100; break;
                case 'crypto-flash-crash': basePrice = 60000; break;
                case 'oil-supply-disruption': basePrice = 75; break;
                default: basePrice = 45000; break;
            }

            executionPrice = basePrice + (Math.random() - 0.5) * (basePrice * 0.05);
            const cost = qty * executionPrice;

            if (orderType === 'buy' && cost <= balance) {
                setBalance(b => b - cost);
                const newPos = { type: 'LONG', qty, price: executionPrice.toFixed(2), asset: selectedScenario.asset };
                setPosition(newPos);
                tradeResult = { position: newPos };
            } else if (orderType === 'sell' && position) {
                const pnl = (executionPrice - parseFloat(position.price)) * position.qty;
                setBalance(b => b + parseFloat(position.price) * position.qty + pnl);
                tradeResult = { position: { ...position, price: executionPrice.toFixed(2) } };
                setPosition(null);
            }
        }

        if (tradeResult) {
            // Generate Mock Insights based on scenario and trade
            const insights = [
                { type: orderType === 'buy' ? 'positive' : 'negative', text: `Trading ${selectedScenario.asset} during ${selectedScenario.title} is highly volatile. Execution achieved at ₹${executionPrice.toFixed(2)}.` },
                { type: 'info', text: "AI Analysis suggests watching for immediate resistance at the 200-period EMA before further commitment." },
                { type: Math.random() > 0.5 ? 'positive' : 'negative', text: "Smart money flow indicates institutional accumulation despite the current news cycle." }
            ];

            setLastTradeData({
                type: orderType,
                asset: selectedScenario.asset,
                quantity: quantity,
                price: executionPrice.toFixed(2)
            });
            setCurrentTradeInsights(insights);
            setShowInsights(true);
        }

        setLoading(false);
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col border-t border-white border-l-0">
            {/* Header */}
            <div className="flex bg-background border-b border-white justify-between items-center px-8 py-6 shrink-0">
                <div>
                    <h1 className="text-4xl font-bold text-white font-display uppercase tracking-tight mb-1">Playground</h1>
                    <p className="text-white/70 font-mono text-sm uppercase tracking-widest leading-none">Practice trading in simulated environments</p>
                </div>
                <div className="px-6 py-4 border border-white bg-background flex flex-col items-end shrink-0">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/50 mb-1">Balance</span>
                    <p className="text-2xl font-bold text-white font-mono tabular-nums leading-none">₹{balance.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="flex-1 flex min-h-0 bg-background">
                {/* Scenarios Sidebar */}
                <div className="w-80 border-r border-white flex flex-col shrink-0">
                    <div className="p-6 border-b border-white">
                        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest">Scenarios</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto w-full no-scrollbar">
                        {scenarios.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSelectedScenario(s)}
                                className={`w-full text-left p-6 border-b border-white transition-brutal cursor-pointer flex flex-col ${selectedScenario.id === s.id
                                    ? 'bg-white text-background'
                                    : 'bg-background text-white hover:bg-white/10'
                                    }`}
                            >
                                <p className="font-bold font-serif text-xl mb-1 truncate">{s.title}</p>
                                <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${selectedScenario.id === s.id ? 'text-background/70' : 'text-white/70'}`}>{s.asset}</p>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 border ${selectedScenario.id === s.id ? 'border-background/30' : 'border-white/30'}`}>{s.difficulty}</span>
                                    <span className={`text-[10px] font-mono font-bold uppercase tracking-widest tabular-nums ${selectedScenario.id === s.id ? 'opacity-80' : ''}`}>{s.xp} XP</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white flex items-center justify-between shrink-0">
                        <div>
                            <h3 className="text-2xl font-bold font-display uppercase tracking-widest text-white">{selectedScenario.asset}</h3>
                            <p className="text-xs font-mono uppercase tracking-widest text-white/50 mt-1">{selectedScenario.title}</p>
                        </div>
                        <span className="px-3 py-1 border border-white text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2"><Clock className="w-4 h-4" /> 1H</span>
                    </div>
                    <div ref={chartContainerRef} className="flex-1 w-full bg-background" />
                </div>

                {/* Order Panel */}
                <div className="w-96 border-l border-white bg-background flex flex-col shrink-0">
                    <div className="p-6 border-b border-white">
                        <h3 className="text-xl font-bold font-display uppercase tracking-widest text-white">Execute Trade</h3>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto flex flex-col">
                        <div className="flex gap-4 border-b border-white pb-8 mb-8">
                            <button
                                onClick={() => setOrderType('buy')}
                                className={`flex-1 h-14 rounded-xl font-bold transition-all shadow-lg ${orderType === 'buy' ? 'bg-[#00E0A4] text-background shadow-[#00E0A4]/30' : 'bg-transparent text-white border border-[#00E0A4]/30 hover:border-[#00E0A4]'}`}
                            >
                                BUY
                            </button>
                            <button
                                onClick={() => setOrderType('sell')}
                                className={`flex-1 h-14 rounded-xl font-bold transition-all shadow-lg ${orderType === 'sell' ? 'bg-[#FF4D6D] text-background shadow-[#FF4D6D]/30' : 'bg-transparent text-white border border-[#FF4D6D]/30 hover:border-[#FF4D6D]'}`}
                            >
                                SELL
                            </button>
                        </div>

                        <div className="space-y-8 flex-1">
                            <div>
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/50 mb-3 block">Quantity</label>
                                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full h-14 px-4 bg-background border border-white text-white font-mono text-xl focus:outline-none focus:ring-1 focus:ring-white transition-all tabular-nums" />
                            </div>
                            <div>
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-white/50 mb-3 block">Order Type</label>
                                <select className="w-full h-14 px-4 bg-background border border-white text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white transition-all appearance-none rounded-none cursor-pointer uppercase tracking-widest font-bold">
                                    <option>Market Order</option>
                                    <option>Limit Order</option>
                                    <option>Stop Loss</option>
                                </select>
                            </div>

                            {position && (
                                <div className="p-6 border border-white mt-12 bg-white text-background">
                                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-background/50 mb-2">Current Position</p>
                                    <p className="text-xl font-mono font-bold tabular-nums uppercase tracking-widest">{position.type} {position.qty} @ ₹{parseFloat(position.price).toLocaleString()}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleTrade}
                            disabled={loading}
                            className="w-full h-16 bg-white text-background hover:bg-white/90 font-mono font-bold uppercase tracking-widest text-lg transition-brutal mt-8 border border-white disabled:opacity-50"
                        >
                            {loading ? 'Executing...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedScenario.asset.split('(')[0]}`}
                        </button>
                    </div>
                </div>
            </div>

            <TradeInsightPopup
                isOpen={showInsights}
                onClose={() => setShowInsights(false)}
                tradeData={lastTradeData || {}}
                insights={currentTradeInsights}
            />
        </div>
    );
};

export default Playground;
