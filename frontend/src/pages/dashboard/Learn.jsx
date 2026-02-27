import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, ChevronRight, Brain, Target, TrendingUp, BarChart3, Loader2, ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import { getModules, getProgress, getLearnAIAnalysis, getModule, completeLesson } from '@/lib/api';

const fallbackProgress = [
    { time: '2026-02-21', open: 0, high: 150, low: 0, close: 120 },
    { time: '2026-02-22', open: 120, high: 300, low: 100, close: 250 },
    { time: '2026-02-23', open: 250, high: 270, low: 150, close: 180 },
    { time: '2026-02-24', open: 180, high: 450, low: 180, close: 420 },
    { time: '2026-02-25', open: 420, high: 480, low: 350, close: 380 },
    { time: '2026-02-26', open: 380, high: 550, low: 360, close: 500 },
    { time: '2026-02-27', open: 500, high: 700, low: 490, close: 650 },
];

const fallbackModules = [
    { id: 1, title: "Market Reaction to News", description: "Learn how markets respond to breaking news events", difficulty: "Beginner", lessons: 5, completed: 0, xp: 150, icon: "📰" },
    { id: 2, title: "Technical Analysis Basics", description: "Master candlestick patterns and chart reading", difficulty: "Beginner", lessons: 8, completed: 0, xp: 200, icon: "📊" },
    { id: 3, title: "Risk Management Strategies", description: "Protect your portfolio with smart risk controls", difficulty: "Intermediate", lessons: 6, completed: 0, xp: 250, icon: "🛡️" },
    { id: 4, title: "Behavioral Finance", description: "Understand psychological biases in trading", difficulty: "Intermediate", lessons: 7, completed: 0, xp: 300, icon: "🧠" },
    { id: 5, title: "AI vs Human Prediction", description: "Compare AI models with human trading intuition", difficulty: "Advanced", lessons: 4, completed: 0, xp: 400, icon: "🤖" },
    { id: 6, title: "Financial Terminology", description: "Essential glossary for every trader", difficulty: "Beginner", lessons: 5, completed: 0, xp: 100, icon: "📚" },
];

const fallbackAnalysis = [
    { type: "strength", title: "Strength: Chart Reading", description: "You've shown strong pattern recognition in candlestick analysis. Keep practicing with advanced patterns." },
    { type: "focus", title: "Focus Area: Risk Management", description: "Consider completing the risk management module — it's crucial for consistent trading performance." },
    { type: "recommendation", title: "Recommended Next", description: "Start \"Behavioral Finance\" to understand the psychological aspects that affect your trading decisions." },
];

const Learn = () => {
    const [modules, setModules] = useState(fallbackModules);
    const [progressData, setProgressData] = useState(fallbackProgress);
    const [analysis, setAnalysis] = useState(fallbackAnalysis);
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeModule, setActiveModule] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    const chartContainerRef = React.useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        getModules().then(data => { if (data) setModules(data); }).catch(() => { });
        getProgress().then(data => { if (data) setProgressData(data); }).catch(() => { });

        setLoadingAI(true);
        getLearnAIAnalysis().then(data => {
            if (data && Array.isArray(data)) setAnalysis(data);
        }).catch(() => { }).finally(() => setLoadingAI(false));
    }, []);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        let chart;
        let cancelled = false;

        const initChart = async () => {
            try {
                const { createChart, CandlestickSeries } = await import('lightweight-charts');
                const container = chartContainerRef.current;
                if (cancelled || !container) return;

                const width = container.clientWidth || 300;
                const height = container.clientHeight || 300;

                if (width <= 0 || height <= 0) {
                    if (!cancelled) requestAnimationFrame(initChart);
                    return;
                }

                chart = createChart(container, {
                    layout: { background: { color: 'transparent' }, textColor: '#fff' },
                    grid: { vertLines: { color: 'rgba(255,255,255,0.1)' }, horzLines: { color: 'rgba(255,255,255,0.1)' } },
                    crosshair: { mode: 0, vertLine: { color: '#fff', style: 0 }, horzLine: { color: '#fff', style: 0 } },
                    rightPriceScale: { borderColor: 'rgba(255,255,255,1)' },
                    timeScale: { borderColor: 'rgba(255,255,255,1)' },
                    width: width,
                    height: height,
                });

                if (cancelled) { chart.remove(); chart = null; return; }

                const series = chart.addSeries(CandlestickSeries, {
                    upColor: '#00E0A4', downColor: '#FF4D6D',
                    borderUpColor: '#00E0A4', borderDownColor: '#FF4D6D',
                    wickUpColor: '#00E0A4', wickDownColor: '#FF4D6D',
                });

                if (Array.isArray(progressData) && progressData.length > 0) {
                    series.setData(progressData);
                }
                chart.timeScale().fitContent();
                setChartInstance(chart);
            } catch (err) {
                console.error("Chart initialization error:", err);
            }
        };

        const timer = setTimeout(initChart, 100);

        const handleResize = () => {
            if (!cancelled && chart && chartContainerRef.current) {
                try {
                    chart.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                        height: chartContainerRef.current.clientHeight,
                    });
                } catch (e) { /* chart may be disposed */ }
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            if (chart) {
                try {
                    chart.remove();
                } catch (e) { }
            }
        };
    }, [progressData]);

    const handleModuleClick = async (module) => {
        try {
            const data = await getModule(module.id);
            if (data) {
                setActiveModule(data);
                if (data.lesson_content && data.lesson_content.length > 0) {
                    setActiveLesson(data.lesson_content[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch module details:", error);
        }
    };

    const handleLessonComplete = async (lessonId) => {
        if (!activeModule) return;
        try {
            await completeLesson(activeModule.id, lessonId);
            // Re-fetch module to update progress locally
            const data = await getModule(activeModule.id);
            if (data) setActiveModule(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] border-t border-white border-l-0">
            {/* Left Side — Module List or Module Detail */}
            <div className="w-full lg:w-1/2 overflow-hidden flex flex-col border-r border-white bg-background">
                {!activeModule ? (
                    <div className="flex-1 overflow-y-auto w-full">
                        <div className="p-8 border-b border-white bg-background shrink-0">
                            <h1 className="text-4xl md:text-6xl font-bold text-white font-display uppercase tracking-tight mb-2 leading-none">Learn</h1>
                            <p className="text-white/70 font-mono text-sm uppercase tracking-widest leading-relaxed">AI-curated learning modules tailored to your level</p>
                        </div>

                        {modules.map((mod, i) => (
                            <motion.div
                                key={mod.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => handleModuleClick(mod)}
                                className="group p-8 border-b border-white bg-background hover:bg-white hover:text-background transition-brutal cursor-pointer flex items-start gap-6"
                            >
                                <span className="text-4xl">{mod.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-2xl font-bold font-serif leading-tight group-hover:text-background truncate">{mod.title}</h3>
                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 border border-current shrink-0`}>{mod.difficulty}</span>
                                    </div>
                                    <p className="font-mono text-white/70 group-hover:text-background/70 text-sm mb-6 max-w-lg leading-relaxed">{mod.description}</p>
                                    <div className="flex items-center gap-6">
                                        <div className="flex-1 h-3 border border-current bg-background flex p-[2px]">
                                            <div className="h-full bg-current transition-all" style={{ width: `${(mod.completed / mod.lessons) * 100}%` }} />
                                        </div>
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest shrink-0 tabular-nums">{mod.completed}/{mod.lessons} COMPLETED</span>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            <span className="text-xs font-mono font-bold uppercase tracking-widest tabular-nums">{mod.xp} XP</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 mt-1 flex-shrink-0" />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full"
                    >
                        <div className="p-8 border-b border-white flex items-center gap-6 shrink-0 bg-background">
                            <button
                                onClick={() => { setActiveModule(null); setActiveLesson(null); }}
                                className="p-3 border border-white hover:bg-white hover:text-background transition-brutal cursor-pointer"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">{activeModule.icon}</span>
                                    <h2 className="text-3xl font-bold font-display uppercase tracking-tight">{activeModule.title}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Split the left side into lessons list (top) and active lesson content (bottom) */}
                        <div className="flex flex-col flex-1 overflow-hidden bg-background">
                            {/* Lessons List - Horizontally scrollable row or compact grid */}
                            <div className="flex border-b border-white overflow-x-auto shrink-0 bg-background no-scrollbar">
                                {activeModule.lesson_content && activeModule.lesson_content.map((lesson, index) => {
                                    const isCompleted = index < activeModule.completed;
                                    const isActive = activeLesson?.id === lesson.id;
                                    return (
                                        <div
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`shrink-0 w-64 p-6 border-r border-white cursor-pointer flex flex-col transition-brutal
                                                ${isActive
                                                    ? 'bg-white text-background'
                                                    : 'bg-background text-white hover:bg-white hover:text-background group'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-70">Lesson {index + 1}</span>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : (
                                                    <Circle className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold font-serif line-clamp-2 leading-tight flex-1">
                                                {lesson.title}
                                            </h4>
                                            <span className="text-xs font-mono font-bold uppercase tracking-widest mt-4 opacity-70">{lesson.xp} XP REWARD</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Active Lesson Content Area */}
                            {activeLesson && (
                                <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                                    <h2 className="text-4xl font-bold font-display uppercase tracking-tight mb-4">{activeLesson.title}</h2>
                                    <div className="inline-flex items-center gap-2 mb-10">
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest border border-white px-3 py-1">REWARD: {activeLesson.xp} XP</span>
                                    </div>

                                    <div className="prose prose-invert max-w-none prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-p:text-white/80 prose-li:font-mono prose-li:text-sm prose-li:text-white/80 prose-strong:text-white prose-headings:font-serif prose-headings:font-bold prose-headings:text-2xl mt-4">
                                        {activeLesson.content.split('\n').map((paragraph, i) => {
                                            if (paragraph.startsWith('- ')) {
                                                return <li key={i} className="mb-2 ml-4 list-disc">{paragraph.substring(2)}</li>;
                                            }
                                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                                return <h3 key={i} className="text-xl font-bold font-serif text-white mt-8 mb-4">{paragraph.replace(/\*\*/g, '')}</h3>;
                                            }
                                            if (paragraph.trim() === '') return <div key={i} className="h-4" />;
                                            return <p key={i} className="mb-6">{paragraph}</p>;
                                        })}
                                    </div>

                                    <div className="mt-auto pt-10 flex justify-end">
                                        <button
                                            onClick={() => handleLessonComplete(activeLesson.id)}
                                            className="px-8 py-4 bg-white text-background font-mono font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-brutal"
                                        >
                                            Complete Lesson
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col bg-background">
                {/* Top 60% — Progress Graph */}
                <div className="flex-[3] flex flex-col border-b border-white transition-brutal overflow-hidden">
                    <div className="p-8 pb-4 flex items-center justify-between border-b border-current">
                        <div>
                            <h2 className="text-2xl font-bold font-display uppercase tracking-widest">Learning Progress</h2>
                            <p className="font-mono text-xs uppercase tracking-widest text-white/70 mt-1">XP earned this week</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 border border-current">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-mono font-bold uppercase tracking-widest tabular-nums">+24%</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full bg-background group-hover:bg-background/5 transition-colors p-4 min-h-[300px]">
                        <div ref={chartContainerRef} className="w-full h-full" />
                    </div>
                </div>

                {/* Bottom 40% — AI Analysis */}
                <div className="flex-[2] flex flex-col bg-background p-8 overflow-y-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Brain className="w-8 h-8 text-white" />
                        <h2 className="text-2xl font-bold font-display uppercase tracking-widest">AI Analysis</h2>
                        {loadingAI && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
                    </div>
                    <div className="space-y-4">
                        {analysis.map((item, i) => {
                            let Icon = Target;
                            if (item.type === 'focus') Icon = BarChart3;
                            if (item.type === 'recommendation') Icon = BookOpen;
                            return (
                                <div key={i} className="flex items-start gap-4 p-6 border border-white transition-brutal">
                                    <Icon className="w-6 h-6 shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm font-mono font-bold uppercase tracking-widest mb-2 leading-tight">{item.title}</p>
                                        <p className="text-sm font-serif leading-relaxed text-white/80">{item.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learn;
