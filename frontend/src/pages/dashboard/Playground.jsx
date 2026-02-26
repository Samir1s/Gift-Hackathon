import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

    // Scenario parameters
    let basePrice, volatility, trend, eventCandle, eventType;

    switch (scenarioId) {
        case 'zero-day-vulnerability':
            basePrice = 450;
            volatility = 2; // Low normal volatility
            trend = 0.5; // Slight upward trend initially
            eventCandle = 60; // Event happens at 60th candle
            eventType = 'crash'; // Massive drop
            break;
        case 'earnings-surprise-rally':
            basePrice = 850;
            volatility = 5; // Moderate volatility
            trend = 0; // Flat initial trend
            eventCandle = 80;
            eventType = 'gap-up'; // Massive rally
            break;
        case 'interest-rate-shock':
            basePrice = 5100;
            volatility = 15; // High volatility
            trend = -2; // Steady downward trend
            eventCandle = 0; // Constant effect
            eventType = 'steady-drop';
            break;
        case 'crypto-flash-crash':
            basePrice = 60000;
            volatility = 200; // Crypto volatility
            trend = 50; // Slight uptrend
            eventCandle = 50; // Crash halfway
            eventType = 'flash-crash'; // V-shape recovery
            break;
        case 'oil-supply-disruption':
            basePrice = 75;
            volatility = 0.5;
            trend = 0.1;
            eventCandle = 40;
            eventType = 'spike-consolidate'; // Spikes then goes sideways
            break;
        default:
            basePrice = 45000;
            volatility = 100;
            trend = 0;
            eventCandle = 0;
            eventType = 'random';
            break;
    }

    let currentPrice = basePrice;

    // Generate backwards so the latest candle is at `now`
    let prices = [];
    for (let i = 0; i <= numCandles; i++) {
        // Handle events
        if (eventType === 'crash' && i >= eventCandle) {
            currentPrice -= currentPrice * 0.05 + Math.random() * (currentPrice * 0.02); // Drops 5-7% per candle for a bit
        } else if (eventType === 'gap-up' && i === eventCandle) {
            currentPrice += currentPrice * 0.15; // 15% instant gap up
        } else if (eventType === 'gap-up' && i > eventCandle) {
            currentPrice += currentPrice * 0.01 + Math.random() * (currentPrice * 0.01); // Continued rally
        } else if (eventType === 'flash-crash' && i === eventCandle) {
            currentPrice -= currentPrice * 0.20; // 20% instant drop
        } else if (eventType === 'flash-crash' && i > eventCandle && i < eventCandle + 20) {
            currentPrice += currentPrice * 0.015; // Quick partial recovery
        } else if (eventType === 'spike-consolidate' && i === eventCandle) {
            currentPrice += currentPrice * 0.10; // 10% spike
        } else if (eventType === 'spike-consolidate' && i > eventCandle) {
            currentPrice += (Math.random() - 0.5) * volatility; // Sideways consolidation
        } else {
            // Normal walk
            currentPrice += trend + (Math.random() - 0.5) * volatility * 2;
        }

        currentPrice = Math.max(0.01, currentPrice); // Prevent negative prices
        prices.push(currentPrice);
    }

    // Now convert prices to candles, starting from oldest timestamp
    for (let j = 0; j <= numCandles; j++) {
        const i = numCandles - j;
        const open = prices[j];

        let close = prices[j + 1] || open + (Math.random() - 0.5) * volatility;

        // Ensure gap up/down logic holds for Open/Close
        if (eventType === 'gap-up' && j === eventCandle) {
            close = open; // The gap is between prev close and this open
        }

        // Generate high and low based on open and close
        const maxPrice = Math.max(open, close);
        const minPrice = Math.min(open, close);

        // Add wick volatility (1x to 2x base volatility)
        const high = maxPrice + Math.random() * volatility * 1.5;
        const low = Math.max(0.01, minPrice - Math.random() * volatility * 1.5);

        data.push({
            time: now - i * 3600, // 1 hour candles
            open: +open.toFixed(2),
            high: +high.toFixed(2),
            low: +low.toFixed(2),
            close: +close.toFixed(2)
        });
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

    // Fetch scenarios from backend
    useEffect(() => {
        getScenarios().then(data => {
            if (data && data.length > 0) {
                setScenarios(data);
                setSelectedScenario(data[0]);
            }
        }).catch(() => { });
    }, []);

    // Start a new session when scenario changes
    useEffect(() => {
        startSession(selectedScenario.id).then(data => {
            if (data && data.id) {
                setSessionId(data.id);
                setBalance(data.balance);
                setPosition(data.position);
            }
        }).catch(() => { });
    }, [selectedScenario]);

    // Init chart
    useEffect(() => {
        let chart;
        const initChart = async () => {
            try {
                const { createChart, CandlestickSeries } = await import('lightweight-charts');
                if (!chartContainerRef.current) return;
                chart = createChart(chartContainerRef.current, {
                    layout: { background: { color: 'transparent' }, textColor: '#6B7280' },
                    grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
                    crosshair: { mode: 0 },
                    rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)' },
                    timeScale: { borderColor: 'rgba(255,255,255,0.06)' },
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
                const series = chart.addSeries(CandlestickSeries, {
                    upColor: '#00E0A4', downColor: '#FF4D6D',
                    borderUpColor: '#00E0A4', borderDownColor: '#FF4D6D',
                    wickUpColor: '#00E0A4', wickDownColor: '#FF4D6D',
                });

                // Try to fetch chart data from backend, fall back to local generation
                let chartData;
                try {
                    chartData = await getChartData();
                } catch {
                    chartData = null;
                }
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
        } catch {
            // Fallback to local trading
        }

        // Local fallback
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
        <div className="h-[calc(100vh-112px)] flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-[var(--font-outfit)] mb-1">Playgrounds</h1>
                    <p className="text-[#A8B0C3] text-sm">Practice trading with virtual currency</p>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-[#151824] border border-white/[0.06]">
                    <span className="text-xs text-[#6B7280]">Balance</span>
                    <p className="text-xl font-bold text-white font-[var(--font-outfit)] tabular-nums">₹{balance.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="flex-1 flex gap-5 min-h-0">
                {/* Scenarios */}
                <div className="w-56 space-y-2 overflow-y-auto shrink-0">
                    <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Scenarios</h3>
                    {scenarios.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedScenario(s)}
                            className={`w-full text-left p-3 rounded-xl border transition-all text-sm cursor-pointer ${selectedScenario.id === s.id
                                ? 'border-[#7B3FE4]/40 bg-[#7B3FE4]/10 text-white shadow-[0_0_16px_rgba(123,63,228,0.1)]'
                                : 'border-white/[0.06] bg-[#151824] text-[#A8B0C3] hover:text-white hover:bg-[#1C1F2E]'
                                }`}
                        >
                            <p className="font-medium text-sm truncate">{s.title}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">{s.asset}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[#6B7280]">{s.difficulty}</span>
                                <span className="text-[10px] text-[#FFC857] font-bold">{s.xp} XP</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Chart */}
                <div className="flex-1 rounded-2xl border border-white/[0.06] bg-[#151824] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white">{selectedScenario.asset}</h3>
                            <p className="text-xs text-[#6B7280]">{selectedScenario.title}</p>
                        </div>
                        <span className="text-xs text-[#6B7280] flex items-center gap-1"><Clock className="w-3 h-3" /> 1H</span>
                    </div>
                    <div ref={chartContainerRef} className="flex-1" />
                </div>

                {/* Order Panel */}
                <div className="w-72 rounded-2xl border border-white/[0.06] bg-[#151824] p-5 flex flex-col shrink-0">
                    <h3 className="text-base font-bold text-white font-[var(--font-outfit)] mb-4">Execute Trade</h3>

                    <div className="flex gap-2 mb-5">
                        <button
                            onClick={() => setOrderType('buy')}
                            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer btn-press ${orderType === 'buy' ? 'gradient-success text-white shadow-[0_4px_16px_rgba(0,224,164,0.2)]' : 'bg-[#1C1F2E] text-[#6B7280] border border-white/[0.06]'}`}
                        >
                            Buy
                        </button>
                        <button
                            onClick={() => setOrderType('sell')}
                            className={`flex-1 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer btn-press ${orderType === 'sell' ? 'bg-[#FF4D6D] text-white shadow-[0_4px_16px_rgba(255,77,109,0.2)]' : 'bg-[#1C1F2E] text-[#6B7280] border border-white/[0.06]'}`}
                        >
                            Sell
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs text-[#6B7280] mb-1 block">Quantity</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white text-sm focus:outline-none input-glow tabular-nums" />
                        </div>
                        <div>
                            <label className="text-xs text-[#6B7280] mb-1 block">Order Type</label>
                            <select className="w-full h-10 px-3 rounded-xl bg-[#1C1F2E] border border-white/[0.06] text-white text-sm focus:outline-none input-glow appearance-none cursor-pointer">
                                <option>Market Order</option>
                                <option>Limit Order</option>
                                <option>Stop Loss</option>
                            </select>
                        </div>

                        {position && (
                            <div className="p-3 rounded-xl bg-[#7B3FE4]/5 border border-[#7B3FE4]/15">
                                <p className="text-xs text-[#A8B0C3]">Current Position</p>
                                <p className="text-sm font-bold text-white tabular-nums">{position.type} {position.qty} @ ₹{parseFloat(position.price).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleTrade}
                        disabled={loading}
                        className={`w-full h-12 rounded-xl font-bold text-sm mt-4 ${orderType === 'buy'
                            ? 'gradient-success text-white shadow-[0_4px_16px_rgba(0,224,164,0.25)]'
                            : 'bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 text-white shadow-[0_4px_16px_rgba(255,77,109,0.25)]'
                            }`}
                    >
                        {loading ? 'Executing...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedScenario.asset.split('(')[0]}`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Playground;
