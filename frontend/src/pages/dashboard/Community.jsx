import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Heart, ArrowLeft, TrendingUp, Search, Share2, MessageCircle } from 'lucide-react';

const mockPosts = [
    {
        id: 1,
        author: "CryptoWhale99",
        level: "Level 42",
        avatar: "🐋",
        title: "How I survived the 2022 Bear Market",
        content: "The key was risk management and not panicking. I stuck to my strategy of DCA into top 10 coins. Always keep some dry powder (stablecoins) for the real dips. Also, uninstalling price tracking apps helped with the psychological aspect.\n\nKey takeaways:\n- Don't use leverage in a downtrend\n- If a project fundamentals haven't changed, a price drop is a discount\n- Focus on skill-building during boring markets",
        upvotes: 342,
        replies: 45,
        tags: ["Strategy", "Psychology"],
        timestamp: "2 hours ago"
    },
    {
        id: 2,
        author: "PatternTrader",
        level: "Level 15",
        avatar: "📈",
        title: "Head and Shoulders pattern failure rate?",
        content: "I've been backtesting traditional chart patterns on crypto assets for the last 6 months. Fascinating results - standard Head and Shoulders patterns fail about 62% of the time in crypto compared to traditional equities.\n\nHowever, when combined with volume confirmation, the success rate jumps to 78%. Anyone else notice this?",
        upvotes: 189,
        replies: 23,
        tags: ["Technical Analysis", "Research"],
        timestamp: "5 hours ago"
    },
    {
        id: 3,
        author: "DefiDegen",
        level: "Level 28",
        avatar: "🦊",
        title: "Why your stop-loss keeps getting hunted",
        content: "Market makers know where retails put their stop losses. If you're placing it exactly below the support line, you're liquidity. \n\nInstead of mental stops or obvious placement, use volatility-based stops (like ATR bands). Since I switched to 1.5 ATR stops on the 4H timeframe, my win rate improved by 15%.",
        upvotes: 856,
        replies: 102,
        tags: ["Risk Management", "Trading Tips"],
        timestamp: "1 day ago"
    },
    {
        id: 4,
        author: "NewbieTrader",
        level: "Level 3",
        avatar: "🐣",
        title: "First profitable month! Here's what I learned",
        content: "After paper trading for 3 months here on TradeQuest, I finally had my first profitable month with real capital.\n\nBiggest lesson: Less is more. I reduced my trading frequency from 10 trades a day to 2-3 high probability setups a week. Also, journaling every trade was a game changer.",
        upvotes: 520,
        replies: 88,
        tags: ["Success Story", "Beginner"],
        timestamp: "2 days ago"
    }
];

const mockReplies = [
    {
        id: 101,
        author: "AlphaSeeker",
        avatar: "🐺",
        content: "Totally agree with the DCA approach. It takes the emotion out of it.",
        timestamp: "1 hour ago",
        upvotes: 24
    },
    {
        id: 102,
        author: "ZenTrader",
        avatar: "🧘",
        content: "Uninstalling the apps is the ultimate alpha. If you trust your thesis, you don't need to watch the 1-minute chart.",
        timestamp: "45 mins ago",
        upvotes: 56
    }
];

const Community = () => {
    const [posts, setPosts] = useState(mockPosts);
    const [activePost, setActivePost] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] border-t border-white border-l-0">
            {/* Left Side — Post List */}
            <div className="w-full lg:w-1/2 overflow-hidden flex flex-col border-r border-white bg-background">
                {!activePost ? (
                    <div className="flex-1 overflow-y-auto w-full">
                        <div className="p-8 border-b border-white bg-background shrink-0">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-bold text-white font-display uppercase tracking-tight mb-2 leading-none">Community</h1>
                                    <p className="text-white/70 font-mono text-sm uppercase tracking-widest leading-relaxed">Share knowledge and learn from others</p>
                                </div>
                                <Users className="w-12 h-12 text-white/20 hidden md:block" />
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="SEARCH DISCUSSIONS..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border border-white p-4 pl-12 font-mono text-sm uppercase tracking-widest text-white placeholder:text-white/50 focus:outline-none focus:bg-white/5 transition-brutal"
                                />
                            </div>
                        </div>

                        {filteredPosts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setActivePost(post)}
                                className="group p-8 border-b border-white bg-background hover:bg-white hover:text-background transition-brutal cursor-pointer flex flex-col gap-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 border border-current flex items-center justify-center text-xl bg-background text-white group-hover:bg-background group-hover:text-white">
                                            {post.avatar}
                                        </div>
                                        <div>
                                            <p className="font-mono font-bold text-sm tracking-widest uppercase">{post.author}</p>
                                            <p className="font-mono text-[10px] opacity-70 uppercase tracking-widest">{post.timestamp}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-current">{post.level}</span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold font-serif leading-tight mb-2 group-hover:text-background">{post.title}</h3>
                                    <p className="font-mono opacity-70 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-2 hidden sm:flex">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-current text-white group-hover:bg-background group-hover:text-white">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 font-mono text-sm font-bold">
                                        <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.upvotes}</div>
                                        <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.replies}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full bg-background"
                    >
                        <div className="p-8 border-b border-white flex items-center justify-between shrink-0">
                            <button
                                onClick={() => setActivePost(null)}
                                className="p-3 border border-white hover:bg-white hover:text-background transition-brutal cursor-pointer flex items-center gap-3"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-mono text-xs font-bold uppercase tracking-widest hidden sm:inline">Back</span>
                            </button>
                            <div className="flex items-center gap-4">
                                <button className="p-3 border border-white hover:bg-white hover:text-background transition-brutal">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 border border-white flex items-center justify-center text-2xl bg-white/5">
                                        {activePost.avatar}
                                    </div>
                                    <div>
                                        <p className="font-mono font-bold text-lg tracking-widest uppercase">{activePost.author}</p>
                                        <p className="font-mono text-xs opacity-70 uppercase tracking-widest">{activePost.level} • {activePost.timestamp}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 hidden sm:flex">
                                    {activePost.tags.map(tag => (
                                        <span key={tag} className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 border border-white">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-4xl sm:text-5xl font-bold font-display uppercase tracking-tight mb-8 leading-tight">{activePost.title}</h2>

                            <div className="prose prose-invert max-w-none prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-p:text-white/80 prose-li:font-mono prose-li:text-sm prose-li:text-white/80 prose-strong:text-white prose-headings:font-serif prose-headings:font-bold prose-headings:text-2xl">
                                {activePost.content.split('\n').map((paragraph, i) => {
                                    if (paragraph.startsWith('- ')) {
                                        return <li key={i} className="mb-2 ml-4 list-disc">{paragraph.substring(2)}</li>;
                                    }
                                    if (paragraph.trim() === '') return <div key={i} className="h-4" />;
                                    return <p key={i} className="mb-6">{paragraph}</p>;
                                })}
                            </div>

                            <div className="flex items-center gap-6 mt-12 py-6 border-t border-b border-white/20">
                                <button className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                                    <Heart className="w-5 h-5" /> {activePost.upvotes} Upvotes
                                </button>
                                <div className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest opacity-70">
                                    <MessageSquare className="w-5 h-5" /> {activePost.replies} Replies
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <h3 className="font-display text-2xl uppercase tracking-widest mb-6">Discussion</h3>
                                {mockReplies.map(reply => (
                                    <div key={reply.id} className="p-6 border border-white/20 bg-white/5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 flex items-center justify-center text-lg">{reply.avatar}</div>
                                            <div>
                                                <p className="font-mono font-bold text-xs tracking-widest uppercase">{reply.author}</p>
                                                <p className="font-mono text-[10px] opacity-70 uppercase tracking-widest">{reply.timestamp}</p>
                                            </div>
                                        </div>
                                        <p className="font-mono text-sm text-white/80 leading-relaxed mb-4">{reply.content}</p>
                                        <div className="flex items-center gap-2">
                                            <button className="text-white/50 hover:text-white transition-colors"><Heart className="w-4 h-4" /></button>
                                            <span className="font-mono text-xs font-bold">{reply.upvotes}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="p-6 border-t border-white shrink-0 bg-background">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="ADD TO DISCUSSION..."
                                    className="flex-1 bg-transparent border border-white p-4 font-mono text-sm uppercase tracking-widest text-white placeholder:text-white/50 focus:outline-none focus:bg-white/5 transition-brutal"
                                />
                                <button className="px-8 py-4 bg-white text-background font-mono font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-brutal whitespace-nowrap">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Right Side — New Post & Trending */}
            <div className="w-full lg:w-1/2 flex flex-col bg-background">
                {/* Top 40% — Create Post */}
                <div className="flex-[2] flex flex-col border-b border-white transition-brutal overflow-hidden p-8">
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-6">Share Experience</h2>
                    <div className="flex-1 flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="TITLE OF YOUR POST"
                            className="bg-transparent border border-white p-4 font-mono text-sm uppercase tracking-widest text-white placeholder:text-white/50 focus:outline-none focus:bg-white/5 transition-brutal w-full"
                        />
                        <textarea
                            placeholder="WHAT WOULD YOU LIKE TO SHARE WITH THE COMMUNITY?"
                            className="bg-transparent border border-white p-4 font-mono text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/5 transition-brutal flex-1 resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-mono text-[10px] uppercase text-white/50 tracking-widest">Supports Markdown format</span>
                            <button className="px-8 py-4 bg-white text-background font-mono font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-brutal">
                                Post to Community
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom 60% — Trending Topics */}
                <div className="flex-[3] flex flex-col bg-background p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <TrendingUp className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold font-display uppercase tracking-widest">Trending Topics</h2>
                        </div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 border border-white hidden sm:block">This Week</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { topic: "Bitcoin Halving Strategies", posts: 145, increment: "+12%" },
                            { topic: "Layer 2 Networks Comparison", posts: 89, increment: "+5%" },
                            { topic: "Algorithmic Trading Bots Review", posts: 67, increment: "+22%" },
                            { topic: "Tax Loss Harvesting Guide", posts: 45, increment: "+2%" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6 border border-white transition-brutal hover:bg-white hover:text-background group cursor-pointer">
                                <div>
                                    <p className="text-lg font-serif font-bold leading-tight mb-2">{item.topic}</p>
                                    <p className="text-xs font-mono uppercase tracking-widest opacity-70">{item.posts} Active Discussions</p>
                                </div>
                                <div className="flex items-center gap-2 border border-current px-3 py-1 font-mono text-xs font-bold uppercase self-start xl:self-auto">
                                    <TrendingUp className="w-3 h-3" />
                                    {item.increment}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
