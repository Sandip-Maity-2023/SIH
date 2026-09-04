import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SlidersHorizontal, Truck, PlusCircle, CheckCircle2, MapPin, Zap } from 'lucide-react';
import { FcSearch } from 'react-icons/fc';
import {
  BiDevices, BiLaptop, BiSmile, BiHomeAlt, BiGridAlt
} from 'react-icons/bi';
import { GiFruitBowl, GiClothes, GiMilkCarton, GiTomato } from 'react-icons/gi';
import { FaShoppingCart } from 'react-icons/fa';
import { MdBakeryDining } from 'react-icons/md';

import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import ProduceCard from './ProduceCard';

const initialDriverOffers = [
  {
    id: 'drv-1',
    driverName: 'Ramesh Kumar (Logistics Partner)',
    vehicleType: '10 Ton Refrigerated Cold Truck',
    route: 'Nashik Mandi ➔ Mumbai Central Distribution',
    capacity: '8.5 Tons Available',
    ratePerKm: '₹42 / km',
    availableTime: 'Daily at 06:00 AM',
    contact: '+91 98765 43210',
  },
  {
    id: 'drv-2',
    driverName: 'Suresh Das (Hooghly Express)',
    vehicleType: '5 Ton Covered Container Truck',
    route: 'Singur Farm Cluster ➔ Kolkata Wholesale Market',
    capacity: '4.0 Tons Available',
    ratePerKm: '₹32 / km',
    availableTime: 'Mon, Wed, Fri at 07:30 AM',
    contact: '+91 98123 45678',
  },
  {
    id: 'drv-3',
    driverName: 'Vikram Singh (Agri Transports)',
    vehicleType: '2 Ton Open Pickup Truck',
    route: 'Sonipat Mandi ➔ Azadpur Mandi Delhi',
    capacity: '1.8 Tons Available',
    ratePerKm: '₹25 / km',
    availableTime: 'Everyday 05:00 AM',
    contact: '+91 97112 23344',
  },
];

const Marketplace = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const isDriver = ['DRIVER', 'LOGISTICS', 'LOGISTICS_PARTNER'].includes(String(user?.role || '').toUpperCase());

  const [activeView, setActiveView] = useState('produce'); // 'produce' | 'drivers'
  const [produces, setProduces] = useState([]);
  const [driverOffers, setDriverOffers] = useState(initialDriverOffers);

  const [search, setSearch] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const categoryRefs = useRef({});

  const [filters, setFilters] = useState({
    maxPrice: '',
    distance: '',
    grade: 'All',
    seller: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  // Driver posting form
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [newOffer, setNewOffer] = useState({
    vehicleType: '10 Ton Refrigerated Cold Truck',
    route: '',
    capacity: '',
    ratePerKm: '',
    availableTime: '',
  });

  const fetchMarketplaceProduce = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get('/produce');
      setProduces(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load marketplace listings from database.');
      setProduces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceProduce();
  }, [fetchMarketplaceProduce]);

  // Stable Categories logic
  const allCategories = useMemo(() => {
    if (produces.length === 0) return ['VEGETABLE', 'FRUIT', 'GRAIN', 'PULSE', 'OILSEED'];
    const cats = produces.map((p) => p.category || 'VEGETABLE');
    return [...new Set(cats)];
  }, [produces]);

  // Filtered & Grouped Products logic
  const visibleProduces = useMemo(() => {
    return produces.filter((item) => {
      const nameMatch = (item.cropName || item.name || '').toLowerCase().includes(search.toLowerCase());
      const catMatch = (item.category || '').toLowerCase().includes(search.toLowerCase());
      const price = Number(item.expectedPricePerKg || 0);
      const maxPriceOk = !filters.maxPrice || price <= Number(filters.maxPrice);
      const gradeOk = filters.grade === 'All' || item.grade === filters.grade || item.qualityGrade === filters.grade;
      const sellerText = `${item.farmerId?.name || ''} ${item.pickupLocation?.farmAddress || ''}`.toLowerCase();
      const sellerOk = !filters.seller || sellerText.includes(filters.seller.toLowerCase());
      
      return (nameMatch || catMatch) && maxPriceOk && gradeOk && sellerOk;
    });
  }, [produces, search, filters.maxPrice, filters.grade, filters.seller]);

  const groupedProducts = useMemo(() => {
    return visibleProduces.reduce((acc, product) => {
      const category = product.category || 'Other / Fresh Produce';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }, [visibleProduces]);

  // Fix layout shaking on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCategoryIcon = (category) => {
    const name = (category || '').toLowerCase();
    if (name.includes('elect') || name.includes('gadget')) return <BiDevices />;
    if (name.includes('fashion') || name.includes('cloth') || name.includes('apparel')) return <GiClothes />;
    if (name.includes('laptop') || name.includes('tech')) return <BiLaptop />;
    if (name.includes('beauty') || name.includes('toy')) return <BiSmile />;
    if (name.includes('home') || name.includes('furniture')) return <BiHomeAlt />;
    if (name.includes('fruit') || name.includes('food')) return <GiFruitBowl />;
    if (name.includes('cart') || name.includes('grocery')) return <FaShoppingCart />;
    if (name.includes('bakery') || name.includes('bread')) return <MdBakeryDining />;
    if (name.includes('milk') || name.includes('dairy')) return <GiMilkCarton />;
    if (name.includes('vegetable') || name.includes('tomato') || name.includes('veg')) return <GiTomato />;

    return <BiGridAlt />;
  };

  const scrollToCategory = (categoryName) => {
    if (!groupedProducts[categoryName]) {
      setSearch('');
    }
    
    setTimeout(() => {
      const targetElement = categoryRefs.current[categoryName];
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 50);
  };

  const updateFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

  const handlePostDriverOffer = (e) => {
    e.preventDefault();
    if (!newOffer.route || !newOffer.ratePerKm) return;

    const offerObj = {
      id: `drv-${Date.now()}`,
      driverName: user?.name || user?.fullName || 'Driver Partner',
      vehicleType: newOffer.vehicleType,
      route: newOffer.route,
      capacity: newOffer.capacity || '3 Tons Available',
      ratePerKm: `₹${newOffer.ratePerKm} / km`,
      availableTime: newOffer.availableTime || 'Immediate Dispatch',
      contact: user?.phone || user?.phoneNumber || '+91 Direct Phone',
    };

    setDriverOffers((prev) => [offerObj, ...prev]);
    setShowDriverForm(false);
    setNewOffer({
      vehicleType: '10 Ton Refrigerated Cold Truck',
      route: '',
      capacity: '',
      ratePerKm: '',
      availableTime: '',
    });
    setBookingMessage('Your freight transport offer has been posted to the marketplace!');
    setTimeout(() => setBookingMessage(''), 5000);
  };

  const handleBookDriver = (driver) => {
    setBookingMessage(`Booking request sent to driver ${driver.driverName}! Contact: ${driver.contact}`);
    setTimeout(() => setBookingMessage(''), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2.5 sm:p-4 lg:p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        
        {/* Farm Direct Promise Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-800/40">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-widest">
              <Zap className="h-4 w-4 fill-emerald-400 text-emerald-400" /> Direct Farm Dispatch
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">Buy Fresh Produce Direct From Verified Farmers</h1>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium max-w-2xl">
              100% AI Quality Inspected • Direct Mandi Escrow • Cold-Chain Logistics Express
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveView('produce')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeView === 'produce' ? 'bg-[#1DB954] text-slate-950 shadow-md' : 'bg-emerald-900/60 text-white hover:bg-emerald-800'
              }`}
            >
              🌱 Farm Produce
            </button>
            <button
              type="button"
              onClick={() => setActiveView('drivers')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeView === 'drivers' ? 'bg-[#1DB954] text-slate-950 shadow-md' : 'bg-emerald-900/60 text-white hover:bg-emerald-800'
              }`}
            >
              <Truck className="h-4 w-4" />
              🚛 Freight Offers ({driverOffers.length})
            </button>
          </div>
        </div>

        {bookingMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs font-black text-emerald-900 shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
            {bookingMessage}
          </div>
        )}

        {activeView === 'produce' ? (
          <>
            {/* Sticky Search & Category Bar Controls Wrapper */}
            <div className={`sticky top-16 z-30 transition-all duration-300 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 p-3 shadow-md ${isCollapsed ? 'py-2 shadow-lg' : ''}`}>
              
              {/* Search Bar Container */}
              <div className="relative mb-2.5">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FcSearch className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by crop name, category, or farm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>

              {/* ALWAYS VISIBLE CATEGORY BAR */}
              {!loading && allCategories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  {allCategories.map((categoryName) => (
                    <button
                      key={categoryName}
                      type="button"
                      onClick={() => scrollToCategory(categoryName)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 text-xs font-black transition shrink-0 border border-slate-200 group"
                    >
                      <div className="text-base text-emerald-700 group-hover:scale-110 transition-transform">
                        {getCategoryIcon(categoryName)}
                      </div>
                      <span className="whitespace-nowrap">{categoryName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refine Filters Drawer */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
                Refine Price & Quality Filters
              </div>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                <input value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} type="number" min="0" placeholder="Max price ₹/kg" className="h-9 rounded-lg border border-slate-300 px-3 text-xs" />
                <input value={filters.distance} onChange={(e) => updateFilter('distance', e.target.value)} type="number" min="0" placeholder="Distance km" className="h-9 rounded-lg border border-slate-300 px-3 text-xs" />
                <select value={filters.grade} onChange={(e) => updateFilter('grade', e.target.value)} className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold">
                  <option value="All">All Quality Grades</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Grade C">Grade C</option>
                </select>
                <input value={filters.seller} onChange={(e) => updateFilter('seller', e.target.value)} placeholder="Farmer / FPO location..." className="h-9 rounded-lg border border-slate-300 px-3 text-xs" />
              </div>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">{error}</div>}

            {/* Content Section: Grouped Product Categories with Refs & Smooth Scroll */}
            <div className="space-y-8 pt-2">
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                  <p className="text-xs font-bold text-slate-500">Sourcing fresh produce items from verified farm sellers...</p>
                </div>
              ) : Object.keys(groupedProducts).length > 0 ? (
                Object.entries(groupedProducts).map(([categoryName, items]) => (
                  <div
                    key={categoryName}
                    ref={(el) => (categoryRefs.current[categoryName] = el)}
                    className="scroll-mt-40 space-y-3"
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-lg">
                          {getCategoryIcon(categoryName)}
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{categoryName}</h2>
                          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            {items.length} {items.length === 1 ? 'item' : 'items'} available
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearch(categoryName)}
                        className="text-xs font-black text-emerald-800 hover:text-emerald-900 transition flex items-center gap-1 hover:underline"
                      >
                        View All →
                      </button>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {items.map((product) => (
                        <ProduceCard key={product._id || product.id} produce={product} onAddToCart={addToCart} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
                  <div className="text-4xl">📦</div>
                  <h3 className="text-sm font-black text-slate-800">No produce listings found</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                    We couldn't find anything matching "{search}". Try searching for another crop name or clear search.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearch(''); updateFilter('grade', 'All'); updateFilter('maxPrice', ''); }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
                  >
                    Clear All Search Filters
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Driver Commute & Freight Offers View */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-emerald-700" /> Freight Transport & Logistics Offers
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Drivers can offer commuting routes & logistics slots for buyers to book instantly.
                  </p>
                </div>

                {isDriver && (
                  <button
                    type="button"
                    onClick={() => setShowDriverForm(!showDriverForm)}
                    className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-black text-xs hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {showDriverForm ? 'Cancel Offer Form' : 'Post Logistics Transport Offer'}
                  </button>
                )}
              </div>

              {showDriverForm && (
                <form onSubmit={handlePostDriverOffer} className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Vehicle Type</label>
                      <select
                        value={newOffer.vehicleType}
                        onChange={(e) => setNewOffer((prev) => ({ ...prev, vehicleType: e.target.value }))}
                        className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold"
                      >
                        <option value="10 Ton Refrigerated Cold Truck">10 Ton Refrigerated Cold Truck</option>
                        <option value="5 Ton Covered Container Truck">5 Ton Covered Container Truck</option>
                        <option value="2 Ton Open Pickup Truck">2 Ton Open Pickup Truck</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Commute Route (Origin ➔ Destination)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Singur Farm Cluster ➔ Kolkata Wholesale Mandi"
                        value={newOffer.route}
                        onChange={(e) => setNewOffer((prev) => ({ ...prev, route: e.target.value }))}
                        className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Rate / km (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 35"
                        value={newOffer.ratePerKm}
                        onChange={(e) => setNewOffer((prev) => ({ ...prev, ratePerKm: e.target.value }))}
                        className="mt-1 h-9 w-full rounded-lg border border-slate-300 px-3 text-xs"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-800 text-xs font-black text-white hover:bg-emerald-900 transition shadow-sm">
                    Publish Transport Offer
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {driverOffers.map((offer) => (
                  <div key={offer.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 hover:border-emerald-500 transition">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px]">
                        {offer.vehicleType}
                      </span>
                      <span className="text-xs font-black text-emerald-700">{offer.ratePerKm}</span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm">{offer.driverName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {offer.route}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBookDriver(offer)}
                      className="w-full py-2 rounded-xl bg-emerald-800 text-xs font-black text-white hover:bg-emerald-900 transition shadow-sm"
                    >
                      Book Driver / Request Freight
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

