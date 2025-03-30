
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardFooter: React.FC = () => {
  return (
    <div className="flex justify-center md:justify-end">
      <Link to="/devices/register">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Register New Device
        </Button>
      </Link>
    </div>
  );
};
