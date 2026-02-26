import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const generateCandlestickData = () => {
    const data = [];
    let price = 45000;
    const now = Date.now();
    for (let i = 100; i >= 0; i--) {
        const open = price + (Math.random() - 0.5) * 500;
        const close = open + (Math.random() - 0.5) * 800;
        const high = Math.max(open, close) + Math.random() * 300;
        const low = Math.min(open, close) - Math.random() * 300;
        data.push({ time: Math.floor((now - i * 3600000) / 1000), open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2) });
        price = close;
    }
    return data;
};

const scenarios = [
    { id: 'zero-day', title: 'The Zero-Day Vulnerability', asset: 'CYBERFORT (CBFT)', difficulty: 'Beginner', xp: 150 },
    { id: 'earnings', title: 'Earnings Surprise Rally', asset: 'NVIDIA (NVDA)', difficulty: 'Beginner', xp: 100 },
    { id: 'interest', title: 'Interest Rate Shock', asset: 'S&P 500 (SPY)', difficulty: 'Intermediate', xp: 200 },
    { id: 'crypto', title: 'Crypto Flash Crash', asset: 'Bitcoin (BTC)', difficulty: 'Advanced', xp: 350 },
    { id: 'oil', title: 'Oil Supply Disruption', asset: 'Crude Oil (CL)', difficulty: 'Intermediate', xp: 250 },
];

const Playground = () => {
    const [balance, setBalance] = useState(1000000);
    const [position, setPosition] = useState(null);
    const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
    const [orderType, setOrderType] = useState('buy');
    const [quantity, setQuantity] = useState('100');
    const chartContainerRef = useRef(null);

    useEffect(() => {
        let chart;
        const initChart = async () => {
            try {
                const { createChart } = await import('lightweight-charts');
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
                const series = chart.addCandlestickSeries({
                    upColor: '#00E0A4', downColor: '#FF4D6D',
                    borderUpColor: '#00E0A4', borderDownColor: '#FF4D6D',
                    wickUpColor: '#00E0A4', wickDownColor: '#FF4D6D',
                });
                series.setData(generateCandlestickData());
                chart.timeScale().fitContent();
            } catch (err) { console.error('Chart error:', err); }
        };
        initChart();
        return () => { if (chart) chart.remove(); };
    }, [selectedScenario]);

    const handleTrade = () => {
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
                        className={`w-full h-12 rounded-xl font-bold text-sm mt-4 ${orderType === 'buy'
                            ? 'gradient-success text-white shadow-[0_4px_16px_rgba(0,224,164,0.25)]'
                            : 'bg-[#FF4D6D] hover:bg-[#FF4D6D]/90 text-white shadow-[0_4px_16px_rgba(255,77,109,0.25)]'
                            }`}
                    >
                        {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedScenario.asset.split('(')[0]}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Playground;
