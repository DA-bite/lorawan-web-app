
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CheckCircle, Save, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Update state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  const handleSaveProfile = async () => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name }
      });
      
      if (updateError) throw updateError;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Manage your profile image
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="text-4xl bg-primary/10">
                {name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button variant="outline" className="w-full">
              Upload Photo
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                value={email} 
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSaveProfile}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
