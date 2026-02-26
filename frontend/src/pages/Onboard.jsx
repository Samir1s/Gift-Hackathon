import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import OnboardHero from '@/components/onboarding/OnboardHero';
import FeatureShowcase from '@/components/onboarding/FeatureShowcase';
import Partners from '@/components/onboarding/Partners';
import CTA from '@/components/onboarding/CTA';
import Separator from '@/components/onboarding/Separator';
import Footer from '@/components/layout/Footer';
import { Reveal } from '@/components/shared/Reveal';

const Onboard = () => {
    // Scroll snapping or lenis can be added back if needed, but Brutalist often relies on stark native scrolling.
    return (
        <div className="bg-background text-foreground min-h-screen font-serif flex flex-col selection:bg-white selection:text-background">
            <Navbar />

            <OnboardHero />

            <Separator strings={["01010100", "01010010", "01000001", "01000100", "01000101"]} />

            <Reveal width="100%">
                <Partners />
            </Reveal>

            <Separator strings={["LEARN", "PRACTICE", "EARN", "MASTER"]} />

            <div className="relative z-10">
                <Reveal width="100%">
                    <FeatureShowcase />
                </Reveal>
            </div>

            <Separator strings={["READY", "SET", "TRADE", "NOW"]} />

            <div className="relative z-10">
                <Reveal width="100%">
                    <CTA />
                </Reveal>
            </div>

            <Separator strings={["END", "OF", "PAGE", "HACK"]} />

            <Footer />
        </div>
    );
};

export default Onboard;
