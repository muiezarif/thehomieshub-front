
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Upload, Users, DollarSign, Settings, Video, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import MonetizationTab from '@/components/CreatorStudio/MonetizationTab';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';

const CreatorStudioPage = ({ onLoginRequest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    // Redirect or show login prompt if accessing directly
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold">Creator Studio Access</h2>
        <p className="text-muted-foreground">You must be logged in to access the Creator Studio.</p>
        <Button onClick={onLoginRequest}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Creator Studio</h1>
            <p className="text-muted-foreground mt-1">Manage your content, analytics, and earnings all in one place.</p>
          </div>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>

      <Tabs defaultValue="monetization" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.2K</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,240.50</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">+2.4% from last month</p>
              </CardContent>
            </Card>
          </div>
          
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Content Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Chart Placeholder (Analytics)
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Comments</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                         <div className="flex items-start gap-4 text-sm">
                             <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                             <div>
                                 <p className="font-semibold">user123</p>
                                 <p className="text-muted-foreground">Great video! Keep it up.</p>
                             </div>
                         </div>
                         <div className="flex items-start gap-4 text-sm">
                             <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
                             <div>
                                 <p className="font-semibold">travel_fan</p>
                                 <p className="text-muted-foreground">Where is this location?</p>
                             </div>
                         </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Content Library</CardTitle>
                    <CardDescription>Manage your videos, posts, and Moments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Content management tools would go here.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="monetization">
          <MonetizationTab />
        </TabsContent>

        <TabsContent value="settings">
             <Card>
                <CardHeader>
                    <CardTitle>Studio Settings</CardTitle>
                    <CardDescription>Manage notifications and studio preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>General settings configuration.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorStudioPage;
