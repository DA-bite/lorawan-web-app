
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navigationItems } from './Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Close sidebar when location changes
  useEffect(() => {
    onClose();
  }, [location, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-background shadow-xl animate-slide-in-left overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-primary font-bold text-xl">LoRaWatchdog</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <nav className="p-4 space-y-1">
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
              onClick={onClose}
            >
              {item.icon}
              <span className="ml-3">{t(item.nameKey)}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
