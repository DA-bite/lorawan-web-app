
import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export type ErrorSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface DeviceError {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  code: string;
  severity: ErrorSeverity;
  details?: string;
  suggestions?: string[];
}

interface DeviceErrorDisplayProps {
  error: DeviceError;
  className?: string;
}

const DeviceErrorDisplay: React.FC<DeviceErrorDisplayProps> = ({ error, className }) => {
  const getIcon = () => {
    switch (error.severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };
  
  const getSeverityClass = () => {
    switch (error.severity) {
      case 'critical':
        return 'border-destructive/20 bg-destructive/10';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      default:
        return 'border-destructive/20 bg-destructive/10';
    }
  };
  
  const getTitle = () => {
    switch (error.severity) {
      case 'critical':
        return 'Critical Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      case 'success':
        return 'Success';
      default:
        return 'Error';
    }
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  return (
    <Card className={`${getSeverityClass()} ${className || ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {getIcon()}
          <span className="ml-2">{getTitle()}: {error.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Error Code:</span>
          <span>{error.code}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Timestamp:</span>
          <span>{formatDate(error.timestamp)}</span>
        </div>
        <div className="text-sm">
          <p className="font-medium mb-1">Message:</p>
          <p>{error.message}</p>
        </div>
        {error.details && (
          <div className="text-sm">
            <p className="font-medium mb-1">Details:</p>
            <p className="whitespace-pre-wrap">{error.details}</p>
          </div>
        )}
        {error.suggestions && error.suggestions.length > 0 && (
          <div className="text-sm mt-3">
            <p className="font-medium mb-1">Suggested Actions:</p>
            <ul className="list-disc list-inside space-y-1">
              {error.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceErrorDisplay;
