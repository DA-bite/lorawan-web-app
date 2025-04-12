
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface DatePickerControlProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const DatePickerControl: React.FC<DatePickerControlProps> = ({ 
  selectedDate, 
  onDateChange 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span className="whitespace-nowrap text-xs">{format(selectedDate, 'MMM dd, yyyy')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={(date) => onDateChange(date)}
          initialFocus
          disabled={(date) => date > new Date()}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};
