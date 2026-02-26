import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="relative z-10 w-full min-h-[80vh] flex flex-col items-center justify-center bg-background overflow-hidden border-t py-32 border-white select-none">

            {/* Massive Circular Button Wrapper */}
            <div
                className="relative group cursor-pointer flex items-center justify-center w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate('/login')}
            >
                {/* Expanding outer ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-white"
                    animate={{
                        scale: isHovered ? 1.5 : 1,
                        opacity: isHovered ? 0 : 0.5
                    }}
                    transition={{ duration: 1, ease: "easeOut", repeat: isHovered ? Infinity : 0 }}
                />

                {/* Main Button Circle */}
                <motion.div
                    className="absolute inset-4 md:inset-8 bg-white rounded-full flex items-center justify-center overflow-hidden"
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                    <motion.span
                        className="text-background text-6xl md:text-8xl font-display uppercase tracking-tight"
                        animate={{
                            scale: isHovered ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    >
                        GO
                    </motion.span>
                </motion.div>
            </div>

            {/* Massive Typography wrapping around or below */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-0 opacity-20">
                <span className="text-[15vw] md:text-[18vw] font-display uppercase font-bold text-white tracking-tighter leading-none whitespace-nowrap">
                    START
                </span>
                <span className="text-[15vw] md:text-[18vw] font-display uppercase font-bold text-white tracking-tighter leading-none whitespace-nowrap outline-text">
                    TRADING
                </span>
            </div>

            <style jsx>{`
                .outline-text {
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
                }
            `}</style>

        </section>
    );
};

export default CTA;
