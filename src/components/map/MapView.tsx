
import React from 'react';
import { Map, MapPin } from 'lucide-react';

interface MapViewProps {
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({ className }) => {
  return (
    <div className={`w-full h-96 border rounded-lg bg-background/50 relative overflow-hidden ${className || ''}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Map className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">Map View</h3>
        <p className="text-muted-foreground mt-2">
          Map integration is currently unavailable.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Please check your internet connection or try again later.
        </p>
        
        {/* This would be a future map integration with markers */}
        <div className="flex mt-8 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Offline</span>
          </div>
        </div>
      </div>
      
      {/* Sample device marker positions */}
      <div className="absolute top-1/4 left-1/3">
        <MapPin className="h-6 w-6 text-green-500" />
      </div>
      <div className="absolute top-1/2 left-2/3">
        <MapPin className="h-6 w-6 text-yellow-500" />
      </div>
      <div className="absolute top-3/4 left-1/4">
        <MapPin className="h-6 w-6 text-red-500" />
      </div>
    </div>
  );
};

export default MapView;
