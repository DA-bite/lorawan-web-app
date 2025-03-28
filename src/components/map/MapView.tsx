import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MapViewProps {
  className?: string;
}

// Almaty, Kazakhstan coordinates
const defaultCenter = {
  lat: 43.238949,
  lng: 76.889709
};

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

const mapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  zoomControl: true,
};

const MapView: React.FC<MapViewProps> = ({ className }) => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC2yvJh-ZuPfx1h7JzHkXHGmz92_7gdmBE'
  });

  useEffect(() => {
    if (isLoaded) {
      console.log('Google Maps API loaded successfully');
    }
    
    if (apiLoadError) {
      console.error('Error loading Google Maps API:', apiLoadError);
      setLoadError('Failed to load Google Maps');
      toast.error('Failed to load Google Maps');
    }
  }, [isLoaded, apiLoadError]);

  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    setMap(map);
    
    if (devices.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      devices.forEach(device => {
        bounds.extend(device.location);
      });
      map.fitBounds(bounds);
      
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom() > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [devices]);

  const onMapUnmount = useCallback(() => {
    console.log('Map unmounted');
    setMap(null);
  }, []);

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'offline':
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loadError || apiLoadError) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg", className)}>
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800">Map could not be loaded</h3>
        <p className="text-sm text-gray-600 mt-2">Please check your internet connection and try again</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <span className="ml-2 text-lg font-medium">Loading map...</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative overflow-hidden", className)}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={mapOptions}
      >
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={device.location}
            onClick={() => setSelectedDevice(device)}
            icon={{
              path: 'M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18Z',
              fillColor: device.status === 'online' ? '#22c55e' : device.status === 'warning' ? '#eab308' : '#ef4444',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#fff',
              scale: 1.5,
              anchor: new google.maps.Point(10, 10),
            }}
          />
        ))}

        {selectedDevice && (
          <InfoWindow
            position={selectedDevice.location}
            onCloseClick={() => setSelectedDevice(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-medium text-base">{selectedDevice.name}</h3>
              <div className="mt-1 text-sm">
                <div className="flex items-center mt-1">
                  <div className={cn("w-2 h-2 rounded-full mr-2", getMarkerIcon(selectedDevice.status))}></div>
                  <span className="capitalize">{selectedDevice.status}</span>
                </div>
                <p className="mt-1">Battery: {selectedDevice.battery}%</p>
                <p className="mt-1">Signal: {selectedDevice.signal}%</p>
                <p className="mt-1 text-xs text-gray-500">
                  Last seen: {new Date(selectedDevice.lastSeen).toLocaleString()}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
