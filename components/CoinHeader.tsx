import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Star } from 'lucide-react';
import { LiveCoinHeaderProps } from '@/types';
import { useWatchlist } from '@/hooks/useWatchlist';
import { PriceFlash } from '@/components/PriceFlash';


const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  symbol,
  image,
  livePrice,
  priceChange24h,
  marketCap,
  totalVolume,
  high24h,
  low24h,
  rank,
  coinId
}: LiveCoinHeaderProps & { coinId: string }) => {
  const { toggleWatchlist, isWatched } = useWatchlist();
  const isCoinWatched = isWatched(coinId);
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: 'Rank',
      value: `#${rank}`,
      className: 'rank',
    },
    {
      label: 'Market Cap',
      value: formatCurrency(marketCap),
    },
    {
      label: 'Volume (24h)',
      value: formatCurrency(totalVolume),
    },
    {
      label: 'Today',
      value: formatPercentage(livePriceChangePercentage24h),
      isUp: isTrendingUp,
      showIcon: true,
    },
    {
      label: '30 Days',
      value: formatPercentage(priceChangePercentage30d),
      isUp: isThirtyDayUp,
      showIcon: true,
    },
    {
      label: '24h High',
      value: formatCurrency(high24h),
      className: 'text-green-500 font-medium',
    },
    {
      label: '24h Low',
      value: formatCurrency(low24h),
      className: 'text-red-500 font-medium',
    },
  ];

  return (
    <div id="coin-header" className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image src={image} alt={name} width={48} height={48} className="rounded-full shadow-lg" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{name}</h2>
              <span className="text-purple-100/40 font-bold uppercase tracking-widest text-sm">{symbol}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWatchlist(coinId)}
            className={cn(
              "bg-white/5 hover:bg-white/10 text-white rounded-lg p-2 transition-all border border-white/10 group cursor-pointer",
              isCoinWatched && "bg-yellow-400/10 border-yellow-400/20"
            )}
            title={isCoinWatched ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Star className={cn("size-5 transition-colors", isCoinWatched ? "fill-yellow-400 text-yellow-400" : "text-purple-100/50 group-hover:text-yellow-400")} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-dark-500/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="space-y-1">
          <p className="text-sm font-medium text-purple-100/50 ml-1">Current Price</p>
          <div className="flex items-center gap-4">
            <PriceFlash value={livePrice ?? 0}>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {formatCurrency(livePrice)}
              </h1>
            </PriceFlash>
            <Badge className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-bold flex gap-1.5 border-none shadow-lg',
              isTrendingUp ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
            )}>
              {isTrendingUp ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
              {formatPercentage(Math.abs(livePriceChangePercentage24h))}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 text-sm flex-1 lg:ml-12 border-l border-white/5 lg:pl-12">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1.5">
              <p className="text-purple-100/40 font-medium uppercase tracking-wider text-[10px] sm:text-xs">
                {stat.label}
              </p>
              <div className={cn("font-bold text-white whitespace-nowrap flex items-center gap-1", stat.className)}>
                <span>{stat.value}</span>
                {stat.showIcon && (
                  stat.isUp ? <TrendingUp className="size-3.5 text-green-500" /> : <TrendingDown className="size-3.5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CoinHeader;
