import React, { useState } from 'react';
import { MapPin, Plus, Check, Zap } from 'lucide-react';

const ProduceCard = ({ produce, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  const name = produce?.cropName || produce?.title || produce?.name || 'Fresh Produce';
  const category = produce?.category || produce?.cropCategory || 'Vegetable';
  const price = Number(produce?.expectedPricePerKg || produce?.pricePerKg || produce?.price || 0);
  const mrp = Math.round(price * 1.25);
  const quantityAvailable = produce?.quantityKg ? `${produce.quantityKg} kg` : (produce?.quantityAvailable || '100 kg');
  const location = produce?.pickupLocation?.address?.district || produce?.district || produce?.pickupLocation?.farmAddress || 'Singur Hub';
  const farmer = produce?.farmerId?.name || produce?.farmer || 'Verified Farmer';
  const imageUrl = produce?.images?.[0] || produce?.image || 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=80';
  const grade = produce?.grade || 'Grade A';

  const handleAdd = () => {
    onAddToCart?.(produce);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="blinkit-card flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-sm hover:border-emerald-400 transition-all group">
      <div>
        {/* Top Image Container with Delivery Time Badge */}
        <div className="relative h-32 sm:h-36 w-full overflow-hidden rounded-lg bg-slate-50 mb-2.5 border border-slate-100">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=500&auto=format&fit=crop&q=80';
            }}
          />

          {/* Blinkit Delivery Time Tag */}
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md bg-slate-950/85 px-2 py-0.5 text-[10px] font-black text-amber-400 backdrop-blur-sm shadow-sm">
            <Zap className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
            <span>15 MINS</span>
          </div>

          <div className="absolute top-1.5 right-1.5 rounded-md bg-emerald-700 text-white px-1.5 py-0.5 text-[9px] font-black uppercase shadow-sm">
            {grade.replace('_', ' ')}
          </div>

          <div className="absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 backdrop-blur-sm border border-slate-200 flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
            {location}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {category}
            </span>
            <span className="text-[10px] font-bold text-slate-500">{quantityAvailable}</span>
          </div>

          <h3 className="line-clamp-1 text-xs sm:text-sm font-black text-slate-900 leading-tight">{name}</h3>
          <p className="text-[10px] text-slate-500 truncate font-medium">
            Kisan: <span className="font-bold text-slate-700">{farmer}</span>
          </p>
        </div>
      </div>

      {/* Bottom Pricing & Blinkit Green ADD Button */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 line-through font-bold block leading-none">₹{mrp}</span>
          <span className="text-sm sm:text-base font-black text-slate-950">₹{price} <span className="text-[10px] font-semibold text-slate-500">/kg</span></span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`px-3 py-1.5 rounded-lg font-black text-xs transition flex items-center gap-1 shadow-sm ${
            added
              ? 'bg-slate-900 text-white'
              : 'bg-[#0C831F] hover:bg-emerald-800 text-white active:scale-95'
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> ADDED
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" /> ADD
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProduceCard;
