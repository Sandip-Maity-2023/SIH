import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SocketContext } from '../context/SocketContext';
import { getActiveTrips } from '../services/api';

// Custom Marker Icon for Logistics Driver Truck
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995470.png',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -10],
});

const farmIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1202/1202924.png',
  iconSize: [32, 32],
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177361.png',
  iconSize: [32, 32],
});

const locationPresets = {
  singur_kolkata: {
    origin: 'Singur Farm Cluster, Hooghly (WB)',
    destination: 'Kolkata Wholesale Mandi (WB)',
    originCoords: [22.8122, 88.2325],
    destCoords: [22.5726, 88.3639],
  },
  nashik_mumbai: {
    origin: 'Nashik Farmer Hub (MH)',
    destination: 'Vashi APMC Mandi Navi Mumbai (MH)',
    originCoords: [20.0063, 73.7898],
    destCoords: [19.0760, 72.8777],
  },
  sonipat_delhi: {
    origin: 'Sonipat Agri Hub (HR)',
    destination: 'Azadpur Mandi Delhi',
    originCoords: [28.9931, 77.0151],
    destCoords: [28.7041, 77.1025],
  },
};

const LogisticsMap = () => {
  const location = useLocation();
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;

  const passedState = location.state || {};
  const [activeTripId, setActiveTripId] = useState(passedState.id || 'SCH-1001');
  const [origin, setOrigin] = useState(passedState.origin || 'Singur Farm Cluster, Hooghly (WB)');
  const [destination, setDestination] = useState(passedState.destination || 'Kolkata Wholesale Mandi (WB)');

  const [originCoords, setOriginCoords] = useState([22.8122, 88.2325]);
  const [destCoords, setDestCoords] = useState([22.5726, 88.3639]);
  const [driverLocation, setDriverLocation] = useState([22.8122, 88.2325]);
  const [speed, setSpeed] = useState(48);
  const [isSimulating, setIsSimulating] = useState(false);

  // Update map coordinates based on origin/destination text
  useEffect(() => {
    const text = `${origin} ${destination}`.toLowerCase();
    if (text.includes('nashik') || text.includes('vashi') || text.includes('mumbai')) {
      setOriginCoords([20.0063, 73.7898]);
      setDestCoords([19.0760, 72.8777]);
      setDriverLocation([20.0063, 73.7898]);
    } else if (text.includes('sonipat') || text.includes('delhi') || text.includes('azadpur')) {
      setOriginCoords([28.9931, 77.0151]);
      setDestCoords([28.7041, 77.1025]);
      setDriverLocation([28.9931, 77.0151]);
    } else {
      // Default: Singur to Kolkata
      setOriginCoords([22.8122, 88.2325]);
      setDestCoords([22.5726, 88.3639]);
      setDriverLocation([22.8122, 88.2325]);
    }
  }, [origin, destination]);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const { data } = await getActiveTrips();
        const trip = (data.trips || data.data || [])[0];
        if (!trip) return;
        if (trip._id) setActiveTripId(trip._id);
      } catch (error) {
        console.warn('Using default route schedule view');
      }
    };
    loadTrip();
  }, []);

  useEffect(() => {
    if (!socket || typeof socket.emit !== 'function') return;

    socket.emit('joinTripRoom', activeTripId);

    const handleUpdate = (data) => {
      if (data?.coordinates?.length === 2) {
        const newCoords = [data.coordinates[1], data.coordinates[0]];
        setDriverLocation(newCoords);
        if (data.speed) setSpeed(data.speed);
      }
    };

    socket.on('driverLocationUpdate', handleUpdate);

    return () => {
      socket.off('driverLocationUpdate', handleUpdate);
    };
  }, [socket, activeTripId]);

  // Live GPS simulation loop
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setDriverLocation((prev) => {
          const nextLat = prev[0] + (Math.random() * 0.002 - 0.001);
          const nextLng = prev[1] + (Math.random() * 0.002 - 0.001);
          const currentSpeed = Math.floor(35 + Math.random() * 30);
          setSpeed(currentSpeed);

          if (socket && typeof socket.emit === 'function') {
            socket.emit('updateLocation', {
              tripId: activeTripId,
              latitude: nextLat,
              longitude: nextLng,
              speed: currentSpeed,
            });
          }
          return [nextLat, nextLng];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, socket, activeTripId]);

  const midPoint = [
    (originCoords[0] + destCoords[0]) / 2,
    (originCoords[1] + destCoords[1]) / 2,
  ];

  const routePolyline = [originCoords, midPoint, destCoords];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Interactive Banner */}
      <div className="bg-white p-4 shadow-sm border-b space-y-3 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-widest">
              <span>● Live Transport Telemetry</span>
              <span className="text-slate-400">|</span>
              <span>Trip ID: {activeTripId}</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-0.5">
              Live Logistics Route: <span className="text-emerald-800">{origin}</span> ➔ <span className="text-emerald-800">{destination}</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded-xl font-black transition shadow-sm ${
                isSimulating ? 'bg-amber-500 text-white' : 'bg-emerald-800 text-white hover:bg-emerald-900'
              }`}
            >
              {isSimulating ? '⏸ Pause GPS Broadcast' : '▶ Start Live GPS Broadcast'}
            </button>
            <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 text-emerald-900">
              Speed: <strong>{speed} km/h</strong>
            </div>
          </div>
        </div>

        {/* Boarding to Destination Route Inputs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase">Boarding Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Singur Farm Cluster, Hooghly"
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase">Delivery Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kolkata Wholesale Mandi"
              className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="flex items-end">
            <select
              onChange={(e) => {
                const preset = locationPresets[e.target.value];
                if (preset) {
                  setOrigin(preset.origin);
                  setDestination(preset.destination);
                }
              }}
              className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-700"
            >
              <option value="">Load Route Preset...</option>
              <option value="singur_kolkata">Singur ➔ Kolkata Mandi</option>
              <option value="nashik_mumbai">Nashik ➔ Vashi APMC Mumbai</option>
              <option value="sonipat_delhi">Sonipat ➔ Azadpur Mandi Delhi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Full-screen Leaflet Map */}
      <div className="flex-1 relative min-h-[500px]">
        <MapContainer
          center={driverLocation}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full min-h-[calc(100vh-140px)]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline showing planned optimal route */}
          <Polyline positions={routePolyline} color="#0C831F" weight={5} dashArray="6, 10" />

          {/* Boarding Origin Marker */}
          <Marker position={originCoords} icon={farmIcon}>
            <Popup>
              <div className="p-1 font-sans">
                <strong className="text-emerald-900 block font-black">🌱 Boarding Origin Pickup</strong>
                <span className="text-xs text-slate-600">{origin}</span>
              </div>
            </Popup>
          </Marker>

          {/* Delivery Destination Marker */}
          <Marker position={destCoords} icon={destIcon}>
            <Popup>
              <div className="p-1 font-sans">
                <strong className="text-blue-900 block font-black">🏢 Delivery Destination Mandi</strong>
                <span className="text-xs text-slate-600">{destination}</span>
              </div>
            </Popup>
          </Marker>

          {/* Live Moving Truck Driver Marker */}
          <Marker position={driverLocation} icon={truckIcon}>
            <Popup>
              <div className="p-1 font-sans">
                <strong className="text-emerald-800 block font-black">🚛 Live Cold-Chain Driver</strong>
                <span className="text-xs text-slate-600">En route from {origin} to {destination}</span>
                <br />
                <span className="text-[11px] font-bold text-slate-500">Speed: {speed} km/h</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LogisticsMap;

