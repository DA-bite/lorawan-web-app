
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Map, Bell, Settings, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  // Navigation items with translation keys
  const navigationItems = [
    { nameKey: 'dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { nameKey: 'devices', path: '/devices', icon: <List className="h-5 w-5" /> },
    { nameKey: 'analytics', path: '/analytics', icon: <BarChart className="h-5 w-5" /> },
    { nameKey: 'map_view', path: '/map', icon: <Map className="h-5 w-5" /> },
    { nameKey: 'alerts', path: '/alerts', icon: <Bell className="h-5 w-5" /> },
    { nameKey: 'settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 hidden md:flex flex-col border-r bg-background h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-foreground",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.icon}
              <span className="ml-3">{t(item.nameKey)}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Link to="/devices/register">
            <button className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              {t('register_device')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
