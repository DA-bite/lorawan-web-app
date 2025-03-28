import React, { useState, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MapView from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/services/deviceService';
import { toast } from 'sonner';

const MapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { data: devices = [] } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices
  });
  
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const offlineDevices = devices.filter(d => d.status === 'offline' || d.status === 'error').length;
  
  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 12;
      mapRef.current.setZoom(currentZoom + 1);
    } else {
      toast.error("Map is not available");
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom() || 12;
      mapRef.current.setZoom(Math.max(currentZoom - 1, 1));
    } else {
      toast.error("Map is not available");
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (mapRef.current) {
            mapRef.current.panTo(pos);
            mapRef.current.setZoom(14);
            toast.success("Location found");
          }
        },
        () => {
          toast.error("Error getting your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Device Map</h1>
          
          <div className="flex items-center space-x-4 sm:w-72">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search devices..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Geographical View</CardTitle>
                <CardDescription>
                  View and monitor your devices on the map
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                  <span className="sr-only">Zoom In</span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                  <span className="sr-only">Zoom Out</span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleLocateMe}>
                  <LocateFixed className="h-4 w-4" />
                  <span className="sr-only">Current Location</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <MapView className="rounded-none h-[70vh]" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Devices</p>
                  <p className="text-2xl font-bold">{devices.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Online</p>
                  <p className="text-2xl font-bold">{onlineDevices}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-2xl font-bold">{warningDevices}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Offline</p>
                  <p className="text-2xl font-bold">{offlineDevices}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
