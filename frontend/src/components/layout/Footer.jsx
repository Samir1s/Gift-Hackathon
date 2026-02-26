import React from 'react';
import { TrendingUp } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0F1117] py-20 border-t border-white/[0.06]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-[0_0_12px_rgba(123,63,228,0.3)]">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold font-[var(--font-outfit)] text-xl">TradeQuest</span>
                        </div>
                        <h3 className="text-white font-[var(--font-outfit)] text-2xl font-semibold mb-2">
                            Master the markets with AI.
                        </h3>
                        <p className="text-[#6B7280] text-sm">
                            Your journey to financial literacy starts here.
                        </p>
                        <div className="mt-6">
                            <button className="px-6 py-2 rounded-full gradient-primary text-white text-sm shadow-[0_4px_16px_rgba(123,63,228,0.25)] hover:shadow-[0_4px_24px_rgba(123,63,228,0.4)] transition-all btn-press cursor-pointer">
                                Start Now
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-16">
                        {[
                            { title: "Platform", links: ["Learn", "Playgrounds", "Daily Updates", "Portfolio"] },
                            { title: "Resources", links: ["Documentation", "API", "Community", "Support"] },
                            { title: "Socials", links: ["Twitter", "LinkedIn", "Discord"] },
                        ].map((column, i) => (
                            <div key={i}>
                                <h4 className="text-white text-sm font-semibold mb-4">{column.title}</h4>
                                <ul className="space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-[#6B7280] text-sm hover:text-[#9B6DFF] transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#6B7280] text-xs">© 2026 TradeQuest. All rights reserved. GIFT Hackathon Project.</p>
                    <div className="flex gap-6">
                        <span className="text-[#6B7280] hover:text-white cursor-pointer text-xs">Privacy Policy</span>
                        <span className="text-[#6B7280] hover:text-white cursor-pointer text-xs">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
