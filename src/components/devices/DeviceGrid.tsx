
import React from 'react';
import DeviceCard from './DeviceCard';
import { Device } from '@/services/deviceService';
import { Skeleton } from '@/components/ui/skeleton';

interface DeviceGridProps {
  devices: Device[];
  isLoading: boolean;
}

const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, isLoading }) => {
  // Create skeleton cards for loading state
  const skeletons = Array.from({ length: 6 }, (_, i) => (
    <div key={`skeleton-${i}`} className="animate-pulse">
      <Skeleton className="h-[300px] w-full rounded-md" />
    </div>
  ));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons}
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No devices found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or register a new device.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
};

export default DeviceGrid;
