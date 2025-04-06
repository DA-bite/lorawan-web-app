
// Utility functions for charts

// Get Y-axis label based on data key
export const getYAxisLabelForKey = (key: string): string => {
  if (key.includes('temperature')) return 'Temperature (°C)';
  if (key.includes('humidity')) return 'Humidity (%)';
  if (key.includes('battery')) return 'Battery (%)';
  if (key.includes('signal')) return 'Signal Strength';
  return '';
};

// Get tooltip formatter based on data key
export const getTooltipFormatterForKey = (key: string) => {
  if (key.includes('temperature')) return (value: number) => `${value.toFixed(1)}°C`;
  if (key.includes('humidity')) return (value: number) => `${value.toFixed(1)}%`;
  if (key.includes('battery')) return (value: number) => `${value.toFixed(0)}%`;
  if (key.includes('signal')) return (value: number) => `${value.toFixed(0)}`;
  return (value: number) => `${value.toFixed(1)}`;
};

// Format data with timestamps
export const formatChartData = (
  data: Array<{ timestamp: string; [key: string]: any }>, 
  timeFormat: string,
  dateFilter: Date | null
) => {
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

  // Format filtered data with formatted time
  return filteredData.map(item => ({
    ...item,
    formattedTime: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
};
