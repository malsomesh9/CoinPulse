'use client';

import React from 'react';

const Hero = () => {
    return (
        <section className="flex flex-col items-center justify-center text-center py-12 md:py-24 space-y-8 overflow-hidden">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-tight animate-in fade-in slide-in-from-top-12 duration-1000 fill-mode-both">
                    Track Your Crypto <br />
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Like a Professional
                    </span>
                </h1>
                <p className="text-purple-100/60 text-lg md:text-2xl max-w-3xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 [animation-delay:300ms] fill-mode-both">
                    The ultimate real-time cryptocurrency dashboard. Monitor markets,
                    analyze historical trends, and stay ahead of the curve.
                </p>
            </div>

            <div className="flex gap-4 animate-in fade-in zoom-in-90 duration-1000 [animation-delay:600ms] fill-mode-both">
                <button className="bg-green-500 hover:bg-green-600 text-dark-900 font-bold px-8 py-4 rounded-xl transition-all scale-100 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(118,218,68,0.3)] cursor-pointer">
                    Explore Assets
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl border border-white/10 transition-all backdrop-blur-sm cursor-pointer">
                    Market Stats
                </button>
            </div>
        </section>
    );
};

export default Hero;
