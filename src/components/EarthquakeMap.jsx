// src/components/EarthquakeMap.jsx
'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getJMAIntensityColor } from '@/lib/utils';

// Fix for default marker icons in Leaflet with React
const fixLeafletIcon = () => {
  if (typeof window !== 'undefined') {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function EarthquakeMap({ earthquakes = [], center = [35.6895, 139.6917] }) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-sm relative z-0">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {earthquakes.map((eq, idx) => {
          const lat = parseFloat(eq.latitude);
          const lng = parseFloat(eq.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          const color = getJMAIntensityColor(eq.maxIntensity);

          return (
            <React.Fragment key={eq.id || idx}>
              <CircleMarker
                center={[lat, lng]}
                radius={8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.8,
                  color: '#fff',
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{eq.hypocenter}</p>
                    <p>M{eq.magnitude} / 震度{eq.maxIntensity}</p>
                    <p className="text-xs text-gray-500">{eq.originTime || eq.reportTime}</p>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
}
