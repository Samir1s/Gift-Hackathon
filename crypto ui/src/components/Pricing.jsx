import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const PlanCard = ({ tier, price, features, recommended = false }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="relative h-full"
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className={cn(
                    "relative p-8 rounded-[2rem] border flex flex-col h-full transition-shadow duration-300",
                    recommended
                        ? "bg-zinc-900 border-white/20 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                        : "bg-black border-white/10 hover:border-white/20"
                )}
            >
                {recommended && (
                    <div className="absolute top-0 right-0 p-4" style={{ transform: "translateZ(50px)" }}>
                        <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                    </div>
                )}

                <div className="mb-8" style={{ transform: "translateZ(50px)" }}>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                        <div className={cn("w-3 h-3 rounded-full", recommended ? "bg-white" : "bg-zinc-500")} />
                    </div>
                    <h3 className="text-lg font-medium text-zinc-400 mb-2">{tier} Plan</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white font-outfit">{price}</span>
                        <span className="text-zinc-500 text-sm">/USD</span>
                    </div>
                </div>

                <div className="flex-1 space-y-4 mb-8" style={{ transform: "translateZ(50px)" }}>
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-zinc-300">{feature}</span>
                        </div>
                    ))}
                </div>

                <div style={{ transform: "translateZ(50px)" }}>
                    <Button
                        className={cn(
                            "w-full rounded-full h-12 font-medium transition-all duration-300",
                            recommended
                                ? "bg-white text-black hover:bg-zinc-200"
                                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                        )}
                    >
                        Choose this plan
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const Pricing = () => {
    return (
        <section id="pricing" className="py-32 bg-black overflow-hidden perspective-1000">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <h2 className="text-4xl font-bold font-outfit text-white mb-6 tracking-tighter">
                            Straightforward <br /> pricing that fits
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                            Whether you're launching your first idea or scaling your startup, we have a plan that fits your pace.
                        </p>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
                        <PlanCard
                            tier="Starter"
                            price="$1080"
                            features={["Full landing page design", "Strategy kick-off call", "2 days delivery time"]}
                        />
                        <PlanCard
                            tier="Pro"
                            price="$2800"
                            recommended={true}
                            features={["Full landing page design", "Strategy kick-off call", "Bubble.io mobile version", "Unlimited Revisions"]}
                        />
                        <PlanCard
                            tier="Enterprise"
                            price="$4020"
                            features={["Complex Web App", "Custom Features", "Dedicated Team", "Priority Support"]}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
