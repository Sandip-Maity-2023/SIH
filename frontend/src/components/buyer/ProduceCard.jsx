import React from 'react';

const ProduceCard = ({ produce, onAddToCart }) => {
  const name = produce?.cropName || produce?.name || 'Produce Listing';
  const category = produce?.category || 'Produce';
  const price = produce?.expectedPricePerKg || produce?.price || 0;
  const quantityAvailable = produce?.quantityKg ? `${produce.quantityKg} kg` : produce?.quantityAvailable;
  const location = produce?.pickupLocation?.farmAddress || produce?.location || '';
  const farmer = produce?.farmerId?.name || produce?.farmer || 'Verified Farmer';

  return (
    <div className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="mb-2 flex items-start justify-between gap-3">
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
            {category}
          </span>
          <span className="text-right text-xs text-gray-400">{location}</span>
        </div>

        <h3 className="mb-1 line-clamp-1 text-base font-bold text-gray-800">{name}</h3>
        <p className="mb-3 text-xs text-gray-500">
          Farmer: <span className="font-medium text-gray-700">{farmer}</span>
        </p>

        <div className="my-2 flex items-center justify-between border-y py-2 text-sm">
          <div>
            <p className="text-xs text-gray-400">Price / Kg</p>
            <p className="text-base font-bold text-emerald-700">Rs {price}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Available</p>
            <p className="font-semibold text-gray-700">{quantityAvailable || '-'}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onAddToCart?.(produce)}
        className="mt-3 w-full rounded bg-green-700 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-800"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProduceCard;
