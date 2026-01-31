'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import { useState } from 'react';



const Header = ({ children }: { children?: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  return (
    <header>
      <div className="main-container inner">
        <div className="flex items-center flex-1">
          <Link href="/">
            <Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40} />
          </Link>

          {children}
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={cn('nav-link', {
              'is-active': pathname === '/',
            })}
          >
            Home
          </Link>

          <Link
            href="/coins"
            className={cn('nav-link', {
              'is-active': pathname === '/coins',
            })}
          >
            Coins
          </Link>

          <div className="search-trigger ml-4" onClick={() => setIsSearchOpen(true)}>
            <Search size={18} />
            <span className="max-sm:hidden">Search</span>
            <kbd className="kbd">⌘K</kbd>
          </div>
        </nav>

        <SearchModal isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />

      </div>
    </header>
  );
};

export default Header;
