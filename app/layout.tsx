import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Header from '@/components/Header';
import GlobalStats from '@/components/GlobalStats';
import TrendingTicker from '@/components/TrendingTicker';
import Footer from '@/components/Footer';




const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CoinPulse',
  description: 'Crypto Screener App with a built-in High-Frequency Terminal & Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={<div className="h-10 bg-dark-900 border-b border-white/5 invisible" />}>
          <GlobalStats />
        </Suspense>
        <Header>
          <Suspense fallback={<div className="ml-8 h-6 w-64 bg-white/5 rounded-full animate-pulse" />}>
            <TrendingTicker />
          </Suspense>
        </Header>
        {children}
        <Footer />
      </body>


    </html>
  );
}
