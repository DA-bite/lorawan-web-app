
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapViewProps {
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

// Almaty, Kazakhstan coordinates
const defaultCenter = {
  lat: 43.238949,
  lng: 76.889709
};

const MapView: React.FC<MapViewProps> = ({ className, onMapLoad }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyEntered, setApiKeyEntered] = useState<boolean>(false);
  
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices
  });

  useEffect(() => {
    if (!apiKeyEntered || !mapContainer.current) return;

    try {
      // Initialize map with Mapbox
      mapboxgl.accessToken = apiKey;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom: 12
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      newMap.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));

      // Add device markers when map loads
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        setMap(newMap);
        
        if (onMapLoad) {
          onMapLoad(newMap);
        }

        // Add markers for devices
        addDeviceMarkers(newMap);
      });

      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setLoadError('Failed to initialize Mapbox');
      toast.error('Failed to initialize Mapbox');
    }
  }, [apiKeyEntered, apiKey, devices, onMapLoad]);

  // Update markers when devices data changes
  useEffect(() => {
    if (map && devices.length > 0) {
      addDeviceMarkers(map);
    }
  }, [devices, map]);

  const addDeviceMarkers = (mapInstance: mapboxgl.Map) => {
    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add markers for each device
    devices.forEach(device => {
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
      new mapboxgl.Marker(markerEl)
        .setLngLat([device.location.lng, device.location.lat])
        .setPopup(popup)
        .addTo(mapInstance);
    });

    // Fit bounds if we have devices
    if (devices.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      devices.forEach(device => {
        bounds.extend([device.location.lng, device.location.lat]);
      });
      
      mapInstance.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  };

  const getStatusColor = (status: string): string => {
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

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter a valid Mapbox access token');
      return;
    }
    setApiKeyEntered(true);
    toast.success('API key applied. Loading map...');
  };

  if (!apiKeyEntered) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6", className)}>
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-4">Mapbox Access Token Required</h3>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
          Please enter a valid Mapbox access token to display the map. You can get an access token from the 
          <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Mapbox Account page</a>.
        </p>
        <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-4">
          <Input 
            type="text" 
            placeholder="Enter Mapbox Access Token" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Apply Access Token
          </Button>
        </form>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg", className)}>
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800">Map could not be loaded</h3>
        <p className="text-sm text-gray-600 mt-2 mb-4 text-center">Please check your access token and internet connection</p>
        <Button variant="outline" onClick={() => setApiKeyEntered(false)}>
          Enter a different access token
        </Button>
      </div>
    );
  }

  if (isLoadingDevices || !map) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <span className="ml-2 text-lg font-medium">Loading map...</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      <div ref={mapContainer} className="w-full h-full rounded-md"></div>
    </div>
  );
};

export default MapView;
