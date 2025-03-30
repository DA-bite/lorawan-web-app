
import React from 'react';
import { Activity, CheckCircle, AlertTriangle, XCircle, Battery, Signal, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Device } from '@/services/device';

interface StatusCardsProps {
  devices: Device[] | undefined;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ devices }) => {
  // Device status counts
  const statusCount = {
    online: devices?.filter(d => d.status === 'online').length || 0,
    warning: devices?.filter(d => d.status === 'warning').length || 0,
    error: devices?.filter(d => d.status === 'error').length || 0,
    offline: devices?.filter(d => d.status === 'offline').length || 0,
  };
  
  // Device types counts
  const typeCount = {
    sensor: devices?.filter(d => d.type === 'sensor').length || 0,
    actuator: devices?.filter(d => d.type === 'actuator').length || 0,
  };
  
  // Battery level information
  const lowBatteryDevices = devices?.filter(d => d.battery < 20).length || 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="flex flex-col">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{devices?.length || 0}</div>
            <div className="bg-primary/10 text-primary p-2 rounded-full">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {typeCount.sensor} sensors, {typeCount.actuator} actuators
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Device Status</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
              <span className="text-muted-foreground">Online:</span>
              <span className="ml-1 font-medium">{statusCount.online}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1.5"></div>
              <span className="text-muted-foreground">Warning:</span>
              <span className="ml-1 font-medium">{statusCount.warning}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
              <span className="text-muted-foreground">Error:</span>
              <span className="ml-1 font-medium">{statusCount.error}</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-gray-300 mr-1.5"></div>
              <span className="text-muted-foreground">Offline:</span>
              <span className="ml-1 font-medium">{statusCount.offline}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{lowBatteryDevices}</div>
            <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-full">
              <Battery className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Devices with low battery
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{statusCount.warning + statusCount.error}</div>
            <div className="bg-red-500/10 text-red-500 p-2 rounded-full">
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <Link to="/alerts" className="hover:underline">View all alerts</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
