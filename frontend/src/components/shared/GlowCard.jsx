import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

const GlowCard = ({ title, description, icon: Icon, className, children }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <div
            className={cn("group relative border border-white/[0.06] bg-[#151824] overflow-hidden rounded-2xl hover:translate-y-[-2px] transition-transform duration-200", className)}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                        650px circle at ${mouseX}px ${mouseY}px,
                        rgba(124, 58, 237, 0.15),
                        transparent 80%
                        )
                    `,
                }}
            />
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                        600px circle at ${mouseX}px ${mouseY}px,
                        rgba(124, 58, 237, 0.4),
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
                {Icon && (
                    <div className="mb-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
                <div>
                    {title && <h3 className="text-xl font-bold text-white mb-2 font-[var(--font-outfit)]">{title}</h3>}
                    {description && <p className="text-[#A8B0C3] text-sm leading-relaxed">{description}</p>}
                </div>
                {children}
            </div>
        </div>
    );
};

export default GlowCard;
