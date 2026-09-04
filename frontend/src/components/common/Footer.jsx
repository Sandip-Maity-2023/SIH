import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Zap, Award, Phone, Mail, MapPin } from 'lucide-react';
import { GiFruitBowl, GiTomato, GiMilkCarton } from 'react-icons/gi';
import { MdBakeryDining } from 'react-icons/md';
import { FaShoppingCart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-emerald-900/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Trust Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-emerald-950/60 border border-emerald-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#0C831F] text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">15-Min Farm Dispatch</h4>
              <p className="text-[11px] text-slate-400">Direct mandi to door delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#1DB954] text-slate-950">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">DoCA Escrow Protected</h4>
              <p className="text-[11px] text-slate-400">100% Guaranteed farmer payout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-700 text-white">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">AI Grade Inspection</h4>
              <p className="text-[11px] text-slate-400">Verified Quality A/B/C lots</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#0C831F] text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">Cold-Chain Fleet</h4>
              <p className="text-[11px] text-slate-400">Real-time GPS IoT tracking</p>
            </div>
          </div>
        </div>

        {/* Middle Navigation & Category Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-900 pb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1DB954] text-slate-950 font-black text-xl">
                K
              </span>
              <span className="text-xl font-black text-white">
                KRISHI <span className="text-[#1DB954]">AGRI</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-xs">
              India's premier digital agriculture marketplace connecting farmers, FPOs, bulk buyers, and cold-chain drivers directly.
            </p>
            <div className="flex items-center gap-3 text-lg text-slate-400">
              <a href="#" className="hover:text-[#1DB954] transition"><FaFacebook /></a>
              <a href="#" className="hover:text-[#1DB954] transition"><FaTwitter /></a>
              <a href="#" className="hover:text-[#1DB954] transition"><FaInstagram /></a>
              <a href="#" className="hover:text-[#1DB954] transition"><FaLinkedin /></a>
            </div>
          </div>

          {/* Sourced Categories with React-Icons */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Agri Categories
            </h4>
            <ul className="space-y-2.5 font-semibold text-slate-400 text-xs">
              <li className="flex items-center gap-2 hover:text-[#1DB954] transition cursor-pointer">
                <GiTomato className="text-emerald-500" /> Fresh Vegetables
              </li>
              <li className="flex items-center gap-2 hover:text-[#1DB954] transition cursor-pointer">
                <GiFruitBowl className="text-emerald-500" /> Farm Fresh Fruits
              </li>
              <li className="flex items-center gap-2 hover:text-[#1DB954] transition cursor-pointer">
                <MdBakeryDining className="text-emerald-500" /> Grains & Cereals
              </li>
              <li className="flex items-center gap-2 hover:text-[#1DB954] transition cursor-pointer">
                <GiMilkCarton className="text-emerald-500" /> Dairy & Allied Produce
              </li>
              <li className="flex items-center gap-2 hover:text-[#1DB954] transition cursor-pointer">
                <FaShoppingCart className="text-emerald-500" /> Bulk Mandi Lots
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Platform Portals
            </h4>
            <ul className="space-y-2.5 font-semibold text-slate-400 text-xs">
              <li><Link to="/marketplace" className="hover:text-[#1DB954] transition">Buyer Marketplace</Link></li>
              <li><Link to="/fpo-dashboard" className="hover:text-[#1DB954] transition">FPO Aggregation Portal</Link></li>
              <li><Link to="/logistics" className="hover:text-[#1DB954] transition">Driver Trip Tracking</Link></li>
              <li><Link to="/payouts" className="hover:text-[#1DB954] transition">Farmer Escrow Payouts</Link></li>
              <li><Link to="/schedule" className="hover:text-[#1DB954] transition">Dispatch Route Scheduler</Link></li>
            </ul>
          </div>

          {/* Direct Support & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4 border-b border-emerald-900 pb-2">
              Support & Mandi Hub
            </h4>
            <p className="flex items-center gap-2 text-slate-400">
              <MapPin className="h-4 w-4 text-[#1DB954] shrink-0" />
              Singur Agri Hub, Hooghly, West Bengal
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <Phone className="h-4 w-4 text-[#1DB954] shrink-0" />
              Toll Free: 1800-123-KRISHI
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4 text-[#1DB954] shrink-0" />
              support@krishi-agri.org
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-pulse"></span>
                IoT Server Live & Monitored
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs pt-2">
          <p>© {new Date().getFullYear()} KRISHI AGRI Platform. All rights reserved. Seedhe Kisan Se, Seedhe Ghar Tak.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">DoCA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
