import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, ChevronRight, Brain, Target, TrendingUp, BarChart3, Loader2, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getModules, getProgress, getLearnAIAnalysis, getModule, completeLesson } from '@/lib/api';

const fallbackProgress = [
    { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 250 }, { day: 'Wed', xp: 180 },
    { day: 'Thu', xp: 420 }, { day: 'Fri', xp: 380 }, { day: 'Sat', xp: 500 }, { day: 'Sun', xp: 650 },
];

const fallbackModules = [
    { id: 1, title: "Market Reaction to News", description: "Learn how markets respond to breaking news events", difficulty: "Beginner", lessons: 5, completed: 3, xp: 150, icon: "📰" },
    { id: 2, title: "Technical Analysis Basics", description: "Master candlestick patterns and chart reading", difficulty: "Beginner", lessons: 8, completed: 5, xp: 200, icon: "📊" },
    { id: 3, title: "Risk Management Strategies", description: "Protect your portfolio with smart risk controls", difficulty: "Intermediate", lessons: 6, completed: 2, xp: 250, icon: "🛡️" },
    { id: 4, title: "Behavioral Finance", description: "Understand psychological biases in trading", difficulty: "Intermediate", lessons: 7, completed: 0, xp: 300, icon: "🧠" },
    { id: 5, title: "AI vs Human Prediction", description: "Compare AI models with human trading intuition", difficulty: "Advanced", lessons: 4, completed: 0, xp: 400, icon: "🤖" },
    { id: 6, title: "Financial Terminology", description: "Essential glossary for every trader", difficulty: "Beginner", lessons: 10, completed: 10, xp: 100, icon: "📚" },
];

const fallbackAnalysis = [
    { type: "strength", title: "Strength: Chart Reading", description: "You've shown strong pattern recognition in candlestick analysis. Keep practicing with advanced patterns." },
    { type: "focus", title: "Focus Area: Risk Management", description: "Consider completing the risk management module — it's crucial for consistent trading performance." },
    { type: "recommendation", title: "Recommended Next", description: "Start \"Behavioral Finance\" to understand the psychological aspects that affect your trading decisions." },
];

const analysisColors = {
    strength: { bg: 'bg-[#7B3FE4]/5', border: 'border-[#7B3FE4]/10', icon: Target, iconColor: 'text-[#9B6DFF]' },
    focus: { bg: 'bg-[#FFC857]/5', border: 'border-[#FFC857]/10', icon: BarChart3, iconColor: 'text-[#FFC857]' },
    recommendation: { bg: 'bg-[#6C7CFF]/5', border: 'border-[#6C7CFF]/10', icon: BookOpen, iconColor: 'text-[#6C7CFF]' },
};

const difficultyColors = {
    Beginner: 'text-[#00E0A4] bg-[#00E0A4]/10 border-[#00E0A4]/20',
    Intermediate: 'text-[#FFC857] bg-[#FFC857]/10 border-[#FFC857]/20',
    Advanced: 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20',
};

const Learn = () => {
    const [modules, setModules] = useState(fallbackModules);
    const [progressData, setProgressData] = useState(fallbackProgress);
    const [analysis, setAnalysis] = useState(fallbackAnalysis);
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeModule, setActiveModule] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    useEffect(() => {
        getModules().then(data => { if (data) setModules(data); }).catch(() => { });
        getProgress().then(data => { if (data) setProgressData(data); }).catch(() => { });

        setLoadingAI(true);
        getLearnAIAnalysis().then(data => {
            if (data && Array.isArray(data)) setAnalysis(data);
        }).catch(() => { }).finally(() => setLoadingAI(false));
    }, []);

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
        <div className="flex gap-6 h-[calc(100vh-112px)]">
            {/* Left Side — Module List or Module Detail */}
            <div className="w-1/2 overflow-y-auto pr-4 flex flex-col">
                {!activeModule ? (
                    <div className="space-y-3">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white font-[var(--font-outfit)] mb-2">Learn</h1>
                            <p className="text-[#A8B0C3] text-sm">AI-curated learning modules tailored to your level</p>
                        </div>

                        {modules.map((mod, i) => (
                            <motion.div
                                key={mod.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => handleModuleClick(mod)}
                                className="group p-5 rounded-2xl border border-white/[0.06] bg-[#151824] hover:translate-y-[-2px] hover:border-[#7B3FE4]/20 hover:shadow-[0_8px_30px_rgba(123,63,228,0.08)] transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{mod.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-semibold text-white truncate">{mod.title}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[mod.difficulty]}`}>{mod.difficulty}</span>
                                        </div>
                                        <p className="text-[#6B7280] text-sm mb-3">{mod.description}</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                                <div className="h-full rounded-full bg-gradient-to-r from-[#7B3FE4] to-[#9B6DFF] transition-all" style={{ width: `${(mod.completed / mod.lessons) * 100}%` }} />
                                            </div>
                                            <span className="text-xs text-[#6B7280] shrink-0 tabular-nums">{mod.completed}/{mod.lessons}</span>
                                            <div className="flex items-center gap-1 text-[#FFC857]">
                                                <Star className="w-3 h-3" />
                                                <span className="text-xs font-bold tabular-nums">{mod.xp} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors mt-1" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full space-y-4"
                    >
                        <div className="flex items-center gap-4 mb-2 shrink-0">
                            <button
                                onClick={() => { setActiveModule(null); setActiveLesson(null); }}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{activeModule.icon}</span>
                                    <h2 className="text-xl font-bold text-white font-[var(--font-outfit)]">{activeModule.title}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Split the left side into lessons list (top) and active lesson content (bottom) */}
                        <div className="flex-1 overflow-y-auto space-y-6 flex flex-col">
                            {/* Lessons List - Horizontally scrollable row or compact grid */}
                            <div className="flex gap-3 overflow-x-auto pb-2 shrink-0 snap-x">
                                {activeModule.lesson_content && activeModule.lesson_content.map((lesson, index) => {
                                    const isCompleted = index < activeModule.completed;
                                    const isActive = activeLesson?.id === lesson.id;
                                    return (
                                        <div
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`snap-start shrink-0 w-48 p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2
                                                ${isActive
                                                    ? 'bg-[#7B3FE4]/10 border-[#7B3FE4]/30 shadow-[0_4px_20px_rgba(123,63,228,0.1)]'
                                                    : 'bg-[#151824] border-white/[0.06] hover:border-white/20'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-[#A8B0C3]">Lesson {index + 1}</span>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-4 h-4 text-[#00E0A4]" />
                                                ) : (
                                                    <Circle className={`w-4 h-4 ${isActive ? 'text-[#9B6DFF]' : 'text-[#6B7280]'}`} />
                                                )}
                                            </div>
                                            <h4 className={`text-sm font-semibold line-clamp-2 leading-tight ${isActive ? 'text-white' : 'text-[#A8B0C3]'}`}>
                                                {lesson.title}
                                            </h4>
                                            <span className="text-xs font-medium text-[#FFC857] mt-auto">{lesson.xp} XP</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Active Lesson Content Area */}
                            {activeLesson && (
                                <div className="flex-1 flex flex-col rounded-2xl border border-white/[0.06] bg-[#151824] p-6 mb-2 overflow-y-auto w-full">
                                    <h2 className="text-xl font-bold text-white mb-2">{activeLesson.title}</h2>
                                    <div className="inline-flex items-center gap-2 mb-6">
                                        <span className="text-xs font-bold text-[#FFC857] bg-[#FFC857]/10 border border-[#FFC857]/20 px-2 py-1 rounded-[6px]">Reward: {activeLesson.xp} XP</span>
                                    </div>

                                    <div className="prose prose-invert max-w-none text-sm prose-p:text-[#A8B0C3] prose-p:leading-relaxed prose-li:text-[#A8B0C3] prose-strong:text-white">
                                        {activeLesson.content.split('\n').map((paragraph, i) => {
                                            if (paragraph.startsWith('- ')) {
                                                return <li key={i} className="mb-2 ml-4 list-disc">{paragraph.substring(2)}</li>;
                                            }
                                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                                return <h3 key={i} className="text-base font-bold text-white mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
                                            }
                                            if (paragraph.trim() === '') return <div key={i} className="h-2" />;
                                            return <p key={i} className="mb-3">{paragraph}</p>;
                                        })}
                                    </div>

                                    <div className="mt-auto pt-4 flex justify-end">
                                        <button
                                            onClick={() => handleLessonComplete(activeLesson.id)}
                                            className="px-4 py-2 text-sm bg-gradient-to-r from-[#7B3FE4] to-[#9B6DFF] hover:from-[#6c36cc] hover:to-[#8a5ce6] text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(123,63,228,0.3)]"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Right Side */}
            <div className="w-1/2 flex flex-col gap-6">
                {/* Top 60% — Progress Graph */}
                <div className="flex-[3] rounded-2xl border border-white/[0.06] bg-[#151824] p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-white font-[var(--font-outfit)]">Learning Progress</h2>
                            <p className="text-[#6B7280] text-sm">XP earned this week</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E0A4]/10 border border-[#00E0A4]/20">
                            <TrendingUp className="w-3 h-3 text-[#00E0A4]" />
                            <span className="text-xs font-bold text-[#00E0A4] tabular-nums">+24%</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={progressData}>
                            <defs>
                                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7B3FE4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7B3FE4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip contentStyle={{ background: '#1C1F2E', border: '1px solid rgba(123,63,228,0.2)', borderRadius: '12px', color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }} />
                            <Area type="monotone" dataKey="xp" stroke="#9B6DFF" fill="url(#xpGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom 40% — AI Analysis */}
                <div className="flex-[2] rounded-2xl border border-white/[0.06] bg-[#151824] p-6 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-[#9B6DFF]" />
                        <h2 className="text-lg font-bold text-white font-[var(--font-outfit)]">AI Analysis</h2>
                        {loadingAI && <Loader2 className="w-4 h-4 text-[#9B6DFF] animate-spin" />}
                    </div>
                    <div className="space-y-3">
                        {analysis.map((item, i) => {
                            const style = analysisColors[item.type] || analysisColors.recommendation;
                            const Icon = style.icon;
                            return (
                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${style.bg} border ${style.border}`}>
                                    <Icon className={`w-4 h-4 ${style.iconColor} mt-0.5 shrink-0`} />
                                    <div>
                                        <p className="text-sm font-medium text-white mb-1">{item.title}</p>
                                        <p className="text-xs text-[#A8B0C3]">{item.description}</p>
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
