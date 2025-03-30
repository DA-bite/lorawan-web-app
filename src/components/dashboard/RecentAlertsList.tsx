
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Device } from '@/services/device';

interface RecentAlertsListProps {
  devices: Device[] | undefined;
}

export const RecentAlertsList: React.FC<RecentAlertsListProps> = ({ devices }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Alerts</CardTitle>
          <Link to="/alerts">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View All
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {devices && devices.some(d => d.status === 'warning' || d.status === 'error') ? (
          <div className="space-y-2">
            {devices
              .filter(d => d.status === 'warning' || d.status === 'error')
              .slice(0, 5)
              .map(device => (
                <Link key={device.id} to={`/devices/${device.id}`}>
                  <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                    <div className="flex items-center">
                      {device.status === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <div>
                        <span className="font-medium">{device.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {device.status === 'warning' ? 'Warning' : 'Error'}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))
            }
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-muted-foreground">No active alerts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
