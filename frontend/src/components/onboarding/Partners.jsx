import React from 'react';

const PARTNERS = ["BINANCE", "COINBASE", "BLOOMBERG", "REUTERS", "NSE", "BSE", "NASDAQ", "NYSE"];

const Partners = () => {
    return (
        <section className="py-12 bg-black border-y border-white/5 relative z-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-30 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-30 pointer-events-none" />

            <div className="flex w-full relative z-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
                <div className="flex gap-20 animate-marquee whitespace-nowrap min-w-full items-center justify-around">
                    {PARTNERS.map((p, i) => (
                        <span key={i} className="text-xl font-bold text-white cursor-default select-none font-[var(--font-outfit)] tracking-[0.2em] uppercase">{p}</span>
                    ))}
                    {PARTNERS.map((p, i) => (
                        <span key={`dup-${i}`} className="text-xl font-bold text-white cursor-default select-none font-[var(--font-outfit)] tracking-[0.2em] uppercase">{p}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
