'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PriceFlashProps {
    value: number;
    children: React.ReactNode;
    className?: string;
}

export const PriceFlash = ({ value, children, className }: PriceFlashProps) => {
    const [flash, setFlash] = useState<'up' | 'down' | null>(null);
    const prevValue = useRef(value);

    useEffect(() => {
        if (value > prevValue.current) {
            setFlash('up');
        } else if (value < prevValue.current) {
            setFlash('down');
        }

        prevValue.current = value;

        const timer = setTimeout(() => setFlash(null), 1000);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={cn(
            'transition-all duration-500 rounded-sm px-1 -mx-1',
            flash === 'up' && 'bg-green-500/20 text-green-500',
            flash === 'down' && 'bg-red-500/20 text-red-500',
            className
        )}>
            {children}
        </div>
    );
};
