'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { PriceFlash } from '@/components/PriceFlash';

interface LiveTopGainersLosersProps {
    initialGainers: any[];
    initialLosers: any[];
}

const LiveTopGainersLosers = ({ initialGainers, initialLosers }: LiveTopGainersLosersProps) => {
    const allCoinIds = [...initialGainers, ...initialLosers].map(c => c.id);
    const { pricesMap } = useCoinGeckoWebSocket({ coinId: allCoinIds });

    const renderList = (coins: any[], title: string, isUp: boolean) => (
        <div className="flex-1 space-y-6 bg-dark-500/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h4 className="text-xl font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                    {title}
                    <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border animate-pulse",
                        isUp ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>Live</span>
                </span>
                {isUp ? <TrendingUp className="text-green-500 size-5" /> : <TrendingDown className="text-red-500 size-5" />}
            </h4>
            <div className="space-y-3">
                {coins.slice(0, 5).map((coin) => {
                    const livePrice = pricesMap?.[coin.id]?.usd ?? coin.current_price;

                    return (
                        <Link key={coin.id} href={`/coins/${coin.id}`} className="flex items-center justify-between hover:bg-white/5 p-3 rounded-xl transition-all group border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-3">
                                <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full shadow-sm group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="font-bold text-white group-hover:text-green-400 transition-colors text-sm">{coin.name}</p>
                                    <p className="text-xs text-purple-100/40 font-medium uppercase">{coin.symbol}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <PriceFlash value={livePrice} className="font-bold text-white text-sm">
                                    {formatCurrency(livePrice)}
                                </PriceFlash>
                                <p className={cn("text-xs font-bold", isUp ? "text-green-500" : "text-red-500")}>
                                    {isUp && '+'}{formatPercentage(coin.price_change_percentage_24h)}
                                </p>
                            </div>
                        </Link>
                    );
                })}
                {coins.length === 0 && <p className="text-purple-100/30 text-sm italic py-4 text-center">No data available at the moment.</p>}
            </div>
        </div>
    );

    return (
        <section className="flex flex-col lg:flex-row gap-6 w-full mt-12">
            {renderList(initialGainers, 'Top Gainers', true)}
            {renderList(initialLosers, 'Top Losers', false)}
        </section>
    );
};

export default LiveTopGainersLosers;
