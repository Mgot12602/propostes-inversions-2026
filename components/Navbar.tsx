'use client';

import Link from 'next/link';
import { Home, Shield, Building2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Inici' },
    { href: '/admin', icon: Shield, label: 'Admin' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 flex flex-col items-center py-8">
      <Link href="/" className="mb-12 group">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Building2 className="w-7 h-7 text-white" />
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative"
              title={item.label}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600 shadow-lg shadow-blue-500/50'
                    : 'bg-slate-700/50 hover:bg-slate-700 hover:scale-110'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              </div>
              
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="w-12 h-12 rounded-xl bg-slate-700/30 flex items-center justify-center">
          <span className="text-xs text-slate-500 font-bold">2026</span>
        </div>
      </div>
    </nav>
  );
}
