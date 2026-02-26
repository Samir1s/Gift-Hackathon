import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();
    return (
        <section className="py-32 relative overflow-hidden bg-[#0F1117] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7B3FE4]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-7xl md:text-9xl font-bold font-[var(--font-outfit)] text-white mb-10 tracking-tighter"
                >
                    Ready to <br />
                    <span className="text-gradient-purple font-[var(--font-aesthetic)] italic font-light">trade?</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Button
                        onClick={() => navigate('/login')}
                        className="h-16 px-10 rounded-full text-xl gradient-primary text-white shadow-[0_4px_30px_rgba(123,63,228,0.4)] hover:shadow-[0_4px_40px_rgba(123,63,228,0.6)] transition-all font-bold btn-press"
                    >
                        Start Learning Now <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
