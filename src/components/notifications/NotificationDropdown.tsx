
import React, { useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Notification,
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/services/notification';

const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use React Query to fetch and cache notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Mutations for updating notifications
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
  
  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };
  
  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.deviceId) {
      navigate(`/devices/${notification.deviceId}`);
    }
  };
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t('notifications')}</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? t('processing') : t('mark_all_as_read')}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">{t('loading')}</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer",
                  !notification.read && "bg-muted/50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-center w-full">
                  <div className="mr-2">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {notification.time}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">{t('no_notifications')}</p>
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
