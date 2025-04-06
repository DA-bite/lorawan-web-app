
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoDataDisplayProps {
  title: string;
}

const NoDataDisplay: React.FC<NoDataDisplayProps> = ({ title }) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available for the selected date</p>
      </CardContent>
    </Card>
  );
};

export default NoDataDisplay;
