
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './MobileSidebar';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur bg-background/90 glass transition-colors duration-300">
      <div className="flex h-16 items-center justify-between sm:px-6 px-4">
        {/* Left section for menu toggle or logo */}
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)} 
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {/* Placeholder for logo or site title if needed */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Add logo or site title here if desired */}
          </Link>
        </div>
        
        {/* Centered title or placeholder */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          {/* You can add a dynamic page title here if needed */}
        </div>
        
        {/* Right section for actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <NotificationDropdown />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="active:scale-95 transition-transform"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300" />
            )}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-full overflow-hidden border h-9 w-9 p-0 active:scale-95 transition-transform"
                >
                  <span className="font-medium text-sm">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm" 
                className="active:scale-95 transition-transform"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {isMobile && (
        <MobileSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
    </header>
  );
};

export default Navbar;
