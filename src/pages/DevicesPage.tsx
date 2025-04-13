
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/services/device/deviceReadService';
import DeviceGrid from '@/components/devices/DeviceGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DevicesPage: React.FC = () => {
  const { data: devices, isLoading, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });

  const handleDeviceDeleted = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
        <Link to="/register-device">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Register Device
          </Button>
        </Link>
      </div>

      <DeviceGrid 
        devices={devices || []} 
        isLoading={isLoading} 
        onDeviceDeleted={handleDeviceDeleted} 
      />
    </div>
  );
};

export default DevicesPage;

