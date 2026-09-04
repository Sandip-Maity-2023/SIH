import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

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
  const navigate = useNavigate();
  const role = String(user?.role || '').toUpperCase();
  const links = user ? roleLinks[role] || roleLinks.FARMER : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-900 bg-emerald-950 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-normal">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-emerald-950">
                K
              </span>
              KRISHI
            </Link>
            {user && (
              <span className="rounded-md bg-emerald-900 px-3 py-1.5 text-xs font-black lg:hidden">
                {role || 'USER'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            {links.map(([label, to]) => (
              <NavLink
                key={`${label}-${to}`}
                to={to}
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-1.5 transition ${
                    isActive ? 'bg-emerald-800 text-white' : 'text-emerald-50 hover:bg-emerald-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-90 transition">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-7 w-7 rounded-full object-cover border border-emerald-400" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-emerald-500 text-emerald-950 text-xs font-black flex items-center justify-center border border-emerald-400">
                      {(user.name || user.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden font-semibold sm:inline">{user.name || user.fullName}</span>
                </Link>
                <span className="hidden rounded-md bg-emerald-900 px-2.5 py-1 text-[10px] font-black lg:inline-flex">
                  {role || 'USER'}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-bold transition hover:bg-emerald-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md px-3 py-1.5 transition hover:bg-emerald-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-emerald-500 px-3 py-1.5 font-bold text-emerald-950 transition hover:bg-emerald-400"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
