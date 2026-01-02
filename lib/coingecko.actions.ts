'use server';

import qs from 'query-string';
import { CoinGeckoErrorBody, PoolData, QueryParams, Trending, Category } from '@/types';

const CG_BASE_URL = (process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3').replace(/\/$/, '');
const GT_BASE_URL = 'https://api.geckoterminal.com/api/v2';
const API_KEY = process.env.COINGECKO_API_KEY;

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
): Promise<T> {
    const isGeckoTerminal = endpoint.startsWith('/onchain');
    const baseUrl = isGeckoTerminal ? GT_BASE_URL : CG_BASE_URL;

    // Sanitize endpoint to ensure no leading slash
    const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    const url = qs.stringifyUrl(
        {
            url: `${baseUrl}/${sanitizedEndpoint}`,
            query: params,
        },
        { skipEmptyString: true, skipNull: true },
    );

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (API_KEY && !isGeckoTerminal) {
        // Only use CoinGecko API key for CoinGecko endpoints
        headers['x-cg-pro-api-key'] = API_KEY;
    }

    const response = await fetch(url, {
        headers,
        next: { revalidate },
    });

    if (!response.ok) {
        let errorBody: CoinGeckoErrorBody = {};
        try {
            errorBody = await response.json();
        } catch (e) {
            // Silently fail if body is not JSON
        }

        const errorMessage = errorBody.error || response.statusText || 'Unknown Error';
        const apiName = isGeckoTerminal ? 'GeckoTerminal' : 'CoinGecko';
        throw new Error(`${apiName} API Error ${response.status}: ${errorMessage} (URL: ${url})`);
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

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetcher<Category[]>('/coins/categories');
        return response;
    } catch (error) {
        console.log(error);
        return [];
    }
}