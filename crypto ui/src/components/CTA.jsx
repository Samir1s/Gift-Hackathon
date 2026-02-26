import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-32 relative overflow-hidden bg-black flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-7xl md:text-9xl font-bold font-outfit text-white mb-10 tracking-tighter"
                >
                    Ready to <br />
                    <span className="text-zinc-500 font-aesthetic italic font-light">launch?</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Button className="h-16 px-10 rounded-full text-xl bg-white text-black hover:bg-zinc-200 transition-colors font-bold">
                        Start Building Now <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
