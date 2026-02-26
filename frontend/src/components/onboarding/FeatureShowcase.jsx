import React from 'react';
import GlowCard from '@/components/shared/GlowCard';
import { BookOpen, Gamepad2, Newspaper, Briefcase } from 'lucide-react';

const features = [
    {
        title: "Learn",
        description: "AI-curated learning modules covering market analysis, trading strategies, risk management, and behavioral finance. Progress at your own pace with personalized recommendations.",
        icon: BookOpen,
    },
    {
        title: "Playgrounds",
        description: "Practice trading in a risk-free simulated environment with ₹10,00,000 virtual currency. Execute trades, analyze results, and learn from AI-powered post-session reviews.",
        icon: Gamepad2,
    },
    {
        title: "Daily Updates",
        description: "Stay ahead with live market-impacting news, real-time alerts, and AI-driven sentiment analysis. Filter by asset class, ticker, or impact severity.",
        icon: Newspaper,
    },
    {
        title: "Portfolio",
        description: "Track your virtual portfolio performance with detailed analytics, asset allocation charts, transaction history, and AI-powered diversification reviews.",
        icon: Briefcase,
    },
];

const FeatureShowcase = () => {
    return (
        <section id="features" className="py-32 bg-black relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                        <span className="text-sm font-medium text-white tracking-wide">Everything You Need</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white font-[var(--font-outfit)] mb-6">
                        Learn. Practice. <br />
                        <span className="text-zinc-500">Master the markets.</span>
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Four powerful modules designed to take you from finance beginner to confident trader.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, i) => (
                        <GlowCard
                            key={i}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                            className="h-[280px]"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureShowcase;
