import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import Waves from '@/components/ui/waves';
import Separator from '@/components/onboarding/Separator';

const OnboardHero = () => {
    return (
        <section className="relative flex flex-col min-h-[calc(100svh-80px)] bg-background overflow-hidden selection:bg-white selection:text-background">

            {/* Top Area: Waves Component */}
            <div className="relative flex-1 w-full z-0 overflow-hidden">
                <Waves
                    lineColor="rgba(255, 255, 255, 0.4)"
                    backgroundColor="transparent"
                    waveSpeedX={0.0125}
                    waveSpeedY={0.01}
                    waveAmpX={40}
                    waveAmpY={20}
                    friction={0.9}
                    tension={0.01}
                    maxCursorMove={120}
                    xGap={12}
                    yGap={36}
                />
            </div>

            {/* Bottom Content Area: Exactly like SHero.astro */}
            <div className="relative w-full z-10 flex flex-col bg-background">

                {/* Top Separator */}
                <Separator strings={["SYSTEM", "ONLINE", "AWAITING", "INPUT", "010101", "110010"]} />

                {/* Massive Typographic Banner Sandbox */}
                <div className="py-6 md:py-8 overflow-hidden bg-background flex justify-start md:justify-center border-b border-t-0 border-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 50, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                        animate={{ opacity: 1, y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                        className="flex flex-row items-center justify-start md:justify-center gap-4 md:gap-x-12 px-8 text-[14vw] md:text-[12vw] xl:text-[10vw] leading-[0.8] font-bold text-white font-display uppercase tracking-tight m-0 select-none whitespace-nowrap"
                    >
                        <span>MASTER</span>
                        <Navigation className="w-[10vw] h-[10vw] md:w-[6vw] md:h-[6vw] xl:w-[4vw] xl:h-[4vw] text-background fill-white rotate-45 shrink-0 border border-white p-2 md:p-3 xl:p-4 rounded-full" strokeWidth={1} />
                        <span>TRADING</span>
                    </motion.h1>
                </div>

                {/* Bottom Separator */}
                <Separator strings={["DO", "THINGS", "YOUR", "WAY", "MASTER", "THE", "MARKETS"]} />

            </div>

        </section>
    );
};

export default OnboardHero;
