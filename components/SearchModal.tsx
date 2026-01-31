'use client';

import React, { useEffect, useState } from 'react';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { searchCoins } from '@/lib/coingecko.actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search } from 'lucide-react';

interface SearchModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const SearchModal = ({ isOpen, setIsOpen }: SearchModalProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(!isOpen);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            const coins = await searchCoins(query);
            setResults(coins || []);
            setLoading(false);
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const onSelect = (id: string) => {
        setIsOpen(false);
        router.push(`/coins/${id}`);
    };

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput
                placeholder="Search coins, exchanges..."
                value={query}
                onValueChange={setQuery}
            />
            <CommandList className="max-h-[400px]">
                <CommandEmpty>{loading ? 'Searching...' : 'No results found.'}</CommandEmpty>
                {results.length > 0 && (
                    <CommandGroup heading="Coins">
                        {results.map((coin) => (
                            <CommandItem
                                key={coin.id}
                                onSelect={() => onSelect(coin.id)}
                                className="flex items-center gap-3 p-2 cursor-pointer"
                            >
                                <Image
                                    src={coin.thumb}
                                    alt={coin.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium">{coin.name}</span>
                                    <span className="text-xs text-purple-100 uppercase">{coin.symbol}</span>
                                </div>
                                <span className="ml-auto text-xs text-purple-100 italic">#{coin.market_cap_rank}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
};

export default SearchModal;
