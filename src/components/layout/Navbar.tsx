
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './MobileSidebar';
import NotificationDropdown from '../notifications/NotificationDropdown';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Device Offline',
    message: 'Temperature Sensor #103 is offline for 15 minutes',
    type: 'error' as const,
    time: '10m ago',
    read: false,
    deviceId: '103' // Added deviceId
  },
  {
    id: '2',
    title: 'Low Battery Warning',
    message: 'Humidity Sensor #87 has low battery (15%)',
    type: 'warning' as const,
    time: '30m ago',
    read: false,
    deviceId: '87' // Added deviceId
  },
  {
    id: '3',
    title: 'Device Registered',
    message: 'New device "Gateway #5" has been registered successfully',
    type: 'success' as const,
    time: '2h ago',
    read: true,
    deviceId: '5' // Added deviceId
  },
  {
    id: '4',
    title: 'System Update',
    message: 'LoRaWAN server has been updated to version 2.5.0',
    type: 'info' as const,
    time: '1d ago',
    read: true
    // No deviceId as this is a system notification
  }
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur bg-background/90 glass transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="mr-2"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          )}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <span className="text-primary font-bold text-xl animate-fade-in">
              LoRaWatchdog
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <NotificationDropdown 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300" />
            )}
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                className="rounded-full overflow-hidden border h-8 w-8 p-0"
                onClick={() => navigate('/profile')}
              >
                <span className="font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
      
      {isMobile && (
        <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </header>
  );
};

export default Navbar;
