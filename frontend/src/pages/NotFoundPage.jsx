import React from 'react';
import { Sprout, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        {/* Decorative Graphic Icon */}
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <Sprout className="w-10 h-10" />
        </div>

        {/* Error Title */}
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full mb-3">
          Error 404 — Page Unreachable
        </span>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Field Not Found
        </h1>

        <p className="text-slate-600 text-sm mt-3 leading-relaxed">
          The page or produce listing you are looking for might have been moved, sold out, or does not exist on the KRISHI platform.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" /> Return to Marketplace
          </a>

          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
          KRISHI — Direct Farmer-to-Consumer Digital Marketplace
        </div>
      </div>
    </div>
  );
}
