import React, { useCallback, useEffect, useState } from 'react';

const ProduceTable = () => {
  const [produces, setProduces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarmerProduces = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/produce');
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      setProduces(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      // Fallback demo crop inventory
      setProduces([
        { id: 'P-101', cropName: 'Fresh Organic Tomatoes', category: 'Vegetables', quantity: 1200, unit: 'kg', pricePerUnit: 28, status: 'Available' },
        { id: 'P-102', cropName: 'Sharbati Wheat', category: 'Cereals', quantity: 3500, unit: 'kg', pricePerUnit: 34, status: 'Available' },
        { id: 'P-103', cropName: 'Basmati Rice (Grade A)', category: 'Cereals', quantity: 0, unit: 'kg', pricePerUnit: 75, status: 'Sold Out' },
        { id: 'P-104', cropName: 'Yellow Toor Dal', category: 'Pulses', quantity: 800, unit: 'kg', pricePerUnit: 110, status: 'Available' }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFarmerProduces();
  }, [fetchFarmerProduces]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this listing?')) {
      setProduces((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (loading) return <div className="p-4 text-center text-sm text-gray-500">Loading crop listings...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b">
          <tr>
            <th className="px-4 py-3">Listing ID</th>
            <th className="px-4 py-3">Crop Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Stock Available</th>
            <th className="px-4 py-3">Price / Unit</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {produces.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.id}</td>
              <td className="px-4 py-3 font-semibold text-gray-800">{item.cropName}</td>
              <td className="px-4 py-3 text-xs">{item.category}</td>
              <td className="px-4 py-3 text-sm">{item.quantity} {item.unit}</td>
              <td className="px-4 py-3 font-bold text-emerald-700">₹{item.pricePerUnit}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                  item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button
                  onClick={() => alert(`Edit listing ${item.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProduceTable;
