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
            className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${scrolled
                ? 'bg-background border-b border-white'
                : 'bg-transparent'
                }`}
        >
            <div className="flex flex-col items-start gap-0 cursor-pointer" onClick={() => navigate('/')}>
                <span className="font-display uppercase font-bold text-4xl text-white leading-none">Trade</span>
                <span className="font-display uppercase font-bold text-4xl text-white leading-none">Quest</span>
            </div>

            <div className="flex items-center gap-12">
                {navLinks.map((link) => (
                    <MagneticLink key={link.name} className="cursor-pointer">
                        <a href={link.path} className="text-sm font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                            {link.name}
                        </a>
                    </MagneticLink>
                ))}
            </div>

            <div className="flex items-center gap-6">
                <button onClick={() => navigate('/login')} className="text-sm font-mono uppercase tracking-widest text-white hover:text-white/70 transition-colors cursor-pointer">
                    Log in
                </button>
                <Button onClick={() => navigate('/login')} variant="outline" className="px-8 rounded-none">
                    GET STARTED
                </Button>
            </div>
        </motion.nav>
    );
};

export default Navbar;
