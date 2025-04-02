
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardFooter: React.FC = () => {
  return (
    <div className="flex justify-center w-full p-4 sm:p-0 sm:justify-end fixed bottom-16 right-4 sm:static sm:bottom-auto sm:right-auto">
      <Link to="/devices/register">
        <Button className="shadow-lg sm:shadow-none rounded-full sm:rounded-md h-14 w-14 sm:h-auto sm:w-auto p-0 sm:p-2">
          <Plus className="h-6 w-6 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="sr-only sm:not-sr-only">Register New Device</span>
        </Button>
      </Link>
    </div>
  );
};
