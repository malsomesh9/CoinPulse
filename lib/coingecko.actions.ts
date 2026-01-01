'use server';

import qs from 'query-string';
import { CoinGeckoErrorBody, PoolData, QueryParams, Trending } from '@/types';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;



export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
): Promise<T> {
    const url = qs.stringifyUrl(
        {
            url: `${BASE_URL}/${endpoint}`,
            query: params,
        },
        { skipEmptyString: true, skipNull: true },
    );

    const response = await fetch(url, {
        headers: {
            'x-cg-demo-api-key': API_KEY,
            'Content-Type': 'application/json',
        } as Record<string, string>,
        next: { revalidate },
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

        throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
    }

    return response.json();
}

export async function getPools(
    id: string,
    network?: string | null,
    contractAddress?: string | null,
): Promise<PoolData> {
    const fallback: PoolData = {
        id: '',
        address: '',
        name: '',
        network: '',
    };

    if (network && contractAddress) {
        try {
            const poolData = await fetcher<{ data: PoolData[] }>(
                `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
            );

            return poolData.data?.[0] ?? fallback;
        } catch (error) {
            console.log(error);
            return fallback;
        }
    }

    try {
        const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });

        return poolData.data?.[0] ?? fallback;
    } catch {
        return fallback;
    }
}


export async function getTrending(): Promise<Trending[]> {
    try {
        const response = await fetcher<{ coins: { item: Trending }[] }>('/search/trending');
        return response.coins.map((coin) => coin.item);

    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getCoinData(id: string) {
    try {
        const response = await fetcher<any>(`/coins/markets`, {
            vs_currency: 'usd',
            ids: id,
        });

        return response[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getOHLCData(id: string, days: string = '365') {
    try {
        const response = await fetcher<number[][]>(`/coins/${id}/ohlc`, {
            vs_currency: 'usd',
            days: days,
        });

        return response;
    } catch (error) {
        console.log(error);
        return [];
    }
}