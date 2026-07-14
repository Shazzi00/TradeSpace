'use client';

import { useEffect, useState, useRef } from 'react';

interface Message {
  id: number;
  sender_name: string;
  avatar: string;
  text: string;
  time: string;
}

export default function WorkspaceDashboard() {
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('User');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load User Info and Metrics
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setCurrentUser(savedName);
    }

    fetch('http://127.0.0.1:8000/api/dashboard/workspace')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Workspace API Error:', err));
  }, []);

  // Real-Time Message Sync (Short Polling every 2000ms)
  useEffect(() => {
    const fetchMessages = () => {
      fetch('http://127.0.0.1:8000/api/chat/messages')
        .then((res) => res.json())
        .then((dbMessages) => {
          if (dbMessages) {
            setMessages(dbMessages);
          }
        })
        .catch((err) => console.error('Chat Sync Error:', err));
    };

    fetchMessages(); // Run once immediately on load

    const interval = setInterval(fetchMessages, 2000); // Poll database every 2 seconds
    return () => clearInterval(interval); // Clear interval on route exit
  }, []);

  // Auto-scroll chat window when a new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const initials = currentUser
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const res = await fetch('http://127.0.0.1:8000/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: currentUser,
          avatar: initials,
          text: newMessage,
        }),
      });

      if (res.ok) {
        const savedMessage = await res.json();
        setMessages((prev) => [...prev, savedMessage]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to write message to SQLite', err);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-zinc-500 animate-pulse text-sm">Loading workspace matrix...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Team Workspace</h1>
          <p className="text-sm text-zinc-400 mt-1">Daily sprint metrics, meetings, and project reviews.</p>
        </div>
        <div className="bg-[#121214] px-4 py-2 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400">
          🕒 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Main Grid Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Section: Rings and Meetings */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hour Ring */}
            <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center justify-between min-h-[280px]">
              <h3 className="text-zinc-400 text-xs font-semibold self-start uppercase tracking-wider">Working Day Progress</h3>
              <div className="relative my-4 flex items-center justify-center w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" className="stroke-zinc-800" strokeWidth="10" fill="transparent" />
                  <circle cx="72" cy="72" r="60" className="stroke-cyan-400" strokeWidth="10" fill="transparent" strokeDasharray="376" strokeDashoffset="100" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">{data.working_hours}</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Working Hours</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500">Currently logging focus data in real-time</p>
            </div>

            {/* Task Ring */}
            <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center justify-between min-h-[280px]">
              <h3 className="text-zinc-400 text-xs font-semibold self-start uppercase tracking-wider">Overall Tasks</h3>
              <div className="relative my-4 flex items-center justify-center w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" className="stroke-zinc-800" strokeWidth="10" fill="transparent" />
                  <circle cx="72" cy="72" r="60" className="stroke-emerald-400" strokeWidth="10" fill="transparent" strokeDasharray="376" strokeDashoffset="188" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">50%</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Completed</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="text-emerald-400">● Done: {data.task_stats.completed}</span>
                <span className="text-zinc-500">● Passed: {data.task_stats.pending}</span>
              </div>
            </div>
          </div>

          {/* Meetings List */}
          <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>📅</span> Scheduled Meetings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.meetings.map((meeting: any) => (
                <div key={meeting.id} className="p-4 bg-[#18181b] border border-zinc-800/60 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:border-zinc-700/80 transition">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"></div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-bold mb-1">{meeting.time}</div>
                    <div className="font-bold text-zinc-200 text-sm mb-1 line-clamp-1">{meeting.title}</div>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{meeting.description}</p>
                  </div>
                  <div className="mt-3">
                    <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase border border-cyan-500/10">
                      {meeting.team}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Syncing Team Chat */}
        <div className="xl:col-span-1 bg-[#121214] border border-zinc-800 rounded-2xl flex flex-col h-[610px]">
          <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Manager Live Chat</h3>
              <p className="text-[11px] text-zinc-500 font-medium">Logged in as: <span className="text-emerald-400 font-bold">{currentUser}</span></p>
            </div>
            <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Synchronized
            </span>
          </div>

          {/* Chat Conversation Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.map((msg) => {
              // Dynamically check if the logged in user is the sender of this database entry
              const isMe = msg.sender_name === currentUser;

              return (
                <div key={msg.id} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isMe ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {msg.avatar}
                  </div>
                  <div className="space-y-1 max-w-[75%]">
                    <div className={`flex items-center gap-1.5 text-[10px] ${isMe ? 'justify-end' : ''}`}>
                      <span className="font-bold text-zinc-400">{msg.sender_name}</span>
                      <span className="text-zinc-600">• {msg.time}</span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-tr-none' 
                        : 'bg-zinc-900 text-zinc-300 border border-zinc-800/60 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Messaging Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800/80 bg-[#151518] flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message here..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl transition duration-150 shadow-md"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}