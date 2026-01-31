import React from 'react';
import { getGlobalData } from '@/lib/coingecko.actions';
import { formatCurrency, formatPercentage } from '@/lib/utils';

const GlobalStats = async () => {
    const globalData = await getGlobalData();

    if (!globalData) return null;

    const {
        total_market_cap,
        total_volume,
        market_cap_percentage,
        market_cap_change_percentage_24h_usd,
    } = globalData;

    const stats = [
        {
            label: 'Cryptos',
            value: globalData.active_cryptocurrencies.toLocaleString(),
        },
        {
            label: 'Markets',
            value: globalData.markets.toLocaleString(),
        },
        {
            label: 'Market Cap',
            value: formatCurrency(total_market_cap.usd, 0),
            change: market_cap_change_percentage_24h_usd,
        },
        {
            label: '24h Volume',
            value: formatCurrency(total_volume.usd, 0),
        },
        {
            label: 'BTC Dominance',
            value: formatPercentage(market_cap_percentage.btc),
        },
    ];

    return (
        <div className="global-stats-ticker">
            <div className="inner">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <span className="label">{stat.label}:</span>
                        <span className="value">{stat.value}</span>
                        {stat.change !== undefined && (
                            <span className={`change ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ({stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}%)
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlobalStats;
