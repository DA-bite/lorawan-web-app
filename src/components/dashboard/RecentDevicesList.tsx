
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Device } from '@/services/device';

interface RecentDevicesListProps {
  devices: Device[] | undefined;
}

export const RecentDevicesList: React.FC<RecentDevicesListProps> = ({ devices }) => {  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Devices</CardTitle>
          <Link to="/devices">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {devices && devices.length > 0 ? (
          <div className="space-y-2">
            {devices.slice(0, 5).map(device => (
              <Link key={device.id} to={`/devices/${device.id}`}>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 
                      ${device.status === 'online' ? 'bg-green-500' : 
                        device.status === 'warning' ? 'bg-yellow-500' : 
                        device.status === 'error' ? 'bg-red-500' : 
                        'bg-gray-300'}`}
                    ></div>
                    <span className="font-medium">{device.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No devices found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
