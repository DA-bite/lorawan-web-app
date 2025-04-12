
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapErrorDisplayProps {
  className?: string;
  onReset: () => void;
}

const MapErrorDisplay: React.FC<MapErrorDisplayProps> = ({ className, onReset }) => {
  const { t } = useLanguage();
  
  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg", className)}>
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-800">{t('map_could_not_load')}</h3>
      <p className="text-sm text-gray-600 mt-2 mb-4 text-center">{t('check_connection')}</p>
      <Button variant="outline" onClick={onReset}>
        {t('enter_mapbox_token')}
      </Button>
    </div>
  );
};

export default MapErrorDisplay;
