
import React from 'react';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatterFunction: (dataKey: string, value: number) => string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ 
  active, 
  payload, 
  label,
  formatterFunction 
}) => {
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
              <span className="font-medium">{formatterFunction(entry.dataKey, entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
