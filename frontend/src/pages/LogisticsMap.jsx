
import React, { useEffect, useState, useContext } from 'react';
import React, { useEffect, useState, useContext } from 'react';
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

const LogisticsMap = () => {
  const socketContext = useContext(SocketContext);
  const socket = socketContext?.socket;
  const [activeTripId, setActiveTripId] = useState('demo-trip');
  const [driverLocation, setDriverLocation] = useState([20.0063, 73.7898]); // Default: Nashik, MH
  const [routeWaypoints, setRouteWaypoints] = useState([
    [20.0063, 73.7898],
    [20.0200, 73.8000],
    [20.0500, 73.8300],
  ]);
  const [speed, setSpeed] = useState(45);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const { data } = await getActiveTrips();
        const trip = (data.trips || data.data || [])[0];
        if (!trip) return;

        if (trip._id) setActiveTripId(trip._id);
        if (trip.currentLocation?.coordinates?.length === 2) {
          setDriverLocation([trip.currentLocation.coordinates[1], trip.currentLocation.coordinates[0]]);
        }

        const waypoints = trip.optimizedWaypoints
          ?.filter((waypoint) => waypoint.location?.coordinates?.length === 2)
          .sort((a, b) => a.stopSequence - b.stopSequence)
          .map((waypoint) => [waypoint.location.coordinates[1], waypoint.location.coordinates[0]]);

        if (waypoints?.length) setRouteWaypoints(waypoints);
      } catch (error) {
        console.error('Failed to load active logistics trip:', error);
      }
    };

    loadTrip();
  }, []);
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full min-h-[calc(100vh-80px)]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline showing planned optimal route */}
          <Polyline positions={routeWaypoints} color="#059669" weight={4} dashArray="5, 10" />

          {/* Pickup Waypoint Markers */}
          <Marker position={routeWaypoints[0]} icon={farmIcon}>
            <Popup>Waypoint 1: Farm Gate Pickup (Nashik North)</Popup>
          </Marker>

          <Marker position={routeWaypoints[routeWaypoints.length - 1]} icon={farmIcon}>
            <Popup>Destination: Central Buyer Warehouse</Popup>
          </Marker>

          {/* Live Moving Truck Driver Marker */}
          <Marker position={driverLocation} icon={truckIcon}>
            <Popup>
              <strong>Live Delivery Driver</strong>
              <br />
              Lat: {driverLocation[0].toFixed(4)}, Lng: {driverLocation[1].toFixed(4)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LogisticsMap;
