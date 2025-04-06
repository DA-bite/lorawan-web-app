
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';

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

  // Filter data by selected date if dateFilter is provided
  const filteredData = dateFilter 
    ? data.filter(item => {
        const itemDate = new Date(item.timestamp);
        return (
          itemDate.getFullYear() === dateFilter.getFullYear() &&
          itemDate.getMonth() === dateFilter.getMonth() &&
          itemDate.getDate() === dateFilter.getDate()
        );
      })
    : data;

  // Format time for display
  const formattedData = filteredData.map(item => ({
    ...item,
    formattedTime: format(parseISO(item.timestamp), timeFormat)
  }));

  // Generate Y-axis label based on selected data key
  const getYAxisLabelForKey = (key: string) => {
    if (key.includes('temperature')) return 'Temperature (°C)';
    if (key.includes('humidity')) return 'Humidity (%)';
    if (key.includes('battery')) return 'Battery (%)';
    if (key.includes('signal')) return 'Signal Strength';
    return yAxisLabel || '';
  };

  // Get tooltip formatter based on selected data key
  const getTooltipFormatterForKey = (key: string) => {
    if (key.includes('temperature')) return (value: number) => `${value.toFixed(1)}°C`;
    if (key.includes('humidity')) return (value: number) => `${value.toFixed(1)}%`;
    if (key.includes('battery')) return (value: number) => `${value.toFixed(0)}%`;
    if (key.includes('signal')) return (value: number) => `${value.toFixed(0)}`;
    return tooltipFormatter;
  };

  // Get the color for the selected data key
  const getColorForKey = (key: string) => {
    const index = dataKeys.indexOf(key);
    return colors[index % colors.length];
  };

  // These handlers need to be updated to match the correct types
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Handle data key selection
  const handleDataKeyChange = (value: string) => {
    setSelectedDataKey(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm shadow-lg rounded-md p-3 border border-border text-sm">
          <p className="font-medium mb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center">
                <div 
                  className="h-2 w-2 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="mr-2 text-muted-foreground capitalize">{entry.name}:</span>
                <span className="font-medium">{getTooltipFormatterForKey(entry.dataKey)(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // No data display
  if (formattedData.length === 0) {
    return (
      <Card className="overflow-hidden h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex items-center justify-center h-64">
          <p className="text-muted-foreground">No data available for the selected date</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          
          {dataKeys.length > 1 && (
            isMobile ? (
              <Select 
                value={selectedDataKey}
                onValueChange={handleDataKeyChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  {dataKeys.map(key => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: getColorForKey(key) }}
                        />
                        <span className="capitalize">{key}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <ToggleGroup 
                type="single" 
                value={selectedDataKey}
                onValueChange={(value) => value && handleDataKeyChange(value)}
                className="justify-start"
              >
                {dataKeys.map((key, index) => (
                  <ToggleGroupItem 
                    key={key} 
                    value={key}
                    className="px-3 py-1 text-xs font-medium capitalize"
                    style={{ 
                      borderColor: colors[index % colors.length],
                      color: selectedDataKey === key ? 'white' : colors[index % colors.length],
                      backgroundColor: selectedDataKey === key ? colors[index % colors.length] : 'transparent'
                    }}
                  >
                    {key}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )
          )}
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
                  value: getYAxisLabelForKey(selectedDataKey), 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 0,
                  style: { textAnchor: 'middle', fontSize: 10, fill: 'var(--muted-foreground)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
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
