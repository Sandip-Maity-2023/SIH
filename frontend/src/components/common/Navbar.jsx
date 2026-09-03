

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-wide">
            <span className="bg-emerald-500 text-emerald-950 p-1.5 rounded-lg text-sm">🌾</span>
            AgriDirect
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/marketplace" className="hover:text-emerald-300 transition">Marketplace</Link>
            <Link to="/fpo-dashboard" className="hover:text-emerald-300 transition">FPO Pooling</Link>
            <Link to="/logistics" className="hover:text-emerald-300 transition">Logistics Tracking</Link>
          </div>

          {/* User Profile / Auth State */}
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline bg-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {user.role?.toUpperCase() || 'USER'}
                </span>
                <span className="font-semibold">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
