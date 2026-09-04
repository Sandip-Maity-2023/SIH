import React, { useState } from 'react';

const RouteScheduler = ({ onRouteScheduled }) => {
  const [schedule, setSchedule] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    vehicleType: 'Refrigerated Truck (10 Ton)',
    driverName: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onRouteScheduled) onRouteScheduled(schedule);
    alert('Dispatch route scheduled successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Dispatch & Route Scheduler</h1>
        <p className="text-xs text-gray-500 mb-6">Plan logistics pickups between farm clusters and regional distribution hubs.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Pickup Origin (Farm / Hub)</label>
              <input
                type="text"
                name="origin"
                required
                value={schedule.origin}
                onChange={handleChange}
                placeholder="e.g. Singur Farm Cluster, Hooghly"
                className="mt-1 w-full px-3 py-2 border rounded text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Delivery Destination</label>
              <input
                type="text"
                name="destination"
                required
                value={schedule.destination}
                onChange={handleChange}
                placeholder="e.g. Kolkata Wholesale Mandi"
                className="mt-1 w-full px-3 py-2 border rounded text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                required
                value={schedule.departureTime}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Vehicle Type</label>
              <select
                name="vehicleType"
                value={schedule.vehicleType}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded text-sm bg-white focus:ring-green-500 focus:border-green-500"
              >
                <option value="Refrigerated Truck (10 Ton)">Refrigerated Truck (10 Ton)</option>
                <option value="Covered Container (5 Ton)">Covered Container (5 Ton)</option>
                <option value="Open Pickup (2 Ton)">Open Pickup (2 Ton)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Assigned Driver</label>
              <input
                type="text"
                name="driverName"
                value={schedule.driverName}
                onChange={handleChange}
                placeholder="Driver full name"
                className="mt-1 w-full px-3 py-2 border rounded text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Special Route / Temperature Instructions</label>
            <textarea
              name="notes"
              rows="3"
              value={schedule.notes}
              onChange={handleChange}
              placeholder="e.g. Maintain cold storage at 4°C for perishables..."
              className="mt-1 w-full px-3 py-2 border rounded text-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-green-700 text-white font-semibold rounded text-sm hover:bg-green-800 transition-colors"
          >
            Create Freight Dispatch Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default RouteScheduler;
