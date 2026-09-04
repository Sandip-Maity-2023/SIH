import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/SocketContext';

const LiveTracking = ({ shipmentId = 'SHP-9921' }) => {
  const socket = useContext(SocketContext);
  const [telemetry, setTelemetry] = useState({
    locationName: 'NH-19 Near Durgapur Toll Plaza',
    latitude: 23.5204,
    longitude: 87.3119,
    temperature: 4.2, // °C cold chain tracking
    speed: 58, // km/h
    eta: '2 hrs 15 mins',
    status: 'In Transit'
  });

  useEffect(() => {
    if (!socket) return;

    // Join tracking channel for specific shipment
    socket.emit('joinTracking', { shipmentId });

    socket.on('locationUpdate', (data) => {
      setTelemetry((prev) => ({ ...prev, ...data }));
    });

    return () => {
      socket.emit('leaveTracking', { shipmentId });
      socket.off('locationUpdate');
    };
  }, [socket, shipmentId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cold Chain Live Tracking</h1>
            <p className="text-xs text-gray-500">Shipment ID: <span className="font-mono font-semibold">{shipmentId}</span></p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 font-bold text-xs rounded-full w-fit">
            {telemetry.status}
          </span>
        </div>

        {/* Real-time Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-400">Current Speed</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{telemetry.speed} km/h</h3>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-400">Cold Chain Temp</p>
            <h3 className={`text-xl font-bold mt-1 ${telemetry.temperature > 8 ? 'text-red-600' : 'text-blue-600'}`}>
              {telemetry.temperature}°C
            </h3>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-400">Estimated Arrival</p>
            <h3 className="text-xl font-bold text-emerald-700 mt-1">{telemetry.eta}</h3>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-400">Coordinates</p>
            <h3 className="text-xs font-mono font-bold text-gray-700 mt-2">
              {telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}
            </h3>
          </div>
        </div>

        {/* Map Interface Container */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-3 flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Live GPS Location:</span>
            <span className="text-xs text-gray-500">{telemetry.locationName}</span>
          </div>

          {/* Map Preview Area */}
          <div className="w-full h-80 bg-slate-100 rounded-md border flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-50/40 flex items-center justify-center text-xs text-gray-400">
              [ Map View Canvas - Coordinates: {telemetry.latitude}, {telemetry.longitude} ]
            </div>
            <div className="relative z-10 p-3 bg-white shadow-md rounded-lg border border-gray-200 text-center">
              <span className="text-xs font-bold text-green-700">🚛 Transit Vehicle GPS Active</span>
              <p className="text-[10px] text-gray-500">Updating live via WebSocket connection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
