
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Device } from '@/services/device';

interface DeviceHeaderProps {
  device: Device;
  isLoading: boolean;
  onRefresh: () => void;
  onDelete: () => void;
  isConfirmingDelete: boolean;
  setIsConfirmingDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeviceHeader: React.FC<DeviceHeaderProps> = ({
  device,
  isLoading,
  onRefresh,
  onDelete,
  isConfirmingDelete,
  setIsConfirmingDelete
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/devices')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{device.name}</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {isConfirmingDelete ? 'Confirm' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};

export default DeviceHeader;
