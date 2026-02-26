import React from 'react';

const PARTNERS = ["BINANCE", "COINBASE", "BLOOMBERG", "REUTERS", "NSE", "BSE", "NASDAQ", "NYSE"];

const Partners = () => {
    return (
        <section className="py-8 bg-background border-y border-white flex overflow-hidden whitespace-nowrap">
            <div className="flex w-full">
                <div className="flex gap-24 animate-marquee min-w-full items-center justify-around">
                    {PARTNERS.map((p, i) => (
                        <span key={i} className="text-4xl md:text-6xl font-display font-bold text-white cursor-default select-none uppercase">{p}</span>
                    ))}
                    {PARTNERS.map((p, i) => (
                        <span key={`dup-${i}`} className="text-4xl md:text-6xl font-display font-bold text-white cursor-default select-none uppercase">{p}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
