
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30">
      <div className="grid grid-cols-6 w-full h-16">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1",
              "hover:text-primary transition-colors duration-200",
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={t(item.nameKey)}
          >
            <div className="flex items-center justify-center w-5 h-5">
              {React.cloneElement(item.icon as React.ReactElement, { 
                className: "h-4 w-4",
                strokeWidth: 2.5 
              })}
            </div>
            <span className="text-[10px] mt-1 text-center px-1 truncate w-full">
              {t(item.nameKey)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
