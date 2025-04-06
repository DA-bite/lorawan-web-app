
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomTooltip from './components/CustomTooltip';
import ChartControls from './components/ChartControls';
import NoDataDisplay from './components/NoDataDisplay';
import { getYAxisLabelForKey, getTooltipFormatterForKey, formatChartData } from './utils/chartUtils';

interface DataPoint {
  timestamp: string;
  [key: string]: any;
}

interface DeviceLineChartProps {
  title: string;
  data: DataPoint[];
  dataKeys: string[];
  colors?: string[];
  timeFormat?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
  dateFilter?: Date | null;
}

const DeviceLineChart: React.FC<DeviceLineChartProps> = ({
  title,
  data,
  dataKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  timeFormat = 'HH:mm',
  yAxisLabel,
  tooltipFormatter = (value) => `${value}`,
  dateFilter = null
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedDataKey, setSelectedDataKey] = useState<string>(dataKeys[0]);
  const isMobile = window.innerWidth < 768;

  // Format data for display
  const formattedData = formatChartData(data, timeFormat, dateFilter);

  // Handle data key selection
  const handleDataKeyChange = (value: string) => {
    setSelectedDataKey(value);
  };

  // Get the color for the selected data key
  const getColorForKey = (key: string) => {
    const index = dataKeys.indexOf(key);
    return colors[index % colors.length];
  };

  // Update event handlers to use the correct type signature
  const handleMouseEnter = () => {
    // We're not using the event parameter directly
    setActiveIndex(1); // Just set a value to indicate hover state
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Get tooltip formatter function for a data key
  const getFormatterFunction = (dataKey: string, value: number) => {
    return getTooltipFormatterForKey(dataKey)(value);
  };

  // No data display
  if (formattedData.length === 0) {
    return <NoDataDisplay title={title} />;
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          
          <ChartControls 
            dataKeys={dataKeys}
            selectedDataKey={selectedDataKey}
            onDataKeyChange={handleDataKeyChange}
            colors={colors}
            isMobile={isMobile}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 5, left: 15, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis 
                dataKey="formattedTime" 
                tick={{ fontSize: 10 }}
                stroke="var(--muted-foreground)"
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={15}
                label={{ 
                  value: 'Time', 
                  position: 'insideBottom', 
                  offset: -10,
                  style: { fontSize: 10, fill: 'var(--muted-foreground)' }
                }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                label={{ 
                  value: getYAxisLabelForKey(selectedDataKey) || yAxisLabel || '', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 0,
                  style: { textAnchor: 'middle', fontSize: 10, fill: 'var(--muted-foreground)' }
                }}
              />
              <Tooltip content={<CustomTooltip formatterFunction={getFormatterFunction} />} />
              <Line
                type="monotone"
                dataKey={selectedDataKey}
                name={selectedDataKey}
                stroke={getColorForKey(selectedDataKey)}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5, strokeWidth: 1 }}
                animationDuration={1500}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceLineChart;
