
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-bold text-sm mb-2">AgriDirect Platform</h4>
          <p className="leading-relaxed">
            Direct farmer-to-buyer marketplace with AI grade classification, cold-chain monitoring, and VRP route optimization.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-2">Quick Access</h4>
          <ul className="space-y-1">
            <li><a href="/marketplace" className="hover:underline">Browse Crops</a></li>
            <li><a href="/fpo-dashboard" className="hover:underline">FPO Aggregation Portal</a></li>
            <li><a href="/logistics" className="hover:underline">Driver Route Tracking</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-sm mb-2">System Status</h4>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Real-time IoT Socket Stream Active
          </p>
          <p className="mt-2">© {new Date().getFullYear()} AgriDirect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
