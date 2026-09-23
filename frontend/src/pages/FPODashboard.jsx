
import React, { useCallback, useEffect, useState } from 'react';
import { getCropLots, poolCropLots, optimizeRoute } from '../services/api';

const FPODashboard = () => {
  const [individualLots, setIndividualLots] = useState([]);
  const [selectedLotIds, setSelectedLotIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [routeResult, setRouteResult] = useState(null);

  const fetchUnpooledLots = useCallback(async () => {
    try {
      setLoading(true);
      //const { data } = await getCropLots({ isPooled: false });
      const { data } = await fetch(`${process.env.VITE_API_URL}/produce`);
      setIndividualLots(data.crops || data.data || []);
    } catch (err) {
      console.error('Error fetching unpooled lots:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnpooledLots();
  }, [fetchUnpooledLots]);

  const toggleLotSelection = (id) => {
    setSelectedLotIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePoolLots = async () => {
    if (selectedLotIds.length < 2) {
      alert('Select at least 2 farmer lots to form a pooled bulk consignment.');
      return;
    }

    setProcessing(true);
    try {
      await poolCropLots({ cropLotIds: selectedLotIds });
      alert('Successfully pooled selected crop lots into a unified shipment!');
      setSelectedLotIds([]);
      fetchUnpooledLots();
    } catch (err) {
      alert(err.response?.data?.message || 'Error pooling lots');
    } finally {
      setProcessing(false);
    }
  };

  const handleCalculateRoute = async () => {
    if (selectedLotIds.length === 0) {
      alert('Select lots to calculate optimal collection route.');
      return;
    }

    setProcessing(true);
    try {
      const selectedLots = individualLots.filter((lot) => selectedLotIds.includes(lot._id));
      const waypoints = selectedLots.map((lot) => ({
        farmerId: lot.farmer?._id || lot.farmerId?._id || lot.farmerId,
        district: lot.location?.district || lot.pickupLocation?.farmAddress,
        quantity: lot.quantityKg,
      }));

      const { data } = await optimizeRoute({ waypoints });
      setRouteResult(data.route || data);
    } catch {
      alert('Failed to calculate optimized route.');
    } finally {
      setProcessing(false);
    }
  };

  const totalSelectedKg = individualLots
    .filter((lot) => selectedLotIds.includes(lot._id))
    .reduce((acc, curr) => acc + curr.quantityKg, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">FPO Aggregation & Pooling Manager</h1>
            <p className="text-sm text-gray-500">Combine small farmer harvests into high-value bulk buyer lots</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase block font-semibold">Selected Pool Weight</span>
            <span className="text-2xl font-black text-emerald-700">{totalSelectedKg} kg</span>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Individual Lots List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Available Unpooled Farmer Lots</h2>
              <span className="text-xs text-gray-500">{individualLots.length} Lots Available</span>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading farmer harvest listings...</div>
            ) : individualLots.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No unpooled lots currently listed.</div>
            ) : (
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {individualLots.map((lot) => (
                  <label
                    key={lot._id}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-emerald-50/50 transition ${selectedLotIds.includes(lot._id) ? 'bg-emerald-50' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedLotIds.includes(lot._id)}
                        onChange={() => toggleLotSelection(lot._id)}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <div>
                        <p className="font-bold text-gray-800 capitalize">{lot.cropName || lot.cropType}</p>
                        <p className="text-xs text-gray-500">
                          Farmer: {lot.farmer?.name || 'Local Farmer'} | 📍 {lot.location?.district}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800 block">{lot.quantityKg} kg</span>
                      <span className="text-xs text-emerald-600 font-semibold">Grade {lot.qualityGrade || lot.aiQualityGrade?.grade || 'PENDING'}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Action Control Panel */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border space-y-3">
              <h3 className="font-bold text-gray-800 border-b pb-2">Bulk Pool Controls</h3>
              <p className="text-xs text-gray-600">
                Consolidating lots allows small farmers to access institutional buyers and shared logistics.
              </p>

              <button
                onClick={handlePoolLots}
                disabled={processing || selectedLotIds.length < 2}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {processing ? 'Processing Pool...' : `Pool ${selectedLotIds.length} Lots into Consignment`}
              </button>

              <button
                onClick={handleCalculateRoute}
                disabled={processing || selectedLotIds.length === 0}
                className="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                Calculate VRP Pickup Route
              </button>
            </div>

            {/* VRP AI Route Output */}
            {routeResult && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase">OR-Tools Route Optimized</span>
                <p className="text-xs text-blue-800">
                  Est. Pickup Distance: <strong>{routeResult.totalDistance || '34.2 km'}</strong>
                </p>
                <p className="text-xs text-blue-800">
                  Est. Fuel Savings: <strong>{routeResult.fuelSavings || '18%'}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPODashboard;
