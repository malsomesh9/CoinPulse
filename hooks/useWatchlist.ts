'use client';

import { useState, useEffect } from 'react';

export const useWatchlist = () => {
    const [watchlist, setWatchlist] = useState<string[]>([]);

    useEffect(() => {
        const savedWatchlist = localStorage.getItem('coinpulse-watchlist');
        if (savedWatchlist) {
            try {
                setWatchlist(JSON.parse(savedWatchlist));
            } catch (e) {
                console.error('Error parsing watchlist', e);
            }
        }
    }, []);

    const toggleWatchlist = (coinId: string) => {
        const newWatchlist = watchlist.includes(coinId)
            ? watchlist.filter(id => id !== coinId)
            : [...watchlist, coinId];

        setWatchlist(newWatchlist);
        localStorage.setItem('coinpulse-watchlist', JSON.stringify(newWatchlist));
    };

    const isWatched = (coinId: string) => watchlist.includes(coinId);

    return { watchlist, toggleWatchlist, isWatched };
};
