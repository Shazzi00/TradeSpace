'use client';

import { useEffect, useState } from 'react';

export default function EcommerceDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Retrieve the user's name saved during login
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUserName(savedName);

    // Fetch the mock e-commerce analytics
    fetch('http://127.0.0.1:8000/api/dashboard/ecommerce')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error('E-commerce API Error:', err));
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-500 animate-pulse text-sm">Loading financial analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Hello, {userName}! 👋</h1>
          <p className="text-sm text-zinc-400 mt-1">This is what's happening in your store this month.</p>
        </div>
        <div className="bg-[#121214] border border-zinc-800 px-4 py-2 rounded-xl text-sm font-semibold text-emerald-400">
          ✨ Live Updates
        </div>
      </div>

      {/* Grid of Metric Cards (Matches Image_c231b9.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Revenue</div>
          <div className="text-3xl font-black text-white mt-2">${metrics.total_revenue.toLocaleString()}</div>
          <div className="mt-2 text-xs flex items-center gap-1 text-emerald-400">
            <span>↑ 2.67%</span> <span className="text-zinc-500">vs last month</span>
          </div>
          <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm">
            ↗
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Orders</div>
          <div className="text-3xl font-black text-white mt-2">{metrics.total_orders}</div>
          <div className="mt-2 text-xs flex items-center gap-1 text-red-400">
            <span>↓ 0.45%</span> <span className="text-zinc-500">vs last month</span>
          </div>
          <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
            ↗
          </div>
        </div>

        {/* Card 3: Total Visitors */}
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Visitors</div>
          <div className="text-3xl font-black text-white mt-2">{metrics.total_visitors.toLocaleString()}</div>
          <div className="mt-2 text-xs flex items-center gap-1 text-emerald-400">
            <span>↑ 1.12%</span> <span className="text-zinc-500">vs last month</span>
          </div>
          <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
            ↗
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Net Profit</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">${metrics.net_profit.toLocaleString()}</div>
          <div className="mt-2 text-xs flex items-center gap-1 text-emerald-400">
            <span>↑ 5.67%</span> <span className="text-zinc-500">vs last month</span>
          </div>
          <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm">
            ↗
          </div>
        </div>

      </div>

      {/* Analytics and Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Performance Bar Chart (Pure CSS/Tailwind) */}
      {/* Revenue Performance Bar Chart (Fixed Height Rendering) */}
        <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Revenue Performance</h3>
            <span className="text-xs text-zinc-500">This month vs last</span>
          </div>
          
          {/* Chart Workspace Container */}
          <div className="h-48 flex items-end justify-between gap-3 pt-4 border-b border-zinc-800/80 px-2">
            {[35, 80, 45, 60, 50, 85, 95, 75].map((val, idx) => (
              <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group cursor-pointer">
                <div 
                  className="w-full bg-blue-500/80 hover:bg-blue-400 rounded-t-lg transition-all duration-300 relative"
                  style={{ height: `${val}%` }}
                >
                  {/* Hover Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-[10px] text-zinc-200 px-2 py-1 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                    ${(val * 100).toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold mt-2">{idx + 1} Aug</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category Side-panel */}
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Sales by Category</h3>
            <p className="text-xs text-zinc-500">Product volume sold this month.</p>
          </div>

          <div className="space-y-4">
            {metrics.sales_by_category.map((item: any, idx: number) => {
              // Cycle through subtle gradient borders
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];
              const textColors = ['text-blue-400', 'text-emerald-400', 'text-purple-400', 'text-amber-400'];
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`}></span>
                      {item.category}
                    </span>
                    <span className={textColors[idx % textColors.length]}>
                      ${item.amount.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  {/* Bar tracks */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${colors[idx % colors.length]}`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-800/60 text-xs text-zinc-500 flex justify-between">
            <span>Outstanding Orders:</span>
            <span className="font-bold text-amber-400">{metrics.pending_confirmations} Orders</span>
          </div>
        </div>

      </div>
    </div>
  );
}