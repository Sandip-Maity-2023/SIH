import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { FcSearch } from 'react-icons/fc';
import { FaShoppingCart } from 'react-icons/fa';
import { MapPin, LogOut, ChevronDown, Zap, ShieldCheck } from 'lucide-react';
import { GiTomato, GiFruitBowl, GiMilkCarton } from 'react-icons/gi';
import { MdBakeryDining } from 'react-icons/md';

const roleLinks = {
  FARMER: [
    ['Dashboard', '/dashboard'],
    ['My Produce', '/dashboard'],
    ['Orders', '/orders'],
    ['Payouts', '/payouts'],
    ['Schedule', '/schedule'],
    ['Reports', '/reports'],
    ['Profile', '/profile'],
  ],
  FPO: [
    ['Dashboard', '/dashboard'],
    ['My Produce', '/dashboard'],
    ['Orders', '/orders'],
    ['Payouts', '/payouts'],
    ['Schedule', '/schedule'],
    ['Reports', '/reports'],
    ['Profile', '/profile'],
  ],
  BUYER: [
    ['Marketplace', '/marketplace'],
    ['Cart', '/cart'],
    ['Orders', '/buyer-dashboard'],
    ['Tracking', '/logistics'],
    ['Profile', '/profile'],
  ],
  CONSUMER: [
    ['Marketplace', '/marketplace'],
    ['Cart', '/cart'],
    ['Orders', '/buyer-dashboard'],
    ['Tracking', '/logistics'],
    ['Profile', '/profile'],
  ],
  BULK_BUYER: [
    ['Marketplace', '/marketplace'],
    ['Cart', '/cart'],
    ['Orders', '/buyer-dashboard'],
    ['Tracking', '/logistics'],
    ['Profile', '/profile'],
  ],
  LOGISTICS_PARTNER: [
    ['Tracking', '/logistics'],
    ['Marketplace', '/marketplace'],
    ['Schedule', '/schedule'],
    ['Profile', '/profile'],
  ],
  LOGISTICS: [
    ['Tracking', '/logistics'],
    ['Marketplace', '/marketplace'],
    ['Schedule', '/schedule'],
    ['Profile', '/profile'],
  ],
  DRIVER: [
    ['Tracking', '/logistics'],
    ['Marketplace', '/marketplace'],
    ['Schedule', '/schedule'],
    ['Profile', '/profile'],
  ],
  ADMIN: [
    ['Admin', '/admin'],
    ['Orders', '/admin/orders'],
    ['Analytics', '/admin/analytics'],
    ['Disputes', '/admin/disputes'],
    ['Settings', '/settings'],
    ['Profile', '/profile'],
  ],
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const cartItems = cartContext?.cartItems || [];
  const subtotal = cartContext?.subtotal || 0;

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const role = String(user?.role || '').toUpperCase();
  const links = user ? roleLinks[role] || roleLinks.FARMER : [];

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity ? 1 : 1), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-xl">
      {/* Top Banner - Premium Green Header (No Yellow) */}
      <div className="bg-[#064e3b] text-white px-3 py-2.5 sm:px-6 border-b border-emerald-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          {/* Logo & Delivery Time Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1DB954] text-slate-950 font-black text-2xl tracking-tighter shadow-md group-hover:scale-105 transition-transform">
                K
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight text-white">
                  KRISHI <span className="text-[#1DB954]">AGRI</span>
                </span>
                <span className="text-[10px] font-black tracking-widest text-emerald-200 uppercase mt-0.5">
                  Seedhe Kisan Se
                </span>
              </div>
            </Link>

            <div className="hidden md:flex flex-col border-l border-emerald-700/60 pl-3">
              <div className="flex items-center gap-1 text-[11px] font-black tracking-tight text-[#1DB954] uppercase">
                <Zap className="h-3.5 w-3.5 fill-[#1DB954]" />
                Delivery in 15 MINS
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-100 cursor-pointer hover:text-white transition">
                <MapPin className="h-3.5 w-3.5 text-[#1DB954] shrink-0" />
                <span>Singur, Hooghly Hub</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </div>

          {/* Embedded Interactive Search Bar with FcSearch Icon */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "fresh potatoes, tomatoes, Alphonso mango, organic wheat..."'
                className="w-full h-10 rounded-xl bg-slate-900/90 text-white placeholder-slate-400 px-4 pl-10 text-xs font-bold shadow-inner border border-emerald-700/70 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent transition"
              />
              <FcSearch className="absolute left-3 top-2.5 text-lg" />
            </div>
          </form>

          {/* Right Action Items & Cart Pill Button */}
          <div className="flex items-center gap-3 shrink-0 text-xs">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 rounded-xl bg-emerald-900/80 border border-emerald-700 px-2.5 py-1 hover:bg-emerald-800 transition">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-7 w-7 rounded-full object-cover border border-[#1DB954]" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-[#1DB954] text-slate-950 text-xs font-black flex items-center justify-center">
                      {(user.name || user.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden font-extrabold sm:inline text-white">{user.name || user.fullName}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 transition border border-emerald-700"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="font-extrabold text-white hover:text-[#1DB954] transition px-2">
                Login
              </Link>
            )}

            {/* Premium Green Interactive Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 rounded-xl bg-[#0C831F] hover:bg-[#1DB954] text-white hover:text-slate-950 font-black px-4 py-2 shadow-lg transition-all transform active:scale-95 border border-emerald-500/30"
            >
              <FaShoppingCart className="text-base shrink-0" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-black uppercase">
                  {totalCartCount > 0 ? `${totalCartCount} Items` : 'My Cart'}
                </span>
                {subtotal > 0 && (
                  <span className="text-[10px] font-extrabold text-emerald-100">
                    ₹{subtotal.toLocaleString()}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Bar - Premium Emerald Green Category Links */}
      <div className="bg-emerald-950 text-slate-100 border-b border-emerald-900 px-3 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
            {links.map(([label, to]) => (
              <NavLink
                key={`${label}-${to}`}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-1.5 transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0C831F] text-white font-black shadow-sm border border-emerald-600'
                      : 'text-slate-300 hover:bg-emerald-900/60 hover:text-white'
                  }`
                }
              >
                {label === 'Marketplace' && <GiFruitBowl className="text-sm" />}
                {label === 'Dashboard' && <GiTomato className="text-sm" />}
                {label === 'Orders' && <FaShoppingCart className="text-sm" />}
                {label === 'Payouts' && <GiMilkCarton className="text-sm" />}
                {label}
              </NavLink>
            ))}
          </div>

          {user && (
            <span className="rounded-full bg-emerald-900 border border-emerald-700 px-3 py-0.5 text-[10px] font-black text-[#1DB954] shrink-0">
              Role: {role}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
