import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, QrCode, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { registerDevice } from '@/services/deviceService';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

// Activation method types
type ActivationMethod = 'OTAA' | 'ABP';

// ABP Parameters interface
interface ABPParams {
  devAddr: string;
  nwkSKey: string;
  appSKey: string;
}

// OTAA Parameters interface
interface OTAAParams {
  appEUI: string;
  devEUI: string;
  appKey: string;
}

const RegisterDevicePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activationMethod, setActivationMethod] = useState<ActivationMethod>('OTAA');
  
  // OTAA parameters
  const [otaaParams, setOtaaParams] = useState<OTAAParams>({
    appEUI: '',
    devEUI: '',
    appKey: ''
  });
  
  // ABP parameters
  const [abpParams, setAbpParams] = useState<ABPParams>({
    devAddr: '',
    nwkSKey: '',
    appSKey: ''
  });
  
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
  
  // Update OTAA parameters
  const updateOTAAParam = (key: keyof OTAAParams, value: string) => {
    setOtaaParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Update ABP parameters
  const updateABPParam = (key: keyof ABPParams, value: string) => {
    setAbpParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (step === 1 && (!deviceData.name || !deviceData.type)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (step === 3) {
      if (activationMethod === 'OTAA' && 
         (!otaaParams.appEUI || !otaaParams.devEUI || !otaaParams.appKey)) {
        toast.error('Please fill in all OTAA parameters');
        return;
      }
      
      if (activationMethod === 'ABP' && 
         (!abpParams.devAddr || !abpParams.nwkSKey || !abpParams.appSKey)) {
        toast.error('Please fill in all ABP parameters');
        return;
      }
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
      
      // Combine device data with activation parameters
      const registrationData = {
        ...deviceData,
        activationMethod,
        activationParams: activationMethod === 'OTAA' ? otaaParams : abpParams
      };
      
      const newDevice = await registerDevice(registrationData);
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
                      <SelectItem value="gateway">Gateway</SelectItem>
                      <SelectItem value="tracker">Tracker</SelectItem>
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
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Activation Method</Label>
                  <RadioGroup 
                    value={activationMethod} 
                    onValueChange={(value) => setActivationMethod(value as ActivationMethod)}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTAA" id="otaa" />
                      <Label htmlFor="otaa" className="font-medium">OTAA (Over-the-Air Activation)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ABP" id="abp" />
                      <Label htmlFor="abp" className="font-medium">ABP (Activation By Personalization)</Label>
                    </div>
                  </RadioGroup>
                  
                  <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      {activationMethod === 'OTAA' 
                        ? 'OTAA is more secure and allows for key regeneration. Devices perform a join procedure with the network.' 
                        : 'ABP uses pre-configured keys and doesn\'t require a join procedure. Simpler but less secure than OTAA.'}
                    </p>
                  </div>
                </div>
                
                <Tabs value={activationMethod} onValueChange={(v) => setActivationMethod(v as ActivationMethod)}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="OTAA">OTAA Parameters</TabsTrigger>
                    <TabsTrigger value="ABP">ABP Parameters</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="OTAA" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="appEUI">Application EUI</Label>
                      <Input 
                        id="appEUI" 
                        placeholder="e.g., 70B3D57ED0000001"
                        value={otaaParams.appEUI}
                        onChange={(e) => updateOTAAParam('appEUI', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="devEUI">Device EUI</Label>
                      <Input 
                        id="devEUI" 
                        placeholder="e.g., A8404194A1B43019"
                        value={otaaParams.devEUI}
                        onChange={(e) => updateOTAAParam('devEUI', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="appKey">Application Key</Label>
                      <Input 
                        id="appKey" 
                        placeholder="e.g., 11B0282A189B75B0B4D2D8C7FA38548B"
                        value={otaaParams.appKey}
                        onChange={(e) => updateOTAAParam('appKey', e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ABP" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="devAddr">Device Address</Label>
                      <Input 
                        id="devAddr" 
                        placeholder="e.g., 26011D83"
                        value={abpParams.devAddr}
                        onChange={(e) => updateABPParam('devAddr', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nwkSKey">Network Session Key</Label>
                      <Input 
                        id="nwkSKey" 
                        placeholder="e.g., 7959294F19B037889A6F54428B482ABC"
                        value={abpParams.nwkSKey}
                        onChange={(e) => updateABPParam('nwkSKey', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="appSKey">Application Session Key</Label>
                      <Input 
                        id="appSKey" 
                        placeholder="e.g., 2B7E151628AED2A6ABF7158809CF4F3C"
                        value={abpParams.appSKey}
                        onChange={(e) => updateABPParam('appSKey', e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {step === 4 && (
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
                    <p className="text-sm text-muted-foreground">Activation Method</p>
                    <p className="font-medium">{activationMethod}</p>
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
            
            {step < 4 ? (
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
  );
};

export default RegisterDevicePage;
