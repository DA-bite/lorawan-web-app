
import React from 'react';
import DeviceLineChart from '@/components/charts/DeviceLineChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateDemoData } from './deviceDataGenerator';
import { Device } from '@/services/device';

interface DeviceChartDisplayProps {
  devices: Device[] | undefined;
  selectedDate: Date;
}

export const DeviceChartDisplay: React.FC<DeviceChartDisplayProps> = ({ 
  devices, 
  selectedDate 
}) => {
  const isMobile = useIsMobile();
  
  if (!devices || devices.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <p className="text-muted-foreground">No device data available</p>
      </div>
    );
  }

  // Generate demo data for the first device
  const singleDeviceData = generateDemoData(selectedDate, devices[0].id);
  
  return (
    <div className={isMobile ? "w-full overflow-hidden" : ""}>
      <DeviceLineChart
        title="Device Metrics"
        data={singleDeviceData}
        dataKeys={['temperature', 'humidity', 'battery', 'signal']}
        yAxisLabel="Value"
        tooltipFormatter={(value) => `${value.toFixed(1)}`}
        dateFilter={selectedDate}
      />
    </div>
  );
};
