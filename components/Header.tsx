'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import HamburgerMenu from './HamburgerMenu';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <Link href="https://nicediaries.vercel.app/" className="flex items-center gap-2 group">
              <BookOpen className="w-7 h-7 text-[#ff6b35] group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-light text-gray-900 dark:text-white">
                Nice Diaries
              </span>
            </Link>
          </div>

          {/* Right: Dark Mode Toggle */}
          <div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
