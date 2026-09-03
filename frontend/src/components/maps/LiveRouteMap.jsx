import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Default marker pin workaround for Leaflet build tools
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveRouteMap = ({ driverPosition = [20.0063, 73.7898], waypoints = [] }) => {
  return (
    <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
      <MapContainer center={driverPosition} zoom={12} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.length > 1 && (
          <Polyline positions={waypoints} color="#059669" weight={4} />
        )}
        <Marker position={driverPosition}>
          <Popup>
            <strong>Active Delivery Transport</strong>
            <br />
            Lat: {driverPosition[0]}, Lng: {driverPosition[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveRouteMap;
