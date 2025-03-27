
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
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-3 w-full",
              "hover:text-primary transition-colors duration-200",
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={t(item.nameKey)}
          >
            {item.icon}
            <span className="text-xs mt-1">{t(item.nameKey)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
