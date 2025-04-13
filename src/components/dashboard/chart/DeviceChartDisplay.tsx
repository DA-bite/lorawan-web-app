
import React, { useEffect, useState } from 'react';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { Device, getDeviceMetricsForDate } from '@/services/device';
import { toast } from 'sonner';

interface DeviceChartDisplayProps {
  devices: Device[] | undefined;
  selectedDate: Date;
}

export const DeviceChartDisplay: React.FC<DeviceChartDisplayProps> = ({ 
  devices, 
  selectedDate 
}) => {
  const isMobile = useIsMobile();
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchDeviceData = async () => {
      if (!devices || devices.length === 0) return;
      
      try {
        setIsLoading(true);
        // Get metrics for first device
        const metrics = await getDeviceMetricsForDate(devices[0].id, selectedDate);
        
        if (metrics.length > 0) {
          setDeviceData(metrics);
        } else {
          // Fallback to generateDemoData when no metrics are available
          import('./deviceDataGenerator').then(module => {
            const demoData = module.generateDemoData(selectedDate, devices[0].id);
            setDeviceData(demoData);
          });
        }
      } catch (error) {
        console.error('Error fetching device metrics:', error);
        toast.error('Failed to fetch device metrics');
        
        // Fallback to generateDemoData when there's an error
        import('./deviceDataGenerator').then(module => {
          const demoData = module.generateDemoData(selectedDate, devices[0].id);
          setDeviceData(demoData);
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceData();
  }, [devices, selectedDate]);
  
  if (isLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading device data...</p>
      </div>
    );
  }
  
  if (!devices || devices.length === 0 || deviceData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">No device data available</p>
      </div>
    );
  }
  
  return (
    <div className={isMobile ? "w-full overflow-hidden" : ""}>
      <DeviceLineChart
        title="Device Metrics"
        data={deviceData}
        dataKeys={['temperature', 'humidity', 'battery', 'signal']}
        yAxisLabel="Value"
        tooltipFormatter={(value) => `${value.toFixed(1)}`}
        dateFilter={selectedDate}
      />
    </div>
  );
};
