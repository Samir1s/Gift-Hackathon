import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Bell, Shield, Save, Check } from 'lucide-react';

const Settings = () => {
    const [profile, setProfile] = useState({
        name: 'Trader',
        bio: 'Professional market enthusiast.',
        email: 'trader@tradequest.ai'
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketAlerts: false
    });

    const [theme, setTheme] = useState('dark');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const sections = [
        {
            id: 'profile',
            title: 'Profile Settings',
            icon: User,
            content: (
                <div className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-white/50 mb-2">Display Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full bg-transparent border border-white p-4 font-mono text-white focus:bg-white focus:text-background transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-white/50 mb-2">Bio</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full bg-transparent border border-white p-4 font-mono text-white h-32 focus:bg-white focus:text-background transition-all outline-none resize-none"
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'theme',
            title: 'Theme Preference',
            icon: Palette,
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`p-6 border font-mono uppercase text-sm tracking-widest transition-brutal ${theme === t ? 'bg-white text-background border-white' : 'border-white text-white hover:bg-white/10'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: Bell,
            content: (
                <div className="space-y-4">
                    {Object.entries(notifications).map(([key, val]) => (
                        <div
                            key={key}
                            onClick={() => setNotifications({ ...notifications, [key]: !val })}
                            className="flex items-center justify-between p-4 border border-white cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <span className="font-mono text-sm uppercase tracking-widest text-white">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <div className={`w-12 h-6 border border-white relative transition-colors ${val ? 'bg-white' : 'bg-transparent'}`}>
                                <div className={`absolute top-0 w-6 h-full border-r border-white transition-all ${val ? 'right-0 border-l' : 'left-0'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 border-b border-white pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl md:text-8xl font-bold text-white font-display uppercase tracking-tight mb-4 leading-none">
                        Settings
                    </h1>
                    <p className="font-mono text-white/70 uppercase tracking-widest text-sm">Configure your TradeQuest experience</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-background font-mono font-bold uppercase tracking-widest hover:bg-white/90 transition-brutal min-w-[200px] justify-center"
                >
                    {saved ? (
                        <>
                            <Check className="w-5 h-5" /> Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" /> Save Changes
                        </>
                    )}
                </button>
            </motion.div>

            {/* Content Sections */}
            <div className="space-y-16">
                {sections.map((section, i) => (
                    <motion.section
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 border border-white flex items-center justify-center">
                                <section.icon className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">{section.title}</h2>
                        </div>
                        <div className="p-1 border border-white/20 bg-white/5 p-8">
                            {section.content}
                        </div>
                    </motion.section>
                ))}

                {/* Account Security Placeholder */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 border border-white flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">Security</h2>
                    </div>
                    <div className="p-8 border border-white border-dashed text-center">
                        <p className="font-mono text-sm uppercase tracking-widest text-white/50">
                            Password and 2FA settings are managed via secondary authentication service.
                        </p>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default Settings;
