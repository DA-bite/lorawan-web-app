import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import DeviceGrid from '@/components/devices/DeviceGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, RefreshCw, List, LayoutGrid, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DevicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch devices data
  const { data: devices, isLoading, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
  
  // Filter devices based on search query and filters
  const filteredDevices = devices?.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];
  
  // Group devices by status for tabs
  const devicesByStatus = {
    all: filteredDevices,
    online: filteredDevices.filter(d => d.status === 'online'),
    warning: filteredDevices.filter(d => d.status === 'warning'),
    error: filteredDevices.filter(d => d.status === 'error'),
    offline: filteredDevices.filter(d => d.status === 'offline')
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refetch()}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="shrink-0"
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
            <span className="sr-only">Change view</span>
          </Button>
          
          <Link to="/devices/register">
            <Button className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              Add Device
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-full md:w-[150px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sensor">Sensors</SelectItem>
                <SelectItem value="actuator">Actuators</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">More filters</span>
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">
            All ({devicesByStatus.all.length})
          </TabsTrigger>
          <TabsTrigger value="online">
            Online ({devicesByStatus.online.length})
          </TabsTrigger>
          <TabsTrigger value="warning">
            Warning ({devicesByStatus.warning.length})
          </TabsTrigger>
          <TabsTrigger value="error">
            Error ({devicesByStatus.error.length})
          </TabsTrigger>
          <TabsTrigger value="offline">
            Offline ({devicesByStatus.offline.length})
          </TabsTrigger>
        </TabsList>
        
        {(Object.keys(devicesByStatus) as Array<keyof typeof devicesByStatus>).map(status => (
          <TabsContent key={status} value={status} className="pt-4">
            <DeviceGrid 
              devices={devicesByStatus[status]} 
              isLoading={isLoading} 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DevicesPage;
