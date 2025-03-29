
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MapTokenFormProps {
  className?: string;
  onTokenSubmit: (token: string) => void;
  defaultToken?: string;
}

const MAPBOX_TOKEN_KEY = 'mapbox_access_token';

const MapTokenForm: React.FC<MapTokenFormProps> = ({ 
  className, 
  onTokenSubmit,
  defaultToken = ""
}) => {
  // Try to get token from localStorage if not provided
  const initialToken = defaultToken || localStorage.getItem(MAPBOX_TOKEN_KEY) || "";
  const [apiKey, setApiKey] = React.useState<string>(initialToken);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter a valid Mapbox access token');
      return;
    }
    
    // Save the token to localStorage for future use
    localStorage.setItem(MAPBOX_TOKEN_KEY, apiKey);
    
    onTokenSubmit(apiKey);
    toast.success('API key applied. Loading map...');
  };

  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6", className)}>
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-4">Mapbox Access Token Required</h3>
      <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
        Please enter a valid Mapbox access token to display the map. You can get an access token from the 
        <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Mapbox Account page</a>.
      </p>
      <form onSubmit={handleApiKeySubmit} className="w-full max-w-md space-y-4">
        <Input 
          type="text" 
          placeholder="Enter Mapbox Access Token" 
          value={apiKey} 
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
        />
        <Button type="submit" className="w-full">
          Apply Access Token
        </Button>
      </form>
    </div>
  );
};

export default MapTokenForm;
