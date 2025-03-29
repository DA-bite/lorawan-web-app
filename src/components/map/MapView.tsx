
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getDevices, Device } from '@/services/deviceService';
import { useQuery } from '@tanstack/react-query';
import DeviceMarker from '@/components/map/DeviceMarker';
import MapTokenForm from '@/components/map/MapTokenForm';
import MapErrorDisplay from '@/components/map/MapErrorDisplay';
import { cn } from '@/lib/utils';

interface MapViewProps {
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

// Try to get token from localStorage
const MAPBOX_TOKEN_KEY = 'mapbox_access_token';
const defaultToken = localStorage.getItem(MAPBOX_TOKEN_KEY) || 
  'pk.eyJ1IjoiZGFuaXlhcmFiZGlraGFuIiwiYSI6ImNtOHR1dmF1MjBnYmUya3NieHgyZ3dmb2UifQ.Glo7aviuawWatbsEjiyMYw';

const MapView: React.FC<MapViewProps> = ({ 
  className,
  onMapLoad 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>(defaultToken);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Query for devices
  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices
  });
  
  const resetToken = () => {
    localStorage.removeItem(MAPBOX_TOKEN_KEY);
    setMapToken('');
    setError(null);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };
  
  useEffect(() => {
    if (!mapToken || error || !mapContainer.current || map.current) return;
    
    try {
      mapboxgl.accessToken = mapToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [76.889709, 43.238949], // Almaty, Kazakhstan
        zoom: 12
      });
      
      newMap.on('load', () => {
        setMapLoaded(true);
        if (onMapLoad) onMapLoad(newMap);
      });
      
      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load the map. Please check your access token.');
      });
      
      map.current = newMap;
      
      return () => {
        newMap.remove();
        map.current = null;
      };
    } catch (err) {
      console.error('Error initializing Mapbox:', err);
      setError('Failed to initialize the map. Please check your access token.');
    }
  }, [mapToken, error, onMapLoad]);
  
  // If we have no token, show the form
  if (!mapToken) {
    return (
      <MapTokenForm 
        className={className}
        onTokenSubmit={setMapToken}
      />
    );
  }
  
  // If we have an error, show the error display
  if (error) {
    return (
      <MapErrorDisplay 
        className={className}
        onReset={resetToken} 
      />
    );
  }
  
  return (
    <div ref={mapContainer} className={cn("w-full h-full", className)}>
      {/* Only render markers when map is loaded */}
      {mapLoaded && map.current && devices.map(device => (
        <DeviceMarker 
          key={device.id}
          device={device}
          map={map.current!}
        />
      ))}
    </div>
  );
};

export default MapView;
