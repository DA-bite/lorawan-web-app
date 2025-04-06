
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ChartControlsProps {
  dataKeys: string[];
  selectedDataKey: string;
  onDataKeyChange: (value: string) => void;
  colors: string[];
  isMobile: boolean;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  dataKeys,
  selectedDataKey,
  onDataKeyChange,
  colors,
  isMobile
}) => {
  // Get color for a specific data key
  const getColorForKey = (key: string) => {
    const index = dataKeys.indexOf(key);
    return colors[index % colors.length];
  };

  if (dataKeys.length <= 1) {
    return null;
  }

  return isMobile ? (
    <Select 
      value={selectedDataKey}
      onValueChange={onDataKeyChange}
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
      onValueChange={(value) => value && onDataKeyChange(value)}
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
  );
};

export default ChartControls;
