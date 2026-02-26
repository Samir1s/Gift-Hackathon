import React from 'react';
import { cn } from '@/lib/utils';

const ShimmerButton = ({ children, className, onClick, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-slate-950 px-8 font-medium text-slate-300 transition-all hover:text-white hover:scale-105 active:scale-95 duration-300 cursor-pointer",
                className
            )}
            {...props}
        >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-70" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-black/80">
                {children}
            </span>
        </button>
    );
};

export default ShimmerButton;
