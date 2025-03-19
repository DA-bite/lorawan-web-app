
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <MapPin className="h-16 w-16 text-primary animate-bounce-slow" />
          </div>
          <div className="absolute top-12 left-[calc(50%-4rem)] w-8 h-8 rounded-full border-4 border-background bg-status-error animate-pulse"></div>
        </div>
        
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-medium">Device Not Found</h2>
        
        <p className="text-muted-foreground">
          The device or page you're looking for seems to be offline or doesn't exist.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/devices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Devices
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
