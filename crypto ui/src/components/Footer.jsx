import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black py-20 border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                <span className="text-black font-bold font-aesthetic italic">1</span>
                            </div>
                            <span className="text-white font-bold font-outfit text-xl">1eaf Crypto</span>
                        </div>
                        <h3 className="text-white font-outfit text-2xl font-semibold mb-2">
                            Helping founders launch faster.
                        </h3>
                        <p className="text-zinc-500 text-sm">
                            Let's build something great.
                        </p>
                        <div className="mt-6">
                            <button className="px-6 py-2 rounded-full border border-white/20 text-white text-sm hover:bg-white hover:text-black transition-colors">
                                Start Now
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-16">
                        {[
                            { title: "Menu", links: ["Home", "Work", "Pricing", "FAQs"] },
                            { title: "Explore", links: ["Why Us", "Process", "Testimonials", "Contact"] },
                            { title: "Socials", links: ["Twitter", "LinkedIn", "Instagram"] },
                        ].map((column, i) => (
                            <div key={i}>
                                <h4 className="text-white text-sm font-semibold mb-4">{column.title}</h4>
                                <ul className="space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs">© 2026 1eaf Crypto. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="text-zinc-600 hover:text-white cursor-pointer text-xs">Privacy Policy</span>
                        <span className="text-zinc-600 hover:text-white cursor-pointer text-xs">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
