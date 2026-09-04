import React, { useState } from 'react';
import API from '../../services/api';

const categories = [
  ['VEGETABLE', 'Vegetable'],
  ['FRUIT', 'Fruit'],
  ['GRAIN', 'Grain'],
  ['PULSE', 'Pulse'],
  ['OILSEED', 'Oilseed'],
];

const AddProduceModal = ({ initialProduce, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    cropName: initialProduce?.cropName || '',
    category: initialProduce?.category || 'VEGETABLE',
    quantityKg: initialProduce?.quantityKg || '',
    expectedPricePerKg: initialProduce?.expectedPricePerKg || '',
    variety: initialProduce?.variety || '',
    grade: initialProduce?.aiQualityGrade?.grade || 'PENDING',
    imageUrl: initialProduce?.images?.[0] || '',
    suggestedMin: initialProduce?.suggestedMin || '',
    suggestedMax: initialProduce?.suggestedMax || '',
    logisticsNotes: initialProduce?.logisticsNotes || '',
    harvestDate: initialProduce?.harvestDate ? initialProduce.harvestDate.slice(0, 10) : '',
    farmAddress: initialProduce?.pickupLocation?.farmAddress || '',
    longitude: initialProduce?.pickupLocation?.coordinates?.[0] || '',
    latitude: initialProduce?.pickupLocation?.coordinates?.[1] || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    cropName: formData.cropName.trim(),
    category: formData.category,
    quantityKg: Number(formData.quantityKg),
    expectedPricePerKg: Number(formData.expectedPricePerKg),
    harvestDate: formData.harvestDate,
    images: formData.imageUrl ? [formData.imageUrl.trim()] : [],
    aiQualityGrade: {
      grade: formData.grade,
      evaluatedAt: formData.grade === 'PENDING' ? undefined : new Date(),
    },
    pickupLocation: {
      type: 'Point',
      coordinates: [Number(formData.longitude), Number(formData.latitude)],
      farmAddress: formData.farmAddress.trim(),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.cropName || !formData.quantityKg || !formData.expectedPricePerKg || !formData.harvestDate) {
      setError('Crop name, quantity, price, and harvest date are required.');
      return;
    }

    if (formData.longitude === '' || formData.latitude === '') {
      setError('Pickup longitude and latitude are required for logistics planning.');
      return;
    }

    try {
      setSaving(true);
      const request = initialProduce?._id
        ? API.put(`/produce/${initialProduce._id}`, buildPayload())
        : API.post('/produce', buildPayload());
      const { data } = await request;
      onSaved?.(data.data || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save produce listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Add Produce Listing
          </p>
          <h2 className="text-xl font-black text-slate-950">
            {initialProduce ? 'Edit Produce Listing' : 'Product Creation Flow'}
          </h2>
        </div>
        <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-600">
          Close
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Crop Name</span>
            <input name="cropName" value={formData.cropName} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Variety</span>
            <input name="variety" value={formData.variety} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="Lokwan, Hybrid, Basmati" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Product Type / Category</span>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              {categories.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Quantity Available (KG)</span>
            <input name="quantityKg" type="number" min="1" value={formData.quantityKg} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Price per KG</span>
            <input name="expectedPricePerKg" type="number" min="1" value={formData.expectedPricePerKg} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Harvest Date</span>
            <input name="harvestDate" type="date" value={formData.harvestDate} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Grade</span>
            <select name="grade" value={formData.grade} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              {['PENDING', 'A', 'B', 'C', 'REJECTED'].map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">AI Suggested Min</span>
            <input name="suggestedMin" type="number" min="0" value={formData.suggestedMin} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">AI Suggested Max</span>
            <input name="suggestedMax" type="number" min="0" value={formData.suggestedMax} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Produce Image URL</span>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="md:col-span-1">
            <span className="text-xs font-bold uppercase text-slate-600">Pickup Location</span>
            <input name="farmAddress" value={formData.farmAddress} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="Village, District, State" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Longitude</span>
            <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Latitude</span>
            <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
        </div>

        <label>
          <span className="text-xs font-bold uppercase text-slate-600">Harvest & Logistics Notes</span>
          <textarea name="logisticsNotes" rows="3" value={formData.logisticsNotes} onChange={handleChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Packing, pickup slot, cold chain, route grouping notes" />
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">
            Save Draft
          </button>
          <button disabled={saving} className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-black text-white disabled:opacity-60">
            {saving ? 'Saving...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduceModal;
