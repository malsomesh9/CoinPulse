'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { CandlestickChartProps, OHLCData, Period } from '@/types';

import {
  getCandlestickConfig,
  getChartConfig,
  LIVE_INTERVAL_BUTTONS,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/constants';
import { CandlestickSeries, createChart, HistogramSeries, IChartApi, ISeriesApi, LineSeries, Time } from 'lightweight-charts';
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
  liveOhlcv = null,
  mode = 'historical',
  liveInterval,
  setLiveInterval,
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const prevOhlcDataLength = useRef<number>(data?.length || 0);

  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days, interval } = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
        interval,
        precision: 'full',
      });

      startTransition(() => {
        setOhlcData(newData ?? []);
      });
    } catch (e) {
      console.error('Failed to fetch OHLCData', e);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    setPeriod(newPeriod);
    fetchOHLCData(newPeriod);
  };

  const ma7SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const ma25SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const calculateSMA = (data: { time: Time; close: number }[], period: number) => {
    const result = [];
    for (let i = period; i <= data.length; i++) {
      const slice = data.slice(i - period, i);
      const sum = slice.reduce((acc, item) => acc + item.close, 0);
      result.push({
        time: data[i - 1].time,
        value: sum / period,
      });
    }
    return result;
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ['daily', 'weekly', 'monthly'].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    // Series
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
    const ma7 = chart.addSeries(LineSeries, { color: '#fcd34d', lineWidth: 1, title: 'MA(7)' });
    const ma25 = chart.addSeries(LineSeries, { color: '#a855f7', lineWidth: 1, title: 'MA(25)' });

    const convertedToSeconds = ohlcData.map(
      (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
    );

    const converted = convertOHLCData(convertedToSeconds);
    series.setData(converted);
    ma7.setData(calculateSMA(converted, 7));
    ma25.setData(calculateSMA(converted, 25));

    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;
    ma7SeriesRef.current = ma7;
    ma25SeriesRef.current = ma25;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      ma7SeriesRef.current = null;
      ma25SeriesRef.current = null;
    };
  }, [height, period]);

  useEffect(() => {
    if (!candleSeriesRef.current || !ma7SeriesRef.current || !ma25SeriesRef.current) return;

    const convertedToSeconds = ohlcData.map(
      (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
    );

    let merged: OHLCData[];

    if (liveOhlcv) {
      const liveTimestamp = Math.floor(liveOhlcv[0] / 1000);
      const lastHistoricalCandle = convertedToSeconds[convertedToSeconds.length - 1];

      if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
        merged = [...convertedToSeconds.slice(0, -1), [liveTimestamp, ...liveOhlcv.slice(1)] as OHLCData];
      } else {
        merged = [...convertedToSeconds, [liveTimestamp, ...liveOhlcv.slice(1)] as OHLCData];
      }
    } else {
      merged = convertedToSeconds;
    }

    merged.sort((a, b) => a[0] - b[0]);
    const converted = convertOHLCData(merged);

    candleSeriesRef.current.setData(converted);
    ma7SeriesRef.current.setData(calculateSMA(converted, 7));
    ma25SeriesRef.current.setData(calculateSMA(converted, 25));

    const dataChanged = prevOhlcDataLength.current !== ohlcData.length;

    if (dataChanged || mode === 'historical') {
      chartRef.current?.timeScale().fitContent();
      prevOhlcDataLength.current = ohlcData.length;
    }
  }, [ohlcData, period, liveOhlcv, mode]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">Period:</span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={period === value ? 'config-button-active' : 'config-button'}
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>

        {liveInterval && (
          <div className="button-group">
            <span className="text-sm mx-2 font-medium text-purple-100/50">Update Frequency:</span>
            {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={liveInterval === value ? 'config-button-active' : 'config-button'}
                onClick={() => setLiveInterval && setLiveInterval(value)}
                disabled={isPending}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default CandlestickChart;
