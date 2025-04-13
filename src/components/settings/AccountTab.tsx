
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const AccountTab: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success(t('signed_out_successfully'));
    } catch (error) {
      toast.error(t('sign_out_failed'));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('account_settings')}</CardTitle>
          <CardDescription>
            {t('manage_account_security')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>{t('email')}</Label>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
          
          <div className="pt-4 flex flex-col space-y-2">
            <Button variant="outline">{t('change_password')}</Button>
            <Button variant="outline">{t('update_profile')}</Button>
            <Button 
              variant="destructive" 
              className="mt-4 flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('sign_out')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
