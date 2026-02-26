import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const GlowingEffect = ({ children, className }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateMouse = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            container.style.setProperty('--x', `${x}px`);
            container.style.setProperty('--y', `${y}px`);
        };

        container.addEventListener('mousemove', updateMouse);
        return () => container.removeEventListener('mousemove', updateMouse);
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-white/10 bg-black/40",
                className
            )}
        >
            {/* Glow Effect Layer */}
            <div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--x) var(--y), rgba(124, 58, 237, 0.4), transparent 40%)`,
                }}
            />

            <div className="relative h-full">{children}</div>
        </div>
    );
};
