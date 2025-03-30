
import React from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  lastUpdated: Date;
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ lastUpdated, onRefresh }) => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "Dashboard updated",
      description: "Latest data has been loaded",
    });
  };
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="flex items-center space-x-2">
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
        >
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};
