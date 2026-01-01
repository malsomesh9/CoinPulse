export interface Trending {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
    price_btc: number;
    score: number;
    data?: {
        price: string;
        price_change_percentage_24h?: {
            [currency: string]: number;
        };
        market_cap?: string;
        total_volume?: string;
        sparkline?: string;
    }
}

export interface PoolData {
    id: string;
    address: string;
    name: string;
    network: string;
}

export interface QueryParams {
    [key: string]: string | number | boolean | undefined | null;
}

export interface CoinGeckoErrorBody {
    error?: string;
}
