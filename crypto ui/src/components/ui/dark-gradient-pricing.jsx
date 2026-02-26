import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const PricingCard = ({ tier, price, features, recommended = false, onClick }) => {
    return (
        <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={cn(
                "relative flex flex-col p-6 rounded-2xl border transition-all duration-300",
                recommended
                    ? "border-primary/50 bg-gradient-to-br from-zinc-800/50 to-zinc-900/80 shadow-2xl shadow-primary/20"
                    : "border-white/10 bg-black/40 hover:border-white/20"
            )}
        >
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-5">
                <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-white">{price}</span>
                    <span className="text-sm text-muted-foreground">{price !== "Contact us" && "/mo"}</span>
                </div>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                        {feature.included ? (
                            <Check className="h-5 w-5 shrink-0 text-primary" />
                        ) : (
                            <X className="h-5 w-5 shrink-0 text-zinc-600" />
                        )}
                        <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                    </li>
                ))}
            </ul>

            <Button
                variant={recommended ? "default" : "outline"}
                className={cn("w-full", recommended ? "bg-primary hover:bg-primary/90" : [])}
                onClick={onClick}
            >
                {recommended ? "Get Started" : "Choose Plan"}
            </Button>
        </motion.div>
    );
};
