
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Map, Bell, Settings, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { navigationItems } from './Sidebar';

const BottomNavbar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background shadow-lg z-30 animate-slide-in-bottom">
      <div className="grid grid-cols-6 w-full h-16">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-1 transition-all duration-200",
              "active:bg-accent/30 hover:text-primary",
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={t(item.nameKey)}
          >
            <div className="flex items-center justify-center w-7 h-7 mb-0.5">
              {React.cloneElement(item.icon as React.ReactElement, { 
                className: "h-5 w-5",
                strokeWidth: location.pathname === item.path ? 2.5 : 2
              })}
            </div>
            <span className="text-[10px] font-medium text-center px-0.5 truncate w-full">
              {t(item.nameKey)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
