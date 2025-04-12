
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSidebar from './MobileSidebar';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
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

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'russian' : 'english');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur bg-background/90 glass transition-colors duration-300">
      <div className="flex h-16 items-center justify-between sm:px-6 px-0">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="ml-1"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t('menu')}</span>
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary font-bold text-xl">LoRaWatchdog</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <NotificationDropdown />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="active:scale-95 transition-transform">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setLanguage('english')}
                className={language === 'english' ? "bg-accent" : ""}
              >
                {t('english')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('russian')}
                className={language === 'russian' ? "bg-accent" : ""}
              >
                {t('russian')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="active:scale-95 transition-transform">
            {theme === 'dark' ? <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" /> : <Moon className="h-5 w-5 transition-transform duration-300" />}
            <span className="sr-only">{t('toggle_theme')}</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full overflow-hidden border h-9 w-9 p-0 active:scale-95 transition-transform">
                  <span className="font-medium text-sm">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  {t('profile_information')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  {t('settings')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('sign_out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="active:scale-95 transition-transform">
                {t('login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {isMobile && <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
    </header>
  );
};

export default Navbar;
