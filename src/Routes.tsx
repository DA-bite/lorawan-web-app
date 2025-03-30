
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import DashboardPage from '@/pages/DashboardPage';
import DevicesPage from '@/pages/DevicesPage';
import DeviceDetailPage from '@/pages/DeviceDetailPage';
import RegisterDevicePage from '@/pages/RegisterDevicePage';
import MapPage from '@/pages/MapPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AlertsPage from '@/pages/AlertsPage';
import SettingsPage from '@/pages/SettingsPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';

// Layout
import Layout from '@/components/layout/Layout';

const Routes: React.FC = () => {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with layout */}
      <Route element={<Layout><Outlet /></Layout>}>
        <Route 
          path="/dashboard" 
          element={user ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/devices" 
          element={user ? <DevicesPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/devices/:deviceId" 
          element={user ? <DeviceDetailPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/devices/register" 
          element={user ? <RegisterDevicePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/map" 
          element={user ? <MapPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analytics" 
          element={user ? <AnalyticsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/alerts" 
          element={user ? <AlertsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <SettingsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <ProfilePage /> : <Navigate to="/login" />} 
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

export default Routes;
