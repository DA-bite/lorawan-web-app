
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Device } from '@/services/deviceService';

interface DeviceMarkerProps {
  device: Device;
  map: mapboxgl.Map;
}

const DeviceMarker: React.FC<DeviceMarkerProps> = ({ device, map }) => {
  React.useEffect(() => {
    // Create custom marker element
    const markerEl = document.createElement('div');
    markerEl.className = 'flex items-center justify-center';
    
    const statusColor = getStatusColor(device.status);
    
    markerEl.innerHTML = `
      <div class="relative">
        <div class="w-5 h-5 rounded-full ${statusColor} shadow-lg"></div>
        <div class="w-5 h-5 rounded-full ${statusColor} opacity-30 animate-ping absolute top-0"></div>
      </div>
    `;
    
    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="p-2 max-w-xs">
        <h3 class="font-medium text-base">${device.name}</h3>
        <div class="mt-1 text-sm">
          <div class="flex items-center mt-1">
            <div class="w-2 h-2 rounded-full mr-2 ${statusColor}"></div>
            <span class="capitalize">${device.status}</span>
          </div>
          <p class="mt-1">Battery: ${device.battery}%</p>
          <p class="mt-1">Signal: ${device.signal}%</p>
          <p class="mt-1 text-xs text-gray-500">
            Last seen: ${new Date(device.lastSeen).toLocaleString()}
          </p>
        </div>
      </div>
    `);

    // Add marker to map
    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat([device.location.lng, device.location.lat])
      .setPopup(popup)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [device, map]);

  return null;
};

// Helper function for determining status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'offline':
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default DeviceMarker;
