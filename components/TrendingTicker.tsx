import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { TrendingCoin } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

const TrendingTicker = async () => {
    let trendingCoins: { coins: TrendingCoin[] } | null = null;

    try {
        trendingCoins = await fetcher<{ coins: TrendingCoin[] }>('/search/trending');
    } catch (error) {
        console.error('Error fetching trending coins for ticker:', error);
        return null;
    }

    if (!trendingCoins || !trendingCoins.coins) return null;

    return (
        <div className="trending-ticker-wrapper">
            <div className="label">Trending:</div>
            <div className="ticker-container">
                <div className="ticker-content">
                    {[...trendingCoins.coins, ...trendingCoins.coins].map((coin, index) => (
                        <Link
                            key={`${coin.item.id}-${index}`}
                            href={`/coins/${coin.item.id}`}
                            className="ticker-item"
                        >
                            <Image
                                src={coin.item.small}
                                alt={coin.item.name}
                                width={16}
                                height={16}
                                className="rounded-full"
                            />
                            <span>{coin.item.symbol}</span>
                            <span className={coin.item.data.price_change_percentage_24h.usd >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {coin.item.data.price_change_percentage_24h.usd >= 0 ? '+' : ''}
                                {coin.item.data.price_change_percentage_24h.usd.toFixed(1)}%
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendingTicker;
