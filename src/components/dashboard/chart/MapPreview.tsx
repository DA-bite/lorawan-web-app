
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const MapPreview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Device Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[200px] bg-muted rounded-md overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Link to="/map" className="absolute inset-0 flex items-center justify-center">
              <Button>
                <ArrowRight className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
