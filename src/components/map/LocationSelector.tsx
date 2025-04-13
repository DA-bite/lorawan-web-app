
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationSelectorProps {
  initialLocation: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  initialLocation,
  onLocationChange,
  className,
}) => {
  const { t } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapToken, setMapToken] = useState<string>(localStorage.getItem('mapbox_access_token') || '');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Function to initialize map
  const initializeMap = () => {
    if (!mapContainer.current || !mapToken) return;
    
    try {
      mapboxgl.accessToken = mapToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLocation.lng, initialLocation.lat],
        zoom: 13
      });
      
      newMap.on('load', () => {
        setMapLoaded(true);
        
        // Create a marker at the initial location
        const newMarker = new mapboxgl.Marker({ draggable: true })
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .addTo(newMap);
        
        // Update coordinates when marker is dragged
        newMarker.on('dragend', () => {
          const lngLat = newMarker.getLngLat();
          onLocationChange({ lat: lngLat.lat, lng: lngLat.lng });
        });
        
        marker.current = newMarker;
      });
      
      // Add click handler to set marker position
      newMap.on('click', (e) => {
        if (marker.current) {
          marker.current.setLngLat(e.lngLat);
          onLocationChange({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        }
      });
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current = newMap;
    } catch (err) {
      console.error('Error initializing Mapbox:', err);
      toast.error(t('map_initialization_error'));
    }
  };
  
  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapToken.trim()) {
      toast.error(t('enter_valid_token'));
      return;
    }
    
    localStorage.setItem('mapbox_access_token', mapToken);
    
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    initializeMap();
  };
  
  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapboxgl.accessToken) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      
      if (!response.ok) throw new Error('Geocoding request failed');
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        if (map.current && marker.current) {
          map.current.flyTo({ center: [lng, lat], zoom: 13 });
          marker.current.setLngLat([lng, lat]);
          onLocationChange({ lat, lng });
        }
      } else {
        toast.error(t('location_not_found'));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(t('search_failed'));
    }
  };
  
  // Initialize map on component mount
  useEffect(() => {
    if (mapToken) {
      initializeMap();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);
  
  // Handle token input form
  if (!mapToken) {
    return (
      <div className={`p-4 border rounded-md bg-muted/50 ${className}`}>
        <h3 className="text-lg font-medium mb-4">{t('mapbox_token_required')}</h3>
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('enter_mapbox_token_description')}
            </p>
            <Input
              value={mapToken}
              onChange={(e) => setMapToken(e.target.value)}
              placeholder={t('enter_mapbox_token')}
            />
          </div>
          <Button type="submit">{t('continue')}</Button>
        </form>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="mb-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_location')}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">{t('search')}</span>
          </Button>
        </form>
      </div>
      
      <div
        ref={mapContainer}
        className="h-[300px] rounded-md border overflow-hidden"
      />
      
      {mapLoaded && (
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>
            {t('latitude')}: {initialLocation.lat.toFixed(6)}
          </span>
          <span>
            {t('longitude')}: {initialLocation.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
