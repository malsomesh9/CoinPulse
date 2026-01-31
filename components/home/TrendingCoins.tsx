import { fetcher } from '@/lib/coingecko.actions';
import { TrendingCoinsFallback } from './fallback';
import { TrendingCoin } from '@/types';
import LiveTrendingCoins from './LiveTrendingCoins';

const TrendingCoins = async () => {
  try {
    const response = await fetcher<{ coins: TrendingCoin[] }>('/search/trending', undefined, 300);
    return <LiveTrendingCoins initialCoins={response.coins} />;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return <TrendingCoinsFallback />;
  }
};

export default TrendingCoins;
