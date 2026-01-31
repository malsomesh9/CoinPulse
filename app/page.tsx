import React, { Suspense } from 'react';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
  CategoriesFallback,
  TrendingCoinsFallback,
} from '@/components/home/fallback';
import Categories from '@/components/home/Categories';
import TopGainersLosers from '@/components/home/TopGainersLosers';
import Hero from '@/components/home/Hero';
import Watchlist from '@/components/Watchlist';
import CoinOverview from '@/components/home/CoinOverview';
import { CoinOverviewFallback } from '@/components/home/fallback';

export default async function Home() {
  return (
    <main className="main-container">
      <Hero />

      <Watchlist />

      <section className="mt-12">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full mt-12">
        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>

        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>

        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-64 bg-white/5 rounded-xl animate-pulse" />}>
            <TopGainersLosers />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
