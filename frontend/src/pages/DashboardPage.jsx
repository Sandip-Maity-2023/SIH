import React, { useState } from 'react';
import { 
  Sprout, 
  Package, 
  Wallet, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  UserCheck
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [role, setRole] = useState('farmer'); // Roles: 'farmer', 'buyer', 'logistics'

  // Farmer metrics mock data
  const farmerStats = [
    { label: "Total Yield Listed", value: "1,240 kg", change: "+12% this month", icon: <Sprout className="w-5 h-5 text-emerald-600" /> },
    { label: "Active Orders", value: "18 Orders", change: "4 pending dispatch", icon: <Package className="w-5 h-5 text-emerald-600" /> },
    { label: "Earnings Settled", value: "₹84,200", change: "Direct to Bank", icon: <Wallet className="w-5 h-5 text-emerald-600" /> },
    { label: "KYC Status", value: "Verified", change: "ID: KR-GJAND20260001", icon: <UserCheck className="w-5 h-5 text-emerald-600" /> }
  ];

  // Listed items mock data
  const produceListings = [
    { id: "PROD-101", name: "Organic Desi Tomatoes", category: "Vegetables", price: "₹28 / kg", quantity: "450 kg", status: "Approved", date: "Sep 01, 2026" },
    { id: "PROD-102", name: "Sharbati Wheat Grain", category: "Grains", price: "₹34 / kg", quantity: "1,200 kg", status: "Approved", date: "Aug 28, 2026" },
    { id: "PROD-103", name: "Fresh Alphonso Mangoes", category: "Fruits", price: "₹180 / kg", quantity: "80 kg", status: "Pending Verification", date: "Sep 03, 2026" }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      {/* Top Bar Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">KRISHI Dashboard</h1>
              <p className="text-xs text-slate-500 mt-1">Role: Farmer / FPO Management Portal</p>
            </div>
          </div>

          {/* Role switcher simulation */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button 
              onClick={() => setRole('farmer')} 
              className={`px-3 py-1.5 rounded-md transition-all ${role === 'farmer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
            >
              Farmer View
            </button>
            <button 
              onClick={() => setRole('buyer')} 
              className={`px-3 py-1.5 rounded-md transition-all ${role === 'buyer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
            >
              Buyer View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {farmerStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</span>
                <div className="p-2 bg-emerald-50 rounded-lg">{stat.icon}</div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'inventory' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                My Crop Inventory
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                Fulfillment Orders
              </button>
            </div>

            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <PlusCircle className="w-4 h-4" /> Add New Produce Batch
            </button>
          </div>

          {/* Search & Filter Bar inside Dashboard */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search crop batches..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <Filter className="w-3.5 h-3.5" /> Filter Status
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Batch ID</th>
                  <th className="py-3.5 px-6">Produce Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Direct Price</th>
                  <th className="py-3.5 px-6">Available Qty</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Date Listed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produceListings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800">{item.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{item.name}</td>
                    <td className="py-4 px-6">{item.category}</td>
                    <td className="py-4 px-6 font-bold text-emerald-700">{item.price}</td>
                    <td className="py-4 px-6 font-medium">{item.quantity}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Approved' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status === 'Approved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
