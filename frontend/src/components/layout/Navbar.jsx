import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { name: 'Learn', path: '#features' },
    { name: 'Playgrounds', path: '#features' },
    { name: 'Updates', path: '#features' },
];

const MagneticLink = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMouse = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
    };
    const reset = () => { x.set(0); y.set(0); };

    return (
        <motion.div style={{ x: springX, y: springY }} onMouseMove={handleMouse} onMouseLeave={reset} className={className}>
            {children}
        </motion.div>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-6 py-3 rounded-full transition-all duration-300 ${scrolled
                    ? 'bg-[#0F1117]/90 backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                    : 'bg-transparent'
                }`}
        >
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-[0_0_12px_rgba(123,63,228,0.3)]">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-[var(--font-aesthetic)] italic text-base text-white">Trade</span>
                <span className="font-[var(--font-outfit)] font-bold text-base text-white">Quest</span>
            </div>

            <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                    <MagneticLink key={link.name} className="cursor-pointer">
                        <a href={link.path} className="text-sm text-[#A8B0C3] hover:text-white transition-colors">
                            {link.name}
                        </a>
                    </MagneticLink>
                ))}
            </div>

            <div className="flex items-center gap-3 ml-4">
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-white hover:text-[#9B6DFF] transition-colors cursor-pointer">
                    Log in
                </button>
                <Button onClick={() => navigate('/login')} size="sm"
                    className="gradient-primary rounded-full text-xs font-semibold shadow-[0_4px_12px_rgba(123,63,228,0.25)] btn-press">
                    Get Started
                </Button>
            </div>
        </motion.nav>
    );
};

export default Navbar;
