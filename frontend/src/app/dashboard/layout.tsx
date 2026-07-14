'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('User');

  // Grab the logged-in user's actual name on load
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Compute initials dynamically (e.g., "Sheraza Sadkhan" -> "SS")
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_name');
    router.push('/?mode=login');
  };

  const menuItems = [
    { name: 'Workspace', path: '/dashboard/workspace', icon: '📁' },
    { name: 'E-Commerce', path: '/dashboard/ecommerce', icon: '📈' },
  ];

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#121214] border-r border-zinc-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="text-2xl font-black text-emerald-400 tracking-wider flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            NEXUS
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-150 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dynamic User Profile Area */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 font-bold">
              {initials || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-zinc-200 truncate">{userName}</div>
              <div className="text-xs text-zinc-500">Workspace Member</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition duration-150"
          >
            Log Out Session
          </button>
        </div>
      </aside>

      {/* Main Content Display */}
      <main className="flex-1 overflow-y-auto bg-[#0c0c0e] p-8">
        {children}
      </main>
    </div>
  );
}