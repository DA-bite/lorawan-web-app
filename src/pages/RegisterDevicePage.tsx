
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, QrCode, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { registerDevice } from '@/services/deviceService';

const RegisterDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceData, setDeviceData] = useState({
    name: '',
    type: '',
    location: {
      lat: 37.7749,
      lng: -122.4194
    }
  });
  
  // Update device data
  const updateDeviceData = (key: string, value: any) => {
    setDeviceData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle location change
  const updateLocation = (key: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setDeviceData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: numValue
        }
      }));
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (step === 1 && (!deviceData.name || !deviceData.type)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setStep(prev => prev + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Handle device registration
  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const newDevice = await registerDevice(deviceData);
      toast.success('Device registered successfully');
      navigate(`/devices/${newDevice.id}`);
    } catch (error) {
      toast.error('Failed to register device');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/devices')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Register New Device</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Device Registration</CardTitle>
              <CardDescription>
                Connect a new LoRaWAN device to your network
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Device Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter device name"
                      value={deviceData.name}
                      onChange={(e) => updateDeviceData('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Device Type</Label>
                    <Select 
                      value={deviceData.type}
                      onValueChange={(value) => updateDeviceData('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sensor">Sensor</SelectItem>
                        <SelectItem value="actuator">Actuator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Device Location</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                        <Input 
                          id="latitude" 
                          placeholder="Latitude"
                          value={deviceData.location.lat}
                          onChange={(e) => updateLocation('lat', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                        <Input 
                          id="longitude" 
                          placeholder="Longitude"
                          value={deviceData.location.lng}
                          onChange={(e) => updateLocation('lng', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <QrCode className="h-24 w-24 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-medium mb-2">Scan Device QR Code</h3>
                    <p className="text-muted-foreground">
                      Please scan the QR code on your LoRaWAN device to continue
                    </p>
                    
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => nextStep()}
                      >
                        Manual Setup
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <h3 className="text-lg font-medium mb-2">Device Information</h3>
                    <p className="text-muted-foreground text-sm">
                      Review and confirm your device details
                    </p>
                  </div>
                  
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Device Name</p>
                        <p className="font-medium">{deviceData.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Device Type</p>
                        <p className="font-medium capitalize">{deviceData.type}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {deviceData.location.lat.toFixed(4)}, {deviceData.location.lng.toFixed(4)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Network Configuration</p>
                      <p className="font-medium">LoRaWAN v1.0.4</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                >
                  Back
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/devices')}
                >
                  Cancel
                </Button>
              )}
              
              {step < 3 ? (
                <Button onClick={nextStep}>Next</Button>
              ) : (
                <Button 
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Device'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterDevicePage;
