
import React, { useContext, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

import {
  Search,
  MapPin,
  LogOut,
  ChevronDown,
  Zap,
  Bot,
  ExternalLink,
  Menu,
  X,
  ShoppingCart,
  UserCircle,
  LayoutDashboard,
  Package,
  Wallet,
  CalendarDays,
  BarChart3,
  Truck,
  Settings,
  ShieldAlert,
  Leaf,
  CircleUserRound,
  SearchX,
} from "lucide-react";

const RESEARCHMIND_URL =
  "https://advanceddevelopment-5yzkdbhpswjca4zvggebhn.streamlit.app/";

const roleLinks = {
  FARMER: [
    ["Dashboard", "/dashboard", LayoutDashboard],
    ["My Produce", "/dashboard", Package],
    ["Orders", "/buyer-dashboard", ShoppingCart],
    ["Payouts", "/payouts", Wallet],
    ["Schedule", "/schedule", CalendarDays],
    ["Reports", "/reports", BarChart3],
    ["Profile", "/profile", CircleUserRound],
  ],

  FPO: [
    ["Dashboard", "/dashboard", LayoutDashboard],
    ["My Produce", "/dashboard", Package],
    ["Orders", "/orders", ShoppingCart],
    ["Payouts", "/payouts", Wallet],
    ["Schedule", "/schedule", CalendarDays],
    ["Reports", "/reports", BarChart3],
    ["Profile", "/profile", CircleUserRound],
  ],

  BUYER: [
    ["Marketplace", "/marketplace", Leaf],
    ["Cart", "/cart", ShoppingCart],
    ["Orders", "/buyer-dashboard", Package],
    ["Tracking", "/logistics", Truck],
    ["Profile", "/profile", CircleUserRound],
  ],

  CONSUMER: [
    ["Marketplace", "/marketplace", Leaf],
    ["Cart", "/cart", ShoppingCart],
    ["Orders", "/buyer-dashboard", Package],
    ["Tracking", "/logistics", Truck],
    ["Profile", "/profile", CircleUserRound],
  ],

  BULK_BUYER: [
    ["Marketplace", "/marketplace", Leaf],
    ["Cart", "/cart", ShoppingCart],
    ["Orders", "/buyer-dashboard", Package],
    ["Tracking", "/logistics", Truck],
    ["Profile", "/profile", CircleUserRound],
  ],

  LOGISTICS_PARTNER: [
    ["Tracking", "/logistics", Truck],
    ["Marketplace", "/marketplace", Leaf],
    ["Schedule", "/schedule", CalendarDays],
    ["Profile", "/profile", CircleUserRound],
  ],

  LOGISTICS: [
    ["Tracking", "/logistics", Truck],
    ["Marketplace", "/marketplace", Leaf],
    ["Schedule", "/schedule", CalendarDays],
    ["Profile", "/profile", CircleUserRound],
  ],

  DRIVER: [
    ["Tracking", "/logistics", Truck],
    ["Marketplace", "/marketplace", Leaf],
    ["Schedule", "/schedule", CalendarDays],
    ["Profile", "/profile", CircleUserRound],
  ],

  ADMIN: [
    ["Admin", "/admin", LayoutDashboard],
    ["Orders", "/admin/orders", Package],
    ["Analytics", "/admin/analytics", BarChart3],
    ["Disputes", "/admin/disputes", ShieldAlert],
    ["Settings", "/settings", Settings],
    ["Profile", "/profile", CircleUserRound],
  ],
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartContext = useContext(CartContext);

  const cartItems = cartContext?.cartItems || [];
  const subtotal = Number(cartContext?.subtotal || 0);

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const role = String(user?.role || "").toUpperCase();

  const links = useMemo(() => {
    return user ? roleLinks[role] || roleLinks.FARMER : [];
  }, [user, role]);

  // Count actual quantities instead of counting only products.
  const totalCartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const displayName = user?.name || user?.fullName || "User";

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
    setMobileMenuOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/70 bg-slate-950 text-white shadow-2xl">
      {/* ================= TOP NAVBAR ================= */}
      <div className="border-b border-emerald-900/60 bg-[#064e3b]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-2xl font-black text-slate-950 shadow-lg shadow-emerald-950/30 transition-transform duration-300 group-hover:scale-105">
              K
            </span>

            <div className="hidden leading-none sm:flex sm:flex-col">
              <span className="text-xl font-black tracking-tight text-white lg:text-2xl">
                Kisan <span className="text-emerald-400">SetuAI</span>
              </span>

              <span className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200">
                Seedhe Kisan Se
              </span>
            </div>
          </Link>

          {/* Delivery Location */}
          <div className="hidden shrink-0 border-l border-emerald-700/60 pl-3 md:block">
            <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-emerald-400">
              <Zap className="h-3.5 w-3.5 fill-emerald-400" />
              Delivery in 15 mins
            </div>

            <button
              type="button"
              className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-100 transition hover:text-white"
              aria-label="Select delivery location"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Singur, Hooghly Hub</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="ml-auto flex min-w-0 flex-1 justify-center"
          >
            <div className="relative w-full max-w-2xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search fresh vegetables, fruits, grains..."
                aria-label="Search marketplace"
                className="h-10 w-full rounded-xl border border-emerald-800/80 bg-slate-950/80 px-10 pr-10 text-xs font-semibold text-white outline-none placeholder:text-slate-500 transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-emerald-400"
                >
                  <SearchX className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex max-w-[170px] items-center gap-2 rounded-xl border border-emerald-700/70 bg-emerald-950/70 px-2.5 py-1.5 transition hover:border-emerald-500 hover:bg-emerald-900"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${displayName}'s avatar`}
                      className="h-7 w-7 rounded-full border border-emerald-400 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="truncate text-xs font-extrabold text-white">
                    {displayName}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  aria-label="Logout"
                  title="Logout"
                  className="rounded-xl border border-emerald-700/70 bg-emerald-950/70 p-2 text-emerald-100 transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-xs font-extrabold text-white transition hover:bg-emerald-900 hover:text-emerald-300"
              >
                Login
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-3.5 py-2 text-white shadow-lg shadow-emerald-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-500 hover:to-green-500 active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />

              <div className="hidden flex-col text-left leading-none lg:flex">
                <span className="text-[10px] font-black uppercase tracking-wide">
                  My Cart
                </span>

                <span className="mt-1 text-[10px] font-bold text-emerald-100">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {totalCartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-lime-400 px-1 text-[10px] font-black text-slate-950">
                  {totalCartCount > 99 ? "99+" : totalCartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="rounded-xl border border-emerald-700/70 bg-emerald-950/70 p-2 text-emerald-100 transition hover:bg-emerald-900 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ================= DESKTOP SUB NAV ================= */}
      <div className="hidden border-b border-emerald-900/70 bg-emerald-950/95 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <nav className="flex min-w-0 items-center gap-1.5 overflow-x-auto no-scrollbar">
            {links.map(([label, to, Icon]) => (
              <NavLink
                key={`${label}-${to}`}
                to={to}
                end={label === "Dashboard" || label === "Marketplace"}
                className={({ isActive }) =>
                  `group flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/30"
                    : "text-slate-300 hover:bg-emerald-900/80 hover:text-emerald-300"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </NavLink>
            ))}

            {/* ResearchMind AI */}
            <a
              href={RESEARCHMIND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-gradient-to-r from-emerald-600 to-teal-500 px-3.5 py-2 text-xs font-black text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-500 hover:to-teal-400 active:scale-95"
            >
              <Bot className="h-4 w-4 text-emerald-100" />
              <span>Ask Kisan AI</span>
              <ExternalLink className="h-3 w-3 text-emerald-200 transition-transform group-hover:translate-x-0.5" />
            </a>
          </nav>

          {user && (
            <span className="shrink-0 rounded-full border border-emerald-700 bg-emerald-900/80 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-300">
              {role.replaceAll("_", " ")}
            </span>
          )}
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="border-b border-emerald-900/70 bg-slate-950 md:hidden">
          <div className="space-y-4 px-4 py-4 sm:px-6">

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search marketplace..."
                  className="h-10 w-full rounded-xl border border-emerald-800 bg-slate-900 px-10 text-xs text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            </form>

            {/* Mobile User */}
            {user ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-800 bg-emerald-950/50 p-3">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex min-w-0 items-center gap-3"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${displayName}'s avatar`}
                      className="h-9 w-9 rounded-full border border-emerald-400 object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-black text-slate-950">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {displayName}
                    </p>
                    <p className="text-[10px] font-bold uppercase text-emerald-400">
                      {role.replaceAll("_", " ")}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-900"
              >
                <UserCircle className="h-4 w-4 text-emerald-400" />
                Login / Register
              </Link>
            )}

            {/* Mobile Navigation */}
            <nav className="grid grid-cols-2 gap-2">
              {links.map(([label, to, Icon]) => (
                <NavLink
                  key={`${label}-${to}-mobile`}
                  to={to}
                  end={label === "Dashboard" || label === "Marketplace"}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition ${isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 text-slate-300 hover:bg-emerald-900 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-sm font-black text-white"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                My Cart
              </span>

              <span>
                {totalCartCount} items · ₹
                {subtotal.toLocaleString("en-IN")}
              </span>
            </Link>

            {/* Mobile AI Link */}
            <a
              href={RESEARCHMIND_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 text-xs font-black text-white transition hover:from-emerald-500 hover:to-teal-400"
            >
              <Bot className="h-4 w-4" />
              Ask Kisan AI
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Mobile Location */}
            <div className="flex items-center gap-2 border-t border-emerald-900/60 pt-3 text-xs text-slate-400">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Singur, Hooghly Hub</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
