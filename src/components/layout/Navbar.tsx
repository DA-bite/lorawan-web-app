
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './MobileSidebar';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse-slow"></span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300" />
            )}
          </Button>
          
          {user ? (
            <div className="flex items-center space-x-1">
              <Link to="/profile">
                <Button variant="ghost" className="rounded-full overflow-hidden border h-8 w-8 p-0">
                  <span className="font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </Button>
              </Link>
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
