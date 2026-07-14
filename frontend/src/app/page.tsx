'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  // Defaults to FALSE so "Register" is always shown first to brand-new visitors
  const [isLogin, setIsLogin] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Watch for redirect parameters (like mode=login passed from a sidebar logout action)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'login') {
        setIsLogin(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user_token', data.token);
        localStorage.setItem('user_name', data.user.name);
        router.push('/dashboard/workspace');
      } else {
        setError(data.message || 'Verification failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Cannot reach backend. Make sure php artisan serve is running in your backend folder!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md p-8 bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-emerald-400 tracking-wider">NEXUS</div>
          <p className="text-sm text-zinc-400 mt-2">
            {isLogin ? 'Sign in to your team dashboard' : 'Create your workspace account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Bessie Cooper"
                className="w-full p-3 bg-[#18181b] border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. bessie@workspace.com"
              className="w-full p-3 bg-[#18181b] border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Min. 6 characters"
                className="w-full p-3 pr-12 bg-[#18181b] border border-zinc-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {/* Toggle visibility eye button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye Slash Icon (Password Visible)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  // Eye Icon (Password Hidden)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-[#09090b] font-bold rounded-xl transition duration-150 shadow-lg shadow-emerald-500/10">
            {isLogin ? 'Access Dashboard' : 'Register Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-emerald-400 hover:underline font-bold ml-1 transition"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}