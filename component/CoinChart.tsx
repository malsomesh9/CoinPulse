"use client";

import { createChart, ColorType, IChartApi, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

const CoinChart = ({ data }: { data: number[][] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'black',
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
            grid: {
                vertLines: { color: 'rgba(197, 203, 206, 0.5)' },
                horzLines: { color: 'rgba(197, 203, 206, 0.5)' },
            },
        });

        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        const formattedData = data.map((item) => ({
            time: (item[0] / 1000) as UTCTimestamp,
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
        }));

        candlestickSeries.setData(formattedData);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data]);

    return (
        <div ref={chartContainerRef} className='w-full h-[500px]' />
    );
};

export default CoinChart;
