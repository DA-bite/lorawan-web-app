
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices, Device } from '@/services/deviceService';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Battery,
  Signal,
  Thermometer,
  Droplets,
  RefreshCw,
  Search,
  Settings,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

// Mock alerts data
const generateMockAlerts = (devices: Device[] | undefined) => {
  if (!devices || !devices.length) return [];
  
  // Generate more alerts than would normally be needed, 
  // so we have a reasonable list to work with
  const alertTypes = [
    { 
      type: 'error', 
      message: 'Device offline unexpectedly',
      icon: <XCircle className="h-4 w-4 text-status-error" />
    },
    { 
      type: 'error', 
      message: 'Battery critically low',
      icon: <Battery className="h-4 w-4 text-status-error" />
    },
    { 
      type: 'warning', 
      message: 'Battery low',
      icon: <Battery className="h-4 w-4 text-status-warning" />
    },
    { 
      type: 'warning', 
      message: 'Signal strength weak',
      icon: <Signal className="h-4 w-4 text-status-warning" />
    },
    { 
      type: 'warning', 
      message: 'Temperature above threshold',
      icon: <Thermometer className="h-4 w-4 text-status-warning" />
    },
    { 
      type: 'warning', 
      message: 'Moisture level high',
      icon: <Droplets className="h-4 w-4 text-status-warning" />
    }
  ];
  
  return devices
    .filter(d => d.status === 'warning' || d.status === 'error' || d.battery < 30)
    .flatMap(device => {
      // Create 1-3 alerts per qualifying device
      const numAlerts = Math.floor(Math.random() * 3) + 1;
      
      return Array.from({ length: numAlerts }, (_, i) => {
        const alertTypeIndex = device.status === 'error' 
          ? Math.floor(Math.random() * 2) // First 2 are errors
          : 2 + Math.floor(Math.random() * 4); // Next 4 are warnings
        
        const hoursAgo = Math.floor(Math.random() * 24);
        
        return {
          id: `${device.id}-${i}`,
          deviceId: device.id,
          deviceName: device.name,
          type: alertTypes[alertTypeIndex].type,
          message: alertTypes[alertTypeIndex].message,
          icon: alertTypes[alertTypeIndex].icon,
          timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
          acknowledged: Math.random() > 0.7
        };
      });
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const AlertsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Fetch devices
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
  
  // Generate mock alerts
  const alerts = generateMockAlerts(devices);
  
  // Filter alerts based on search and tab
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      selectedTab === 'all' || 
      (selectedTab === 'unacknowledged' && !alert.acknowledged) ||
      (selectedTab === 'error' && alert.type === 'error') ||
      (selectedTab === 'warning' && alert.type === 'warning');
    
    return matchesSearch && matchesTab;
  });
  
  // Group alerts by day
  const groupedAlerts: { [key: string]: typeof alerts } = {};
  filteredAlerts.forEach(alert => {
    const date = new Date(alert.timestamp).toLocaleDateString();
    if (!groupedAlerts[date]) {
      groupedAlerts[date] = [];
    }
    groupedAlerts[date].push(alert);
  });
  
  // Mark alert as acknowledged
  const acknowledgeAlert = (alertId: string) => {
    // In a real app, this would update the alert in the backend
    console.log('Acknowledging alert:', alertId);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-1" />
                Alert Settings
              </Link>
            </Button>
            
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">
              All ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="unacknowledged">
              Unacknowledged ({alerts.filter(a => !a.acknowledged).length})
            </TabsTrigger>
            <TabsTrigger value="error">
              Error ({alerts.filter(a => a.type === 'error').length})
            </TabsTrigger>
            <TabsTrigger value="warning">
              Warning ({alerts.filter(a => a.type === 'warning').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-4">
            <AlertsList 
              groupedAlerts={groupedAlerts} 
              onAcknowledge={acknowledgeAlert} 
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="unacknowledged" className="pt-4">
            <AlertsList 
              groupedAlerts={groupedAlerts} 
              onAcknowledge={acknowledgeAlert} 
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="error" className="pt-4">
            <AlertsList 
              groupedAlerts={groupedAlerts} 
              onAcknowledge={acknowledgeAlert} 
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="warning" className="pt-4">
            <AlertsList 
              groupedAlerts={groupedAlerts} 
              onAcknowledge={acknowledgeAlert} 
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface AlertsListProps {
  groupedAlerts: { [key: string]: any[] };
  onAcknowledge: (alertId: string) => void;
  isLoading: boolean;
}

const AlertsList: React.FC<AlertsListProps> = ({ groupedAlerts, onAcknowledge, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="py-2">
              <div className="h-5 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-16 bg-muted rounded"></div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (Object.keys(groupedAlerts).length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
        <h3 className="font-medium mb-1">No Alerts Found</h3>
        <p className="text-sm text-muted-foreground">
          There are currently no alerts matching your filters
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
        <Card key={date}>
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium">{date}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dateAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start flex-1">
                  <Checkbox 
                    checked={alert.acknowledged}
                    onCheckedChange={() => !alert.acknowledged && onAcknowledge(alert.id)} 
                    className="mt-1 mr-3"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Badge 
                        className={`mr-2 ${
                          alert.type === 'error' 
                            ? 'bg-status-error text-white' 
                            : 'bg-status-warning text-white'
                        }`}
                      >
                        {alert.type === 'error' ? 'Error' : 'Warning'}
                      </Badge>
                      <span className="font-medium">{alert.deviceName}</span>
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm">
                      {alert.icon}
                      <span className="ml-1">{alert.message}</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <Link 
                  to={`/devices/${alert.deviceId}`}
                  className="ml-4 text-primary hover:text-primary/80"
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AlertsPage;
