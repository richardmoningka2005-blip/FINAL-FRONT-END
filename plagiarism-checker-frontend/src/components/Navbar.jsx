import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Upload, History, Info, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/health');
        if (res.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Pemeriksaan Baru', path: '/check', icon: Upload },
    { name: 'Riwayat Sesi', path: '/history', icon: History },
    { name: 'Tentang Sistem', path: '/about', icon: Info },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">UNKLAB</span>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded font-mono font-semibold border border-blue-500/30">AI Checker</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Sistem Deteksi Plagiarisme Multi-File Mahasiswa</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Backend / H2 Indicator Badge */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Spring Boot + H2:</span>
            {backendStatus === 'online' ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktif (Port 8080)
              </span>
            ) : backendStatus === 'checking' ? (
              <span className="text-amber-400">Menghubungkan...</span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Offline
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
