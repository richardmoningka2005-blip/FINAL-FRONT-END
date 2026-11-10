import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-white">
              Sistem Pengecekan Plagiarisme Multi-File UNKLAB
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Final Project Front End & Backend • Universitas Klabat (UNKLAB)
          </p>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Ditenagai oleh React 19, Spring Boot, H2 Database & Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
