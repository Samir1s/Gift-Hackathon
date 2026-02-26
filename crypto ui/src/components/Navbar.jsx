import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Menu, X, Leaf } from 'lucide-react';

const MagneticLink = ({ children, href }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const xPos = clientX - (left + width / 2);
        const yPos = clientY - (top + height / 2);
        x.set(xPos * 0.3);
        y.set(yPos * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: mouseXSpring, y: mouseYSpring }}
            className="relative px-6 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
        >
            <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{children}</span>
            <span className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center -z-0" />
        </motion.a>
    );
};

const Navbar = () => {
    const { scrollY } = useScroll();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Physics Animation: Smoothly interpolate values based on scroll position
    const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 0.6]);
    const blurAmount = useTransform(scrollY, [0, 50], [0, 16]);
    const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);
    const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.5]);

    // Animate spacing/padding for that "compacting" feel
    // Idle: py-6 (24px) -> Scrolled: py-4 (16px) - slightly taller for better "button" alignment
    const py = useTransform(scrollY, [0, 50], [24, 16]);

    const navStyle = {
        backgroundColor: useMotionTemplate`rgba(0, 0, 0, ${backgroundOpacity})`,
        backdropFilter: useMotionTemplate`blur(${blurAmount}px)`,
        borderColor: useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`,
        boxShadow: useMotionTemplate`0 8px 32px rgba(0, 0, 0, ${shadowOpacity})`,
        paddingTop: py,
        paddingBottom: py,
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl pt-6 px-4 pointer-events-auto"
            >
                <motion.nav
                    style={navStyle}
                    className="relative flex items-center justify-between rounded-full border border-transparent mx-auto px-10 transition-colors will-change-[padding,background,backdrop-filter] hover:border-white/10 duration-300"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer group shrink-0">
                        <div className="relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Leaf className="w-7 h-7 text-white transition-transform duration-500 group-hover:rotate-45" fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-white font-aesthetic italic text-xl leading-none group-hover:text-zinc-300 transition-colors">1eaf</span>
                            <span className="text-white font-bold font-outfit text-xl tracking-tight group-hover:text-zinc-300 transition-colors">Crypto</span>
                        </div>
                    </div>

                    {/* Desktop Links (Hidden on small screens) */}
                    <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
                        {["Company", "Pricing", "Resources"].map((item) => (
                            <MagneticLink key={item} href={`#${item.toLowerCase()}`}>
                                {item}
                            </MagneticLink>
                        ))}
                    </div>

                    {/* CTA (Hidden on small screens) */}
                    <div className="hidden md:flex items-center gap-6 shrink-0">
                        <a href="#" className="text-sm font-medium text-white hover:text-zinc-300 transition-colors hover:underline underline-offset-4 decoration-zinc-500">Log in</a>
                        <Button className="bg-white text-black hover:bg-zinc-200 rounded-full h-9 px-6 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute top-full right-0 mt-4 w-full p-4 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col gap-2 backdrop-blur-3xl shadow-2xl z-50 overflow-hidden"
                        >
                            {["Company", "Pricing", "Resources"].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium text-zinc-400 hover:text-white transition-colors p-4 hover:bg-white/5 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                                    {item}
                                </a>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <a href="#" className="text-lg font-medium text-white p-4 hover:bg-white/5 rounded-xl">Log in</a>
                            <Button className="w-full bg-white text-black h-12 text-lg rounded-xl font-bold mt-2">Get started</Button>
                        </motion.div>
                    )}
                </motion.nav>
            </motion.div>
        </div>
    );
};

export default Navbar;
