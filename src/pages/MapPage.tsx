
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';

// Mock map component (in a real app, you'd use a mapping library)
const MapView: React.FC<{ devices: Device[], selectedDevice: string | null, onSelectDevice: (id: string) => void }> = ({ 
  devices, 
  selectedDevice,
  onSelectDevice 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // This is a placeholder for actual map implementation
  // In a real app, you would use a library like leaflet, mapbox or google maps
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create map visualization
    const mapElement = mapRef.current;
    mapElement.innerHTML = '';
    
    // Create a mock/simplified map view for demonstration
    const mapContainer = document.createElement('div');
    mapContainer.className = 'relative w-full h-full rounded-lg bg-accent/30 overflow-hidden';
    
    // Add grid lines to simulate a map
    for (let i = 0; i < 10; i++) {
      const horizontalLine = document.createElement('div');
      horizontalLine.className = 'absolute w-full h-px bg-border/30';
      horizontalLine.style.top = `${i * 10}%`;
      
      const verticalLine = document.createElement('div');
      verticalLine.className = 'absolute h-full w-px bg-border/30';
      verticalLine.style.left = `${i * 10}%`;
      
      mapContainer.appendChild(horizontalLine);
      mapContainer.appendChild(verticalLine);
    }
    
    // Add device markers
    devices.forEach(device => {
      // Normalize coordinates to fit our view
      const normalizedLat = ((device.location.lat - 37.75) / 0.04) * 80 + 10;
      const normalizedLng = ((device.location.lng - (-122.45)) / 0.04) * 80 + 10;
      
      const marker = document.createElement('div');
      marker.className = `absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer 
        ${device.id === selectedDevice ? 'animate-pulse-slow' : ''}`;
      marker.style.backgroundColor = 
        device.status === 'online' ? 'var(--status-online)' :
        device.status === 'warning' ? 'var(--status-warning)' : 
        device.status === 'error' ? 'var(--status-error)' : 
        'var(--status-offline)';
      marker.style.top = `${normalizedLat}%`;
      marker.style.left = `${normalizedLng}%`;
      marker.style.boxShadow = `0 0 0 2px white, 0 0 0 4px ${device.id === selectedDevice ? 'var(--primary)' : 'transparent'}`;
      
      marker.addEventListener('click', () => {
        onSelectDevice(device.id);
      });
      
      // Add pulse effect for selected device
      if (device.id === selectedDevice) {
        const pulse = document.createElement('div');
        pulse.className = 'absolute w-12 h-12 rounded-full animate-ping opacity-30';
        pulse.style.backgroundColor = 
          device.status === 'online' ? 'var(--status-online)' :
          device.status === 'warning' ? 'var(--status-warning)' : 
          device.status === 'error' ? 'var(--status-error)' : 
          'var(--status-offline)';
        pulse.style.top = '50%';
        pulse.style.left = '50%';
        pulse.style.transform = 'translate(-50%, -50%)';
        marker.appendChild(pulse);
      }
      
      mapContainer.appendChild(marker);
    });
    
    mapElement.appendChild(mapContainer);
  }, [devices, selectedDevice, onSelectDevice]);
  
  return (
    <div ref={mapRef} className="w-full h-[70vh] rounded-lg border border-border overflow-hidden bg-accent/10"></div>
  );
};

const MapPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSelectedDevice = queryParams.get('device');
  
  const [selectedDevice, setSelectedDevice] = useState<string | null>(initialSelectedDevice);
  
  // Fetch devices
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
  
  // Get selected device details
  const selectedDeviceData = devices?.find(d => d.id === selectedDevice);
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Map View</h1>
          
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search locations..."
              className="w-full pl-8 h-9 rounded-md border border-input bg-background text-sm ring-offset-background"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="w-full h-[70vh]" />
            ) : devices ? (
              <MapView 
                devices={devices} 
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-[70vh] border rounded-lg">
                <p>Failed to load map data</p>
              </div>
            )}
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Device Location</CardTitle>
                <CardDescription>
                  Select a device on the map to view details
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : selectedDeviceData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{selectedDeviceData.name}</h3>
                      <Badge 
                        className={
                          selectedDeviceData.status === 'online'
                            ? 'bg-status-online text-white'
                            : selectedDeviceData.status === 'warning'
                            ? 'bg-status-warning text-white'
                            : selectedDeviceData.status === 'error'
                            ? 'bg-status-error text-white'
                            : 'bg-status-offline text-white'
                        }
                      >
                        {selectedDeviceData.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 text-primary" />
                      <span>
                        {selectedDeviceData.location.lat.toFixed(4)}, {selectedDeviceData.location.lng.toFixed(4)}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      Last seen {formatDistanceToNow(new Date(selectedDeviceData.lastSeen), { addSuffix: true })}
                    </div>
                    
                    {selectedDeviceData.data && Object.entries(selectedDeviceData.data)
                      .filter(([key]) => key !== 'history' && typeof selectedDeviceData.data[key] !== 'object')
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key} className="border-t pt-2">
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          <div className="font-medium">
                            {typeof value === 'boolean'
                              ? (value ? 'Yes' : 'No')
                              : typeof value === 'number'
                              ? value.toFixed(1)
                              : String(value)}
                          </div>
                        </div>
                      ))}
                    
                    <div className="pt-4">
                      <Link to={`/devices/${selectedDeviceData.id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="font-medium mb-1">No Device Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a device on the map to view its details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
