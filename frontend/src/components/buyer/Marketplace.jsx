import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import API from '../../services/api';
import { CartContext } from '../../context/CartContext';
import ProduceCard from './ProduceCard';

const categories = ['All', 'VEGETABLE', 'FRUIT', 'GRAIN', 'PULSE', 'OILSEED'];
const grades = ['All', 'Grade A', 'Grade B', 'Grade C'];

const Marketplace = () => {
  const { addToCart } = useContext(CartContext);
  const [produces, setProduces] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    maxPrice: '',
    distance: '',
    grade: 'All',
    seller: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMarketplaceProduce = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.search.trim()) params.search = filters.search.trim();
      const { data } = await API.get('/produce', { params });
      setProduces(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load marketplace listings from the database.');
      setProduces([]);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.search]);

  useEffect(() => {
    fetchMarketplaceProduce();
  }, [fetchMarketplaceProduce]);

  const visibleProduces = useMemo(() => {
    return produces.filter((item) => {
      const price = Number(item.expectedPricePerKg || 0);
      const maxPriceOk = !filters.maxPrice || price <= Number(filters.maxPrice);
      const gradeOk = filters.grade === 'All' || item.grade === filters.grade || item.qualityGrade === filters.grade;
      const sellerText = `${item.farmerId?.name || ''} ${item.pickupLocation?.farmAddress || ''}`.toLowerCase();
      const sellerOk = !filters.seller || sellerText.includes(filters.seller.toLowerCase());
      return maxPriceOk && gradeOk && sellerOk;
    });
  }, [filters.grade, filters.maxPrice, filters.seller, produces]);

  const updateFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Buyer Marketplace</p>
          <h1 className="text-2xl font-black text-slate-950">Browse Direct Farm Produce</h1>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-emerald-700" />
            Filters
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search crop" className="h-10 rounded-md border border-slate-300 px-3 text-sm lg:col-span-2" />
            <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} type="number" min="0" placeholder="Max price/kg" className="h-10 rounded-md border border-slate-300 px-3 text-sm" />
            <input value={filters.distance} onChange={(e) => updateFilter('distance', e.target.value)} type="number" min="0" placeholder="Distance km" className="h-10 rounded-md border border-slate-300 px-3 text-sm" />
            <select value={filters.grade} onChange={(e) => updateFilter('grade', e.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm">
              {grades.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={filters.seller} onChange={(e) => updateFilter('seller', e.target.value)} placeholder="FPO / Farmer" className="h-10 rounded-md border border-slate-300 px-3 text-sm lg:col-span-2" />
          </div>
        </div>

        {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading marketplace listings from database...</div>
        ) : visibleProduces.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProduces.map((item) => (
              <ProduceCard key={item._id || item.id} produce={item} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No produce listings found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
