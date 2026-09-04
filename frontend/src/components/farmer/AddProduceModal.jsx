import React, { useState } from 'react';
import API, { uploadFile } from '../../services/api';
import { compressImage } from '../../utils/imageCompressor';

const categories = [
  ['VEGETABLE', 'Vegetable'],
  ['FRUIT', 'Fruit'],
  ['GRAIN', 'Grain'],
  ['PULSE', 'Pulse'],
  ['OILSEED', 'Oilseed'],
];

const AddProduceModal = ({ initialProduce, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    cropName: initialProduce?.cropName || initialProduce?.title || '',
    category: initialProduce?.category || initialProduce?.cropCategory || 'VEGETABLE',
    quantityKg: initialProduce?.quantityKg || '',
    expectedPricePerKg: initialProduce?.expectedPricePerKg || initialProduce?.pricePerKg || '',
    variety: initialProduce?.variety || '',
    grade: typeof initialProduce?.aiQualityGrade === 'string' ? initialProduce.aiQualityGrade : initialProduce?.aiQualityGrade?.grade || 'A_PREMIUM',
    imageUrl: initialProduce?.images?.[0] || '',
    suggestedMin: initialProduce?.suggestedMin || '',
    suggestedMax: initialProduce?.suggestedMax || '',
    logisticsNotes: initialProduce?.logisticsNotes || '',
    harvestDate: initialProduce?.harvestDate ? initialProduce.harvestDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    farmAddress: initialProduce?.pickupLocation?.farmAddress || 'Singur Farm Hub, Hooghly, West Bengal',
    longitude: initialProduce?.pickupLocation?.coordinates?.[0] || 88.2325,
    latitude: initialProduce?.pickupLocation?.coordinates?.[1] || 22.8122,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      } catch {
        const compressedUrl = await compressImage(file);
        setFormData((prev) => ({ ...prev, imageUrl: compressedUrl }));
      }
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: Number(pos.coords.latitude.toFixed(4)),
            longitude: Number(pos.coords.longitude.toFixed(4)),
          }));
        },
        () => {
          setError('Unable to fetch live GPS. Using region coordinates.');
        }
      );
    }
  };

  const handlePresetLocation = (e) => {
    const val = e.target.value;
    if (val === 'nashik') {
      setFormData((prev) => ({ ...prev, farmAddress: 'Nashik Mandi Farm Gate, Maharashtra', latitude: 20.0063, longitude: 73.7898 }));
    } else if (val === 'singur') {
      setFormData((prev) => ({ ...prev, farmAddress: 'Singur Crop Collective, Hooghly, WB', latitude: 22.8122, longitude: 88.2325 }));
    } else if (val === 'ratnagiri') {
      setFormData((prev) => ({ ...prev, farmAddress: 'Ratnagiri Orchard Gate, Maharashtra', latitude: 16.9902, longitude: 73.3120 }));
    }
  };

  const buildPayload = () => ({
    cropName: formData.cropName.trim(),
    category: formData.category,
    quantityKg: Number(formData.quantityKg),
    expectedPricePerKg: Number(formData.expectedPricePerKg),
    harvestDate: formData.harvestDate,
    images: formData.imageUrl ? [formData.imageUrl.trim()] : [],
    aiQualityGrade: formData.grade || 'A_PREMIUM',
    pickupLocation: {
      type: 'Point',
      coordinates: [Number(formData.longitude) || 73.7898, Number(formData.latitude) || 20.0063],
      farmAddress: formData.farmAddress.trim(),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.cropName || !formData.quantityKg || !formData.expectedPricePerKg) {
      setError('Crop name, quantity, and price per kg are required.');
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
            <input name="cropName" value={formData.cropName} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="e.g. Organic Tomatoes" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Variety</span>
            <input name="variety" value={formData.variety} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" placeholder="Lokwan, Hybrid, Basmati" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Product Category</span>
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
            <span className="text-xs font-bold uppercase text-slate-600">Price per KG (₹)</span>
            <input name="expectedPricePerKg" type="number" min="1" value={formData.expectedPricePerKg} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-600">Harvest Date</span>
            <input name="harvestDate" type="date" value={formData.harvestDate} onChange={handleChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
          </label>
        </div>

        {/* Product Image Option */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Product Image Options</span>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Upload Image File</label>
              <input type="file" accept="image/*" onChange={handleImageFile} className="mt-1 text-xs text-slate-600" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Or Paste Image URL</label>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-xs" />
            </div>
          </div>
          {formData.imageUrl && (
            <div className="mt-3 flex items-center gap-3">
              <img src={formData.imageUrl} alt="Crop Preview" className="h-14 w-14 rounded-md object-cover border border-slate-300 shadow-sm" />
              <span className="text-xs font-semibold text-emerald-800">Image Loaded Successfully</span>
            </div>
          )}
        </div>

        {/* Farm Location Option */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Farm Location & Mandi Address</span>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Farm Gate Address / Pickup Location</span>
              <input
                name="farmAddress"
                value={formData.farmAddress}
                onChange={handleChange}
                placeholder="e.g. Singur Farm Hub, Block B, Hooghly, West Bengal"
                className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-xs sm:text-sm font-medium"
              />
            </label>
            <button type="button" onClick={handleGetLocation} className="self-end rounded-md border border-emerald-700 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50">
              Use GPS
            </button>
          </div>
          <div className="mt-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Quick Location Preset</span>
              <select onChange={handlePresetLocation} defaultValue="" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-xs sm:text-sm">
                <option value="" disabled>Select a known mandi location</option>
                <option value="singur">Singur Crop Collective, Hooghly</option>
                <option value="nashik">Nashik Mandi Farm Gate</option>
                <option value="ratnagiri">Ratnagiri Orchard Gate</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">
            Cancel
          </button>
          <button disabled={saving} className="rounded-md bg-emerald-700 px-6 py-2 text-sm font-black text-white disabled:opacity-60 hover:bg-emerald-800">
            {saving ? 'Saving Listing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduceModal;
