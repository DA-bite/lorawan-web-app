import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/services/deviceService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { useIsMobile } from '@/hooks/use-mobile';

const DateRangePicker: React.FC = () => {
  return (
    <div className="flex space-x-2">
      <Select defaultValue="last24h">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last24h">Last 24 hours</SelectItem>
          <SelectItem value="last7d">Last 7 days</SelectItem>
          <SelectItem value="last30d">Last 30 days</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const AnalyticsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
  
  const selectedDevice = devices?.find(d => d.id === selectedDeviceId) || devices?.[0];
  
  const batteryData = selectedDevice ? Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    battery: Math.max(1, selectedDevice.battery - i * (Math.random() * 0.5)),
    signal: Math.max(10, selectedDevice.signal - i * (Math.random() * 0.7))
  })).reverse() : [];
  
  const sensorData = selectedDevice?.data?.history || [];
  
  const sensorDataKeys = sensorData.length > 0
    ? Object.keys(sensorData[0]).filter(key => key !== 'timestamp')
    : [];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <DateRangePicker />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-full sm:w-auto sm:min-w-[250px]">
          <Select 
            value={selectedDeviceId} 
            onValueChange={setSelectedDeviceId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {devices?.map(device => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {selectedDevice && (
            <span>Device Type: <span className="font-medium capitalize">{selectedDevice.type}</span></span>
          )}
        </div>
      </div>
      
      {!selectedDevice ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No device selected</h3>
          <p className="text-muted-foreground mt-2">
            Select a device to view analytics
          </p>
        </div>
      ) : (
        <Tabs defaultValue="systemMetrics" className="w-full">
          <TabsList className="grid grid-cols-2 sm:w-[400px]">
            <TabsTrigger value="systemMetrics">System Metrics</TabsTrigger>
            <TabsTrigger value="sensorData">Sensor Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="systemMetrics" className="pt-4 space-y-6">
            <div className={isMobile ? "w-full overflow-hidden" : ""}>
              <DeviceLineChart
                title="Battery & Signal Strength"
                data={batteryData}
                dataKeys={['battery', 'signal']}
                colors={['#10b981', '#3b82f6']}
                yAxisLabel="Percentage (%)"
                tooltipFormatter={(value) => `${value.toFixed(1)}%`}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packets Sent</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packets Received</span>
                      <span className="font-medium">243</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packet Loss</span>
                      <span className="font-medium">1.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average RSSI</span>
                      <span className="font-medium">-72 dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average SNR</span>
                      <span className="font-medium">9.2 dB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Power Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery Level</span>
                      <span className="font-medium">{selectedDevice.battery}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery Voltage</span>
                      <span className="font-medium">3.7V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Power Consumption</span>
                      <span className="font-medium">12.4 mA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Battery Life</span>
                      <span className="font-medium">14 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Power Mode</span>
                      <span className="font-medium">Normal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sensorData" className="pt-4 space-y-6">
            {sensorDataKeys.length > 0 ? (
              <>
                <div className={isMobile ? "w-full overflow-hidden" : ""}>
                  <DeviceLineChart
                    title="Sensor Readings"
                    data={sensorData}
                    dataKeys={sensorDataKeys}
                  />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {sensorDataKeys.map(key => {
                        const values = sensorData.map(d => d[key]).filter(v => typeof v === 'number');
                        const min = Math.min(...values);
                        const max = Math.max(...values);
                        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
                        
                        return (
                          <div key={key} className="space-y-2 p-3 border rounded-md">
                            <h4 className="font-medium capitalize">{key}</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Min</span>
                                <span>{min.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Max</span>
                                <span>{max.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Average</span>
                                <span>{avg.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No sensor data available</h3>
                <p className="text-muted-foreground mt-2">
                  This device doesn't have any sensor data or history to display
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AnalyticsPage;
