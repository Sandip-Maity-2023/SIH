import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart3, Eye, LayoutGrid, List, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import AddProduceModal from './AddProduceModal';

const statusOptions = ['ALL', 'AVAILABLE', 'POOLED', 'LOCKED_IN_ORDER', 'SOLD', 'CANCELLED'];

const FarmerDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduce, setEditingProduce] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');

  const fetchProduces = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const { data } = await API.get('/produce', { params });
      setProduces(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load produce listings from database.');
      setProduces([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchProduces();
  }, [fetchProduces]);

  const stats = useMemo(() => {
    const activeListings = produces.filter((item) => item.status === 'AVAILABLE').length;
    const totalQuantity = produces.reduce((sum, item) => sum + Number(item.quantityKg || 0), 0);
    const avgPrice = produces.length
      ? produces.reduce((sum, item) => sum + Number(item.expectedPricePerKg || 0), 0) / produces.length
      : 0;
    const bids = produces.reduce((sum, item) => sum + (item.bids?.length || 0), 0);
    return { activeListings, totalQuantity, avgPrice, bids };
  }, [produces]);

  const handleSaved = () => {
    setShowForm(false);
    setEditingProduce(null);
    fetchProduces();
  };

  const handleEdit = (produce) => {
    setEditingProduce(produce);
    setShowForm(true);
  };

  const handleDelete = async (produce) => {
    const confirmed = window.confirm(`Delete ${produce.cropName}?`);
    if (!confirmed) return;

    try {
      await API.delete(`/produce/${produce._id}`);
      fetchProduces();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete listing.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Farmer / FPO Dashboard
            </p>
            <h1 className="text-2xl font-black text-slate-950">My Produce</h1>
            <p className="text-sm text-slate-500">
              Listings are loaded from the database through the backend produce API.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduce(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-black text-white"
          >
            <Plus className="h-4 w-4" />
            Add Produce Listing
          </button>
        </div>

        <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          {[
            ['My Produce', '/dashboard'],
            ['Orders', '/orders'],
            ['Payouts', '/payouts'],
            ['Schedule', '/schedule'],
            ['Reports', '/reports'],
          ].map(([label, to]) => (
            <Link key={label} to={to} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-black text-slate-700 hover:border-emerald-600 hover:text-emerald-800">
              {label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active Listings" value={stats.activeListings} icon={<List />} />
          <Stat label="Quantity Listed" value={`${stats.totalQuantity.toLocaleString()} kg`} icon={<LayoutGrid />} />
          <Stat label="Avg. Price" value={`Rs ${stats.avgPrice.toFixed(2)}/kg`} icon={<BarChart3 />} />
          <Stat label="Buyer Interest" value={stats.bids} icon={<Wallet />} />
        </div>

        {showForm && (
          <AddProduceModal
            initialProduce={editingProduce}
            onSaved={handleSaved}
            onCancel={() => {
              setShowForm(false);
              setEditingProduce(null);
            }}
          />
        )}

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search crop name"
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm sm:max-w-xs"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-bold"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('table')}
                className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold ${view === 'table' ? 'border-emerald-700 bg-emerald-50 text-emerald-800' : 'border-slate-300 text-slate-600'}`}
              >
                <List className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setView('cards')}
                className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-bold ${view === 'cards' ? 'border-emerald-700 bg-emerald-50 text-emerald-800' : 'border-slate-300 text-slate-600'}`}
              >
                <LayoutGrid className="h-4 w-4" />
                Cards
              </button>
            </div>
          </div>

          {error && <div className="border-b border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading produce from database...</div>
          ) : produces.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No produce listings found in the database for the selected filters.
            </div>
          ) : view === 'cards' ? (
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {produces.map((item) => (
                <ProduceCard key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    {['Crop', 'Category', 'Qty Listed', 'Price/Unit', 'Buyer Interest', 'Status', 'Harvest Date', 'Actions'].map((head) => (
                      <th key={head} className="px-4 py-3">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {produces.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-black text-slate-950">{item.cropName}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{Number(item.quantityKg || 0).toLocaleString()} kg</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">Rs {item.expectedPricePerKg}/kg</td>
                      <td className="px-4 py-3">{item.bids?.length || 0}</td>
                      <td className="px-4 py-3"><Status value={item.status} /></td>
                      <td className="px-4 py-3">{item.harvestDate ? new Date(item.harvestDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <IconButton label="View" onClick={() => window.alert(JSON.stringify(item, null, 2))} icon={<Eye />} />
                          <IconButton label="Edit" onClick={() => handleEdit(item)} icon={<Pencil />} />
                          <IconButton label="Delete" onClick={() => handleDelete(item)} icon={<Trash2 />} danger />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, icon }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <span className="text-emerald-700 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
    </div>
    <p className="text-2xl font-black text-slate-950">{value}</p>
  </div>
);

const Status = ({ value }) => (
  <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
    {value || 'AVAILABLE'}
  </span>
);

const IconButton = ({ label, icon, onClick, danger = false }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    className={`rounded-md border p-2 ${danger ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} [&>svg]:h-4 [&>svg]:w-4`}
  >
    {icon}
  </button>
);

const ProduceCard = ({ item, onEdit, onDelete }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-black text-slate-950">{item.cropName}</h3>
        <p className="text-sm text-slate-500">{item.category}</p>
      </div>
      <Status value={item.status} />
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <p><span className="block text-xs font-bold uppercase text-slate-500">Quantity</span>{Number(item.quantityKg || 0).toLocaleString()} kg</p>
      <p><span className="block text-xs font-bold uppercase text-slate-500">Price</span>Rs {item.expectedPricePerKg}/kg</p>
      <p><span className="block text-xs font-bold uppercase text-slate-500">Buyer Interest</span>{item.bids?.length || 0}</p>
      <p><span className="block text-xs font-bold uppercase text-slate-500">Harvest</span>{item.harvestDate ? new Date(item.harvestDate).toLocaleDateString() : '-'}</p>
    </div>
    <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
      <IconButton label="Edit" onClick={() => onEdit(item)} icon={<Pencil />} />
      <IconButton label="Delete" onClick={() => onDelete(item)} icon={<Trash2 />} danger />
    </div>
  </div>
);

export default FarmerDashboard;
