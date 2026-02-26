import React from 'react';
import { BookOpen, Gamepad2, Newspaper, Briefcase } from 'lucide-react';

const FEATURES = [
    { title: "Learn", detail: "Modules & Quizzes", icon: BookOpen },
    { title: "Playgrounds", detail: "Live Simulator", icon: Gamepad2 },
    { title: "Updates", detail: "Market News", icon: Newspaper },
    { title: "Portfolio", detail: "AI Analytics", icon: Briefcase },
];

const FeatureShowcase = () => {
    return (
        <section id="features" className="relative z-10 w-full bg-background py-32 md:py-48 lg:py-60 overflow-hidden selection:bg-white selection:text-background">

            {/* The constrained inner box mirroring `.s__inner` */}
            <div className="mx-auto w-[85vw] md:w-[70vw] lg:w-[39.25rem] border border-white flex flex-col">

                {/* Block: About */}
                <div className="flex flex-col border-b border-white">
                    {/* Tiny header mirroring `.s__title` */}
                    <h2 className="m-0 bg-white text-background text-[10px] md:text-xs font-mono font-bold tracking-[0.1em] uppercase text-center py-1">
                        ABOUT
                    </h2>

                    {/* Content area mirroring `.s__content` */}
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col gap-8 text-[1.5rem] md:text-[2rem] font-serif font-light text-white leading-[1.3] md:leading-[1.4]">
                        <p>
                            Learn elite strategies, practice with simulated markets, and dominate your portfolio — all orchestrated by artificial intelligence.
                        </p>
                        <p>
                            Curiosity and the drive to learn are the most valuable skills for any trader.
                            That hunger to understand how markets work, to find clever strategies,
                            and to constantly push boundaries—that’s what makes this craft so rewarding.
                        </p>
                        <p>
                            We built TradeQuest to share the knowledge behind successful trading.
                            If you’re a beginner, we hope it helps you learn faster, trade smarter,
                            and gain confidence in your own journey before risking real capital.
                        </p>
                    </div>
                </div>

                {/* Block: Features */}
                <div className="flex flex-col">
                    <h2 className="m-0 bg-white text-background text-[10px] md:text-xs font-mono font-bold tracking-[0.1em] uppercase text-center py-1 border-b border-white">
                        FEATURES
                    </h2>

                    <div className="grid grid-cols-2 divide-x divide-y divide-white border-b-0 border-white">
                        {FEATURES.map((feat, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square flex flex-col justify-between p-6 md:p-8 hover:bg-white transition-colors duration-200 cursor-default border-t border-white"
                            >
                                <div className="flex justify-between items-start w-full">
                                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/50 group-hover:text-background/50">
                                        0{index + 1}
                                    </span>
                                    <feat.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-background transition-colors duration-200" strokeWidth={1} />
                                </div>
                                <div className="flex flex-col gap-1 mt-auto">
                                    <span className="text-xl md:text-3xl font-display uppercase tracking-tight text-white group-hover:text-background transition-colors duration-200 leading-none">
                                        {feat.title}
                                    </span>
                                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/50 group-hover:text-background/50">
                                        {feat.detail}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeatureShowcase;
