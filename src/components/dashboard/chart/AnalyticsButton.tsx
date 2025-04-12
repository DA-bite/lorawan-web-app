
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AnalyticsButton: React.FC = () => {
  return (
    <Link to="/analytics">
      <Button variant="ghost" size="sm" className="h-8 text-xs">
        View Analytics
        <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </Button>
    </Link>
  );
};
