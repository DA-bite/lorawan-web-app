
import React from 'react';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';
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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  time: string;
  read: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
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
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-default",
                  !notification.read && "bg-muted/50"
                )}
                onClick={() => onMarkAsRead(notification.id)}
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
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
