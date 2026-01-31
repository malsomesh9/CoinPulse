'use client';

import { useEffect, useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { fetcher } from '@/lib/coingecko.actions';
import { CoinMarketData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { PriceFlash } from '@/components/PriceFlash';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';

const Watchlist = () => {
    const { watchlist } = useWatchlist();
    const [coins, setCoins] = useState<CoinMarketData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Subscribe to all watchlist coins via WebSocket
    const { pricesMap } = useCoinGeckoWebSocket({ coinId: watchlist });

    useEffect(() => {
        const fetchWatchlistData = async () => {
            if (watchlist.length === 0) {
                setCoins([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetcher<CoinMarketData[]>('/coins/markets', {
                    vs_currency: 'usd',
                    ids: watchlist.join(','),
                    order: 'market_cap_desc',
                    sparkline: false,
                });
                setCoins(data || []);
            } catch (error) {
                console.error('Error fetching watchlist data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWatchlistData();
    }, [watchlist]);

    if (watchlist.length === 0) return null;

    return (
        <section id="watchlist" className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold flex items-center gap-2">
                    Your Watchlist
                    <span className="bg-yellow-400 text-dark-900 text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase">Live</span>
                </h4>
                <Link href="/coins" className="text-sm text-purple-100/50 hover:text-white transition-colors">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading && coins.length === 0 ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
                    ))
                ) : (
                    coins.map((coin) => {
                        const livePrice = pricesMap?.[coin.id]?.usd ?? coin.current_price;

                        return (
                            <Link
                                key={coin.id}
                                href={`/coins/${coin.id}`}
                                className="flex items-center justify-between bg-dark-500/50 hover:bg-dark-500 p-4 rounded-xl border border-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" />
                                        <div className="absolute -top-1 -right-1 size-2 bg-green-500 rounded-full animate-pulse border border-dark-900" title="Live" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white group-hover:text-green-400 transition-colors uppercase text-sm">{coin.symbol}</p>
                                        <p className="text-xs text-purple-100/40 font-medium">{coin.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <PriceFlash value={livePrice}>
                                        <p className="font-bold text-white text-sm">{formatCurrency(livePrice)}</p>
                                    </PriceFlash>
                                    <div className={cn(
                                        "text-[10px] font-bold flex items-center justify-end gap-1",
                                        coin.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"
                                    )}>
                                        {coin.price_change_percentage_24h > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                        {formatPercentage(Math.abs(coin.price_change_percentage_24h))}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default Watchlist;
