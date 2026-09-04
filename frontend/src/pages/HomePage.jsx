import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Leaf, LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function HomePage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const role = String(user?.role || '').toUpperCase();

  if (isAuthenticated) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'BUYER' || role === 'CONSUMER' || role === 'BULK_BUYER') return <Navigate to="/marketplace" replace />;
    if (role === 'LOGISTICS' || role === 'LOGISTICS_PARTNER') return <Navigate to="/logistics" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[520px] max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <Leaf className="h-8 w-8" />
          </span>
          <h1 className="text-4xl font-black text-slate-950 sm:text-5xl">KRISHI</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Direct farmer-to-consumer marketplace with role-based access for farmers, buyers,
            logistics partners, and administrators.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:bg-slate-100"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
