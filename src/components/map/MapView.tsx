
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import DeviceMarker from './DeviceMarker';
import MapTokenForm from './MapTokenForm';
import MapErrorDisplay from './MapErrorDisplay';

interface MapViewProps {
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

// Almaty, Kazakhstan coordinates
const defaultCenter = {
  lat: 43.238949,
  lng: 76.889709
};

// Default Mapbox token (can be modified via the form if needed)
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoiZGFuaXlhcmFiZGlraGFuIiwiYSI6ImNtOHR1dmF1MjBnYmUya3NieHgyZ3dmb2UifQ.Glo7aviuawWatbsEjiyMYw';

const MapView: React.FC<MapViewProps> = ({ className, onMapLoad }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [apiKeyEntered, setApiKeyEntered] = useState<boolean>(!!DEFAULT_MAPBOX_TOKEN);
  
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices
  });

  // Initialize the map when the API key is provided
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
      });

      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setLoadError('Failed to initialize Mapbox');
      toast.error('Failed to initialize Mapbox');
    }
  }, [apiKeyEntered, apiKey, onMapLoad]);

  // Fit map to show all devices
  useEffect(() => {
    if (map && devices.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      devices.forEach(device => {
        bounds.extend([device.location.lng, device.location.lat]);
      });
      
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [devices, map]);

  const handleApiKeySubmit = (token: string) => {
    setApiKey(token);
    setApiKeyEntered(true);
  };

  const resetApiKey = () => {
    setApiKeyEntered(false);
    setLoadError(null);
  };

  if (!apiKeyEntered) {
    return <MapTokenForm className={className} onTokenSubmit={handleApiKeySubmit} defaultToken={apiKey} />;
  }

  if (loadError) {
    return <MapErrorDisplay className={className} onReset={resetApiKey} />;
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
      {devices.map(device => (
        <DeviceMarker key={device.id} device={device} map={map} />
      ))}
    </div>
  );
};

export default MapView;
