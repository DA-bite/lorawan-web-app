
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import GeneralTab from '@/components/settings/GeneralTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import AccountTab from '@/components/settings/AccountTab';

const SettingsPage: React.FC = () => {
  const { resetSettings, loadingSettings } = useSettings();
  const { t } = useLanguage();
  
  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">{t('loading')}</div>
      </div>
    );
  }
  
  const handleResetSettings = async () => {
    try {
      await resetSettings();
    } catch (error) {
      toast.error(t('settings_reset_failed'));
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="general">{t('general')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications_settings')}</TabsTrigger>
          <TabsTrigger value="account">{t('account_settings')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <GeneralTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-4">
          <AccountTab />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          className="mr-2"
        >
          {t('reset_to_defaults')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
