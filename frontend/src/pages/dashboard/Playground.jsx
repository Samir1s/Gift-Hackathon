import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { getScenarios, startSession, executeTrade, getChartData } from '@/lib/api';

const fallbackScenarios = [
    { id: 'zero-day-vulnerability', title: 'The Zero-Day Vulnerability', asset: 'CYBERFORT (CBFT)', difficulty: 'Beginner', xp: 150 },
    { id: 'earnings-surprise-rally', title: 'Earnings Surprise Rally', asset: 'NVIDIA (NVDA)', difficulty: 'Beginner', xp: 100 },
    { id: 'interest-rate-shock', title: 'Interest Rate Shock', asset: 'S&P 500 (SPY)', difficulty: 'Intermediate', xp: 200 },
    { id: 'crypto-flash-crash', title: 'Crypto Flash Crash', asset: 'Bitcoin (BTC)', difficulty: 'Advanced', xp: 350 },
    { id: 'oil-supply-disruption', title: 'Oil Supply Disruption', asset: 'Crude Oil (CL)', difficulty: 'Intermediate', xp: 250 },
];

const generateLocalCandlestickData = (scenarioId) => {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const numCandles = 100;

    let basePrice, volatility, trend, eventCandle, eventType;

    switch (scenarioId) {
        case 'zero-day-vulnerability': basePrice = 450; volatility = 2; trend = 0.5; eventCandle = 60; eventType = 'crash'; break;
        case 'earnings-surprise-rally': basePrice = 850; volatility = 5; trend = 0; eventCandle = 80; eventType = 'gap-up'; break;
        case 'interest-rate-shock': basePrice = 5100; volatility = 15; trend = -2; eventCandle = 0; eventType = 'steady-drop'; break;
        case 'crypto-flash-crash': basePrice = 60000; volatility = 200; trend = 50; eventCandle = 50; eventType = 'flash-crash'; break;
        case 'oil-supply-disruption': basePrice = 75; volatility = 0.5; trend = 0.1; eventCandle = 40; eventType = 'spike-consolidate'; break;
        default: basePrice = 45000; volatility = 100; trend = 0; eventCandle = 0; eventType = 'random'; break;
    }

    let currentPrice = basePrice;
    let prices = [];
    for (let i = 0; i <= numCandles; i++) {
        if (eventType === 'crash' && i >= eventCandle) currentPrice -= currentPrice * 0.05 + Math.random() * (currentPrice * 0.02);
        else if (eventType === 'gap-up' && i === eventCandle) currentPrice += currentPrice * 0.15;
        else if (eventType === 'gap-up' && i > eventCandle) currentPrice += currentPrice * 0.01 + Math.random() * (currentPrice * 0.01);
        else if (eventType === 'flash-crash' && i === eventCandle) currentPrice -= currentPrice * 0.20;
        else if (eventType === 'flash-crash' && i > eventCandle && i < eventCandle + 20) currentPrice += currentPrice * 0.015;
        else if (eventType === 'spike-consolidate' && i === eventCandle) currentPrice += currentPrice * 0.10;
        else if (eventType === 'spike-consolidate' && i > eventCandle) currentPrice += (Math.random() - 0.5) * volatility;
        else currentPrice += trend + (Math.random() - 0.5) * volatility * 2;
        currentPrice = Math.max(0.01, currentPrice);
        prices.push(currentPrice);
    }

    for (let j = 0; j <= numCandles; j++) {
        const i = numCandles - j;
        const open = prices[j];
        let close = prices[j + 1] || open + (Math.random() - 0.5) * volatility;
        if (eventType === 'gap-up' && j === eventCandle) close = open;
        const maxPrice = Math.max(open, close);
        const minPrice = Math.min(open, close);
        const high = maxPrice + Math.random() * volatility * 1.5;
        const low = Math.max(0.01, minPrice - Math.random() * volatility * 1.5);

        data.push({ time: now - i * 3600, open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2) });
    }
    return data;
};

const Playground = () => {
    const [balance, setBalance] = useState(1000000);
    const [position, setPosition] = useState(null);
    const [scenarios, setScenarios] = useState(fallbackScenarios);
    const [selectedScenario, setSelectedScenario] = useState(fallbackScenarios[0]);
    const [orderType, setOrderType] = useState('buy');
    const [quantity, setQuantity] = useState('100');
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
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
        const initChart = async () => {
            try {
                const { createChart, CandlestickSeries } = await import('lightweight-charts');
                if (!chartContainerRef.current) return;
                chart = createChart(chartContainerRef.current, {
                    layout: { background: { color: 'transparent' }, textColor: '#fff' },
                    grid: { vertLines: { color: 'rgba(255,255,255,0.1)' }, horzLines: { color: 'rgba(255,255,255,0.1)' } },
                    crosshair: { mode: 0, vertLine: { color: '#fff', style: 0 }, horzLine: { color: '#fff', style: 0 } },
                    rightPriceScale: { borderColor: 'rgba(255,255,255,1)' },
                    timeScale: { borderColor: 'rgba(255,255,255,1)' },
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });

                // Monochrome candle styling
                const series = chart.addSeries(CandlestickSeries, {
                    upColor: '#00E0A4', downColor: '#FF4D6D',
                    borderUpColor: '#00E0A4', borderDownColor: '#FF4D6D',
                    wickUpColor: '#00E0A4', wickDownColor: '#FF4D6D',
                });

                let chartData;
                try { chartData = await getChartData(); } catch { chartData = null; }
                series.setData(chartData && chartData.length > 0 ? chartData : generateLocalCandlestickData(selectedScenario.id));
                chart.timeScale().fitContent();
            } catch (err) { console.error('Chart error:', err); }
        };
        initChart();
        return () => { if (chart) chart.remove(); };
    }, [selectedScenario]);

    const handleTrade = async () => {
        setLoading(true);
        try {
            const sid = sessionId || 'local';
            const result = await executeTrade(sid, orderType, parseInt(quantity) || 0, selectedScenario.id);
            if (result) {
                setBalance(result.balance);
                setPosition(result.position);
                setSessionId(result.id);
                setLoading(false);
                return;
            }
        } catch { }

        const qty = parseInt(quantity) || 0;
        const price = 45000 + (Math.random() - 0.5) * 2000;
        const cost = qty * price;
        if (orderType === 'buy' && cost <= balance) {
            setBalance(b => b - cost);
            setPosition({ type: 'LONG', qty, price: price.toFixed(2), asset: selectedScenario.asset });
        } else if (orderType === 'sell' && position) {
            const pnl = (price - parseFloat(position.price)) * position.qty;
            setBalance(b => b + parseFloat(position.price) * position.qty + pnl);
            setPosition(null);
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
        </div>
    );
};

export default Playground;
