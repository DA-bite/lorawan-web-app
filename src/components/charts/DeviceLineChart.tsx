
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
}

const DeviceLineChart: React.FC<DeviceLineChartProps> = ({
  title,
  data,
  dataKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  timeFormat = 'HH:mm',
  yAxisLabel,
  tooltipFormatter = (value) => `${value}`
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Format time for display
  const formattedData = data.map(item => ({
    ...item,
    formattedTime: format(parseISO(item.timestamp), timeFormat)
  }));

  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
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
                <span className="mr-2 text-muted-foreground">{entry.name}:</span>
                <span className="font-medium">{tooltipFormatter(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex space-x-2">
            {dataKeys.map((key, index) => (
              <Badge 
                key={key} 
                variant="outline"
                className="text-xs"
                style={{ 
                  borderColor: colors[index % colors.length],
                  color: colors[index % colors.length]
                }}
              >
                {key}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis 
                dataKey="formattedTime" 
                tick={{ fontSize: 10 }}
                stroke="var(--muted-foreground)"
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="var(--muted-foreground)"
                tickLine={false}
                axisLine={false}
                label={yAxisLabel ? { 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 10, fill: 'var(--muted-foreground)' }
                } : undefined}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 5, strokeWidth: 1 }}
                  animationDuration={1500}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceLineChart;
