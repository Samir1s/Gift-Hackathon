import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OnboardHero = () => {
    const ref = useRef(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Gradient Orbs */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-[#7B3FE4]/10 blur-[150px]" />
                <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-[#9B6DFF]/8 blur-[120px]" />
                <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-[#6C7CFF]/6 blur-[100px]" />
            </motion.div>

            <motion.div style={{ opacity }} className="relative z-10 max-w-5xl mx-auto px-6 py-32">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B3FE4]/10 border border-[#7B3FE4]/20 text-[#9B6DFF] text-sm font-medium mb-8"
                >
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Finance Education
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-8xl font-bold font-[var(--font-outfit)] leading-[0.95] tracking-tight mb-8"
                >
                    <span className="text-white">Master </span>
                    <span className="font-[var(--font-aesthetic)] italic font-light text-gradient-purple">trading</span>
                    <br />
                    <span className="text-gradient">with every lesson</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-[#A8B0C3] max-w-xl leading-relaxed mb-10"
                >
                    Learn trading strategies, practice with simulated markets,
                    and track your portfolio — all powered by AI intelligence.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4"
                >
                    <Button onClick={() => navigate('/login')} size="lg"
                        className="gradient-primary text-white font-semibold shadow-[0_4px_20px_rgba(123,63,228,0.3)] hover:shadow-[0_4px_30px_rgba(123,63,228,0.5)] btn-press">
                        Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="secondary" size="lg" className="btn-press">
                        Explore Features
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default OnboardHero;
