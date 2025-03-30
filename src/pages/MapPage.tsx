
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/components/map/MapView';

const MapPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Map View</h1>
      
      <Card className="w-full overflow-hidden">
        <CardHeader className="py-3">
          <CardTitle>Device Locations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[70vh]">
            <MapView />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPage;
