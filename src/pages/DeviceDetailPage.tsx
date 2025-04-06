
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDeviceById, sendCommand, deleteDevice } from '@/services/deviceService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Imported components
import DeviceHeader from '@/components/device-detail/DeviceHeader';
import DeviceStatusCard from '@/components/device-detail/DeviceStatusCard';
import OverviewTab from '@/components/device-detail/tabs/OverviewTab';
import ControlTab from '@/components/device-detail/tabs/ControlTab';
import SettingsTab from '@/components/device-detail/tabs/SettingsTab';
import ErrorDisplay from '@/components/device-detail/tabs/ErrorDisplay';
import LoadingState from '@/components/device-detail/LoadingState';

const DeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  
  const { data: device, isLoading, error, refetch } = useQuery({
    queryKey: ['device', id],
    queryFn: () => getDeviceById(id!),
    enabled: !!id,
  });
  
  const handleSendCommand = async (command: string, params: any) => {
    if (!device) return;
    
    try {
      setIsSendingCommand(true);
      await sendCommand(device.id, command, params);
      refetch();
    } catch (error) {
      console.error('Failed to send command:', error);
    } finally {
      setIsSendingCommand(false);
    }
  };
  
  const handleDeleteDevice = async () => {
    if (!device) return;
    
    if (isConfirmingDelete) {
      try {
        await deleteDevice(device.id);
        navigate('/devices');
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    } else {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error || !device) {
    return <ErrorDisplay />;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <DeviceHeader
        device={device}
        isLoading={isLoading}
        onRefresh={refetch}
        onDelete={handleDeleteDevice}
        isConfirmingDelete={isConfirmingDelete}
        setIsConfirmingDelete={setIsConfirmingDelete}
      />
      
      <DeviceStatusCard device={device} />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            device={device}
            onSendCommand={handleSendCommand}
            isSendingCommand={isSendingCommand}
          />
        </TabsContent>
        
        <TabsContent value="control">
          <ControlTab
            device={device}
            isSendingCommand={isSendingCommand}
            onSendCommand={handleSendCommand}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab
            device={device}
            isConfirmingDelete={isConfirmingDelete}
            onDeleteDevice={handleDeleteDevice}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceDetailPage;
