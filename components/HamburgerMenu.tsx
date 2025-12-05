'use client';

import { useState } from 'react';
import { Menu, X, Home, BookOpen, UserPlus, LogIn, LayoutDashboard, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);

  const guestLinks = [
    { href: 'https://nicediaries.vercel.app/', label: 'Home', icon: Home },
    { href: 'https://nicediaries.vercel.app/browse', label: 'Browse', icon: BookOpen },
    { href: 'https://nicediaries.vercel.app/signup', label: 'Sign Up', icon: UserPlus },
    { href: 'https://nicediaries.vercel.app/login', label: 'Log In', icon: LogIn },
  ];

  const userLinks = [
    { href: 'https://nicediaries.vercel.app/', label: 'Home', icon: Home },
    { href: 'https://nicediaries.vercel.app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: 'https://nicediaries.vercel.app/profile', label: 'Profile', icon: User },
    { href: 'https://nicediaries.vercel.app/browse', label: 'Browse', icon: BookOpen },
    { href: 'https://nicediaries.vercel.app/settings', label: 'Settings', icon: Settings },
  ];

  const links = session ? userLinks : guestLinks;

  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-[#ff6b35]">Menu</h2>
            <button onClick={toggleMenu} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-[#ff6b35] transition-colors" />
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#ff6b35] transition-colors">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
