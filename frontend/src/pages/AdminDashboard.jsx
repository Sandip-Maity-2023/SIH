import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, ClipboardList, ShieldAlert, SlidersHorizontal } from 'lucide-react';

const items = [
  ['Order Management', '/admin/orders', ClipboardList],
  ['Analytics & Reports', '/admin/analytics', BarChart3],
  ['Return & Dispute Approval', '/admin/disputes', ShieldAlert],
  ['Admin Settings', '/settings', SlidersHorizontal],
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Admin Dashboard</p>
          <h1 className="text-2xl font-black text-slate-950">Operations Control</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map(([label, to, Icon]) => (
            <Link key={to} to={to} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300">
              <Icon className="mb-4 h-6 w-6 text-emerald-700" />
              <span className="text-lg font-black text-slate-950">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
