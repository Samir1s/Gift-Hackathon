import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const SpotlightButton = ({ children, className, onClick, ...props }) => {
    const btnRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <button
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onClick={onClick}
            className={cn(
                "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900 px-6 font-medium text-zinc-300 transition-colors focus:outline-none cursor-pointer",
                className
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.1), transparent 40%)`,
                }}
            />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};

export default SpotlightButton;
