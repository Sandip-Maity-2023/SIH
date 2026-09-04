
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCropLotById, getMandiPriceForecast, createOrder } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [crop, setCrop] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [error, setError] = useState('');

  const fetchCropDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCropLotById(id);
      setCrop(data.crop);
      setOrderQuantity(data.crop.quantityKg);

      // Fetch AI price predictions for this crop type
      const forecastRes = await getMandiPriceForecast({
        cropType: data.crop.cropType,
        district: data.crop.location?.district || 'Nashik',
      });
      setForecast(forecastRes.data.forecast);
    } catch {
      setError('Failed to load crop details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCropDetails();
  }, [fetchCropDetails]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setOrderProcessing(true);
    try {
      const orderPayload = {
        items: [
          {
            cropLotId: crop._id,
            farmerId: crop.farmer?._id || crop.farmerId?._id || crop.farmerId,
            quantityKg: Number(orderQuantity),
            pricePerKg: crop.pricePerKg,
            subtotal: Number(orderQuantity) * crop.pricePerKg,
          },
        ],
        totalAmount: Number(orderQuantity) * crop.pricePerKg,
        deliveryAddress: user.location?.address || {},
        transactionReference: `DEMO-${Date.now()}`,
      };

      const { data } = await createOrder(orderPayload);
      alert(`Order created. Escrow locked for order ${data.order?._id?.slice(0, 8) || data.data?._id?.slice(0, 8)}.`);
      navigate('/buyer-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing escrow purchase');
    } finally {
      setOrderProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-emerald-800">Loading Crop Data & AI Analytics...</div>;
  }

  if (error || !crop) {
    return <div className="p-10 text-center text-red-600">{error || 'Crop not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Column: Image & AI Quality Scorecard */}
          <div>
            <img
              src={crop.images?.[0] || 'https://via.placeholder.com/500x350?text=Crop+Image'}
              alt={crop.cropType}
              className="w-full h-72 object-cover rounded-lg mb-4"
            />
            
            {/* Computer Vision Scorecard */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-emerald-900">AI Quality Rating</span>
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                  Grade {crop.qualityGrade || 'A'}
                </span>
              </div>
              <div className="text-sm space-y-1 text-emerald-800">
                <p><strong>Defect Score:</strong> {crop.defectScore ? `${crop.defectScore}%` : '2.1% (Low)'}</p>
                <p><strong>Estimated Shelf Life:</strong> {crop.shelfLifeDays || 12} Days</p>
                <p><strong>Organic Verified:</strong> {crop.isOrganic ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Origin & Escrow Buy Panel */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 capitalize">{crop.cropType}</h1>
                  <p className="text-sm text-gray-500">
                    Location: {crop.location?.district}, {crop.location?.state}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-700">₹{crop.pricePerKg}</span>
                  <span className="text-xs text-gray-500 block">/ kg</span>
                </div>
              </div>

              <hr className="my-4" />

              {/* AI Mandi Forecasting Card */}
              {forecast && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                  <span className="text-xs font-semibold text-blue-900 uppercase">
                    📈 Agmarknet Mandi AI Forecast
                  </span>
                  <p className="text-sm text-blue-800 mt-1">
                    Expected price trend: <strong>₹{forecast.predictedPriceNextWeek || crop.pricePerKg + 2}/kg</strong> next week ({forecast.trend || 'Upward'}).
                  </p>
                </div>
              )}

              {/* Details List */}
              <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p><strong>Available Stock:</strong> {crop.quantityKg} kg</p>
                <p><strong>Harvest Date:</strong> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                <p><strong>Farmer / Aggregator:</strong> {crop.farmer?.name || 'Local Farmer'}</p>
              </div>
            </div>

            {/* Escrow Checkout Form */}
            <form onSubmit={handlePurchase} className="bg-gray-50 p-4 rounded-lg border">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Order Quantity (kg)
              </label>
              <input
                type="number"
                max={crop.quantityKg}
                min={1}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-3 outline-none"
                required
              />

              <div className="flex justify-between text-sm font-bold text-gray-800 mb-4">
                <span>Total Amount:</span>
                <span>₹{Number(orderQuantity || 0) * crop.pricePerKg}</span>
              </div>

              <button
                type="submit"
                disabled={orderProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {orderProcessing ? 'Locking Escrow Funds...' : 'Lock Funds in Escrow & Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
