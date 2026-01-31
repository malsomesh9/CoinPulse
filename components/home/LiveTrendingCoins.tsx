'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { DataTableColumn, TrendingCoin } from '@/types';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { PriceFlash } from '@/components/PriceFlash';

interface LiveTrendingCoinsProps {
    initialCoins: TrendingCoin[];
}

const LiveTrendingCoins = ({ initialCoins }: LiveTrendingCoinsProps) => {
    const coinIds = initialCoins.map(c => c.item.id);
    const { pricesMap } = useCoinGeckoWebSocket({ coinId: coinIds });

    const columns: DataTableColumn<TrendingCoin>[] = [
        {
            header: 'Name',
            cellClassName: 'name-cell',
            cell: (coin) => {
                const item = coin.item;
                return (
                    <Link href={`/coins/${item.id}`} className="flex items-center gap-2 group">
                        <Image src={item.large} alt={item.name} width={36} height={36} className="rounded-full shadow-sm group-hover:scale-110 transition-transform" />
                        <p className="font-bold text-white group-hover:text-green-400 transition-colors">{item.name}</p>
                    </Link>
                );
            },
        },
        {
            header: '24h Change',
            cellClassName: 'change-cell',
            cell: (coin) => {
                const item = coin.item;
                const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

                return (
                    <div className={cn('price-change font-bold', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
                        <p className="flex items-center gap-1">
                            {formatPercentage(item.data.price_change_percentage_24h.usd)}
                            {isTrendingUp ? (
                                <TrendingUp width={14} height={14} />
                            ) : (
                                <TrendingDown width={14} height={14} />
                            )}
                        </p>
                    </div>
                );
            },
        },
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (coin) => {
                const livePrice = pricesMap?.[coin.item.id]?.usd ?? coin.item.data.price;
                return (
                    <PriceFlash value={livePrice} className="font-bold text-white">
                        {formatCurrency(livePrice)}
                    </PriceFlash>
                );
            },
        },
    ];

    return (
        <div id="trending-coins" className="bg-dark-500/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                Trending Coins
                <span className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border border-green-500/20 animate-pulse">Live</span>
            </h4>

            <DataTable
                data={initialCoins.slice(0, 6) || []}
                columns={columns}
                rowKey={(coin) => coin.item.id}
                tableClassName="trending-coins-table"
                headerCellClassName="py-3 text-purple-100/40 uppercase text-[10px] tracking-widest font-bold"
                bodyCellClassName="py-4 border-b border-white/5"
            />
        </div>
    );
};

export default LiveTrendingCoins;
