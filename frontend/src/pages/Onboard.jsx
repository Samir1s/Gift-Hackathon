import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import OnboardHero from '@/components/onboarding/OnboardHero';
import FeatureShowcase from '@/components/onboarding/FeatureShowcase';
import Partners from '@/components/onboarding/Partners';
import CTA from '@/components/onboarding/CTA';
import Footer from '@/components/layout/Footer';
import { Reveal } from '@/components/shared/Reveal';
import Lenis from 'lenis';

const Onboard = () => {
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
        return () => lenis.destroy();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen font-[var(--font-inter)]">
            <Navbar />
            <OnboardHero />
            <div className="relative z-10 space-y-24 pb-24">
                <Reveal width="100%">
                    <Partners />
                </Reveal>
                <Reveal width="100%">
                    <FeatureShowcase />
                </Reveal>
                <Reveal width="100%">
                    <CTA />
                </Reveal>
            </div>
            <Footer />
        </div>
    );
};

export default Onboard;
