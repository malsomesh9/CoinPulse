import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-dark-900/50 backdrop-blur-xl mt-20">
            <div className="main-container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="inline-block">
                            <Image src="/logo.svg" alt="CoinPulse logo" width={150} height={45} />
                        </Link>
                        <p className="text-purple-100/60 max-w-sm">
                            CoinPulse is the ultimate cryptocurrency tracking platform,
                            providing real-time market data, advanced charts, and deep insights
                            into thousands of digital assets.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-purple-100/60 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/coins" className="text-purple-100/60 hover:text-white transition-colors">All Coins</Link></li>
                            <li><Link href="#" className="text-purple-100/60 hover:text-white transition-colors">Exchanges</Link></li>
                            <li><Link href="#" className="text-purple-100/60 hover:text-white transition-colors">Watchlist</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-purple-100/60 hover:text-white transition-colors">API Docs</Link></li>
                            <li><Link href="#" className="text-purple-100/60 hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-purple-100/60 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-purple-100/60 hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-purple-100/40 text-sm">
                        © {new Date().getFullYear()} CoinPulse. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-purple-100/40 hover:text-white transition-colors">Twitter</Link>
                        <Link href="#" className="text-purple-100/40 hover:text-white transition-colors">Discord</Link>
                        <Link href="#" className="text-purple-100/40 hover:text-white transition-colors">Telegram</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
