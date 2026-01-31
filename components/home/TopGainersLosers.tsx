import { getTopGainersLosers } from '@/lib/coingecko.actions';
import LiveTopGainersLosers from './LiveTopGainersLosers';

const TopGainersLosers = async () => {
    try {
        const { top_gainers, top_losers } = await getTopGainersLosers();
        return <LiveTopGainersLosers initialGainers={top_gainers} initialLosers={top_losers} />;
    } catch (error) {
        console.error('Error fetching gainers/losers:', error);
        return (
            <section className="flex flex-col lg:flex-row gap-6 w-full mt-12">
                <div className="flex-1 p-6 bg-dark-500/30 rounded-2xl border border-white/5 text-center">
                    <p className="text-purple-100/30 italic">Unable to load gainers/losers at this time.</p>
                </div>
            </section>
        );
    }
};

export default TopGainersLosers;
