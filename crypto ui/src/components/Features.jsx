import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Shield, Zap, Lock, Globe, Layers, ArrowUpRight } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

// Refined Glow Card component
const GlowCard = ({ title, description, icon: Icon, className }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div
            className={cn("group relative border border-white/10 bg-black overflow-hidden rounded-3xl", className)}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                        650px circle at ${mouseX}px ${mouseY}px,
                        rgba(255, 255, 255, 0.1),
                        transparent 80%
                        )
                    `,
                }}
            />
            {/* Subtle border highlight on hover */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                        600px circle at ${mouseX}px ${mouseY}px,
                        rgba(255, 255, 255, 0.4),
                        transparent 40%
                        )
                    `,
                    maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                    WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1px'
                }}
            />

            <div className="relative h-full p-8 flex flex-col justify-between">
                <div className="mb-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 font-outfit">{title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
}


const Features = () => {
    return (
        <section id="features" className="py-32 bg-black relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-24">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                        <span className="text-sm font-medium text-white tracking-wide">Why Clients Stick With Us</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white font-outfit mb-6">
                        Implement tools. <br />
                        <span className="text-zinc-500">Launch faster.</span>
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Everything you need to build a world-class crypto exchange, custodial service, or fintech app.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlowCard
                        title="Establish Trust"
                        description="Bank-grade security protocols and multi-sig redundancy."
                        icon={Shield}
                        className="md:col-span-1 h-[320px]"
                    />
                    <GlowCard
                        title="High-Converting"
                        description="Optimized user flows designed to maximize engagement."
                        icon={Zap}
                        className="md:col-span-2 h-[320px]"
                    />
                    <GlowCard
                        title="Maximum Return"
                        description="Low fees and high liquidity for optimal trading."
                        icon={Layers}
                        className="md:col-span-2 h-[320px]"
                    />
                    <GlowCard
                        title="Clear Steps"
                        description="Transparent documentation and developer-friendly API."
                        icon={Globe}
                        className="md:col-span-1 h-[320px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;
