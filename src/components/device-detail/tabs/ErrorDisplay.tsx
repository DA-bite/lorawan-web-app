
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorDisplay: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-destructive">Error Loading Device</h2>
      <p className="mt-2 text-muted-foreground">
        We couldn't find the device you're looking for.
      </p>
      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/devices')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Devices
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
