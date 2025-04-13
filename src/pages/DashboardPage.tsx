
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/services/device';
import { StatusCards } from '@/components/dashboard/StatusCards';
import { DeviceChartSection } from '@/components/dashboard/DeviceChartSection';
import { RecentDevicesList } from '@/components/dashboard/RecentDevicesList';
import { RecentAlertsList } from '@/components/dashboard/RecentAlertsList';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { initRealtimeSubscription } from '@/integrations/supabase/client';

const DashboardPage: React.FC = () => {
  // Fetch devices with React Query for automatic refresh
  const { data: devices, isLoading, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    refetchOnWindowFocus: true,
    staleTime: 60000, // Consider data stale after 1 minute
  });
  
  // Initialize real-time subscription
  useEffect(() => {
    // Set up real-time listener that refreshes data when changes occur
    const cleanup = initRealtimeSubscription(() => {
      refetch();
    });
    
    return cleanup;
  }, [refetch]);
  
  // Last updated time
  const lastUpdated = new Date();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-destructive">Failed to load dashboard data</h3>
        <p className="text-muted-foreground mt-2">
          Please try refreshing the page
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader lastUpdated={lastUpdated} onRefresh={refetch} />
      
      <StatusCards devices={devices} />
      
      <DeviceChartSection devices={devices} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentDevicesList devices={devices} />
        <RecentAlertsList devices={devices} />
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default DashboardPage;
