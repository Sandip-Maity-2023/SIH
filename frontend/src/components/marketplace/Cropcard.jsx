import React from 'react';
import { Link } from 'react-router-dom';

const CropCard = ({ crop }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition flex flex-col justify-between">
      <div>
        <div className="relative">
          <img
            src={crop.images?.[0] || 'https://via.placeholder.com/300x200?text=Crop+Lot'}
            alt={crop.cropType}
            className="w-full h-40 object-cover"
          />
          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow">
            Grade {crop.qualityGrade || 'A'}
          </span>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-800 text-base capitalize">{crop.cropType}</h3>
            <span className="text-emerald-700 font-extrabold text-base">₹{crop.pricePerKg}/kg</span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            📍 {crop.location?.district || 'Nashik'}, {crop.location?.state || 'MH'}
          </p>

          <div className="mt-3 flex justify-between items-center text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
            <span>Quantity: <strong>{crop.quantityKg} kg</strong></span>
            <span>Shelf Life: <strong>{crop.shelfLifeDays || 7} Days</strong></span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Link
          to={`/crops/${crop._id}`}
          className="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-xs transition"
        >
          View Crop & Bid
        </Link>
      </div>
    </div>
  );
};

export default CropCard;
