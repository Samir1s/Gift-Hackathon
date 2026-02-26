import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SpotlightButton from '@/components/ui/spotlight-button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="relative w-full h-screen overflow-hidden flex items-center">
            {/* Background Video with Parallax */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute top-0 left-0 w-full h-full z-0"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-110" // Scale up slightly to prevent whitespace on scroll
                >
                    <source src="/tput.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Bottom Gradient Fade - Extended for smoother blend */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 h-full flex items-center pt-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="max-w-2xl"
                >
                    <motion.div variants={fadeInUp}>
                        <h1 className="text-6xl md:text-8xl font-bold font-outfit text-white leading-[1.05] mb-6 drop-shadow-2xl tracking-tighter overflow-hidden">
                            <span className="inline-block">Unlock <span className="font-aesthetic italic font-light text-zinc-300">growth</span></span> <br />
                            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">with every payment</span>
                        </h1>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <p className="text-lg md:text-xl text-zinc-200 mb-8 max-w-lg drop-shadow-lg font-inter font-light">
                            The world's most powerful crypto gateway. Institutional grade security with consumer grade simplicity.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-white text-black hover:bg-zinc-200 rounded-full h-14 px-8 text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95">
                            Get started <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button variant="glass" size="lg" className="rounded-full text-base px-8 h-14 font-medium backdrop-blur-md">
                            Talk to a human
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
