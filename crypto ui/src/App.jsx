import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Partners from './components/Partners';
import Footer from './components/Footer';
import CTA from './components/CTA';
import { Reveal } from './components/Reveal';
import Lenis from 'lenis';

function App() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="bg-black text-white min-h-screen font-inter selection:bg-white selection:text-black">
            <Navbar />
            <Hero />

            <div className="relative z-10 space-y-24 pb-24">
                <Reveal width="100%">
                    <Partners />
                </Reveal>

                <Reveal width="100%">
                    <Features />
                </Reveal>

                <Reveal width="100%">
                    <Pricing />
                </Reveal>
                <Reveal width="100%">
                    <CTA />
                </Reveal>
            </div>

            <Footer />
        </div>
    );
}

export default App;
