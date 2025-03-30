
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, Wifi, Activity, Shield, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to LoRaWatchdog
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Monitor and manage your IoT devices with real-time data tracking, analytics, and alerts.
              </p>
            </div>
            <div className="space-x-4">
              {user ? (
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/login">
                      Login
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/register">
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Key Features
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to monitor and manage your IoT network
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 py-8">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Radio className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Real-time Monitoring</h3>
                  <p className="text-muted-foreground text-center">
                    Track your devices in real-time with accurate data collection and analysis.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Wifi className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">LoRaWAN Compatible</h3>
                  <p className="text-muted-foreground text-center">
                    Works with any LoRaWAN device, providing long-range, low-power connectivity.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Activity className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Advanced Analytics</h3>
                  <p className="text-muted-foreground text-center">
                    Comprehensive analytics to understand device performance and network health.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Map className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Interactive Map</h3>
                  <p className="text-muted-foreground text-center">
                    Visualize all your devices on an interactive map for easy location tracking.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Shield className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Alert System</h3>
                  <p className="text-muted-foreground text-center">
                    Get notified about important events and anomalies through customizable alerts.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-12 w-12 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold">Customizable Settings</h3>
                  <p className="text-muted-foreground text-center">
                    Configure your dashboard and personalize settings to match your specific needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to get started?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join our platform today and start monitoring your IoT devices.
              </p>
            </div>
            <div className="space-x-4">
              {user ? (
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/register">
                      Sign Up Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="text-muted-foreground">
              <p>© 2025 LoRaWatchdog. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
