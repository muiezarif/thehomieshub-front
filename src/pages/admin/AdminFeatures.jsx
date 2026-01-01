import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeatures } from '@/contexts/FeatureContext';
import { useContent } from '@/contexts/ContentContext';
import { Search, Save, Settings, UserCog, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminFeatures = () => {
  const { globalFeatures, featureList, updateGlobalFeature, userRestrictions, updateUserRestriction } = useFeatures();
  const { users } = useContent();
  const { toast } = useToast();
  
  // User Search State
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleGlobalUpdate = (featureId, field, value) => {
    updateGlobalFeature(featureId, { [field]: value });
    toast({ title: "Feature Updated", description: "Global feature settings have been saved." });
  };

  const handleUserSearch = (e) => {
    const query = e.target.value;
    setUserSearch(query);
    if (query.length > 2) {
        // Find first match for prototype
        const found = Object.values(users).find(u => 
            u.username.toLowerCase().includes(query.toLowerCase()) || 
            u.email.toLowerCase().includes(query.toLowerCase())
        );
        if (found) setSelectedUser(found);
        else setSelectedUser(null);
    } else {
        setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Feature Management</h1>
        <p className="text-muted-foreground mt-1">Control visibility and access to app features globally or per-user.</p>
      </header>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="global"><Settings className="mr-2 h-4 w-4" /> Global Features</TabsTrigger>
          <TabsTrigger value="user"><UserCog className="mr-2 h-4 w-4" /> User Restrictions</TabsTrigger>
        </TabsList>

        {/* Global Features Tab */}
        <TabsContent value="global" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-6">
            {featureList.map(feature => (
              <Card key={feature.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                        <Badge variant={feature.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                            {feature.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 bg-background p-1 rounded-md border">
                        <Button 
                            variant={feature.status === 'active' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleGlobalUpdate(feature.id, 'status', 'active')}
                        >
                            Active
                        </Button>
                        <Button 
                            variant={feature.status === 'blurred' ? 'secondary' : 'ghost'} 
                            size="sm"
                            className="h-8"
                            onClick={() => handleGlobalUpdate(feature.id, 'status', 'blurred')}
                        >
                            Blur
                        </Button>
                        <Button 
                            variant={feature.status === 'hidden' ? 'secondary' : 'ghost'} 
                            size="sm"
                            className="h-8"
                            onClick={() => handleGlobalUpdate(feature.id, 'status', 'hidden')}
                        >
                            Hide
                        </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {feature.status !== 'active' && (
                      <div className="space-y-2 animate-in slide-in-from-top-2">
                          <Label>Custom Restriction Message</Label>
                          <div className="flex gap-2">
                              <Input 
                                  value={feature.message} 
                                  onChange={(e) => updateGlobalFeature(feature.id, { message: e.target.value })} // Direct update for typing
                                  placeholder="Enter message shown to users..."
                              />
                              <Button size="icon" onClick={() => toast({ title: "Message Saved" })}><Save className="h-4 w-4" /></Button>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              This message will be displayed to users when they encounter this feature.
                          </p>
                      </div>
                  )}
                  {feature.status === 'active' && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Eye className="h-4 w-4 text-green-500" /> This feature is currently visible to everyone.
                      </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Restrictions Tab */}
        <TabsContent value="user" className="space-y-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Find User</CardTitle>
                    <CardDescription>Search for a user to manage their specific feature access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by username or email..." 
                            className="pl-10" 
                            value={userSearch}
                            onChange={handleUserSearch}
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedUser && (
                <Card className="animate-in fade-in slide-in-from-bottom-4">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={selectedUser.avatar} />
                            <AvatarFallback>{selectedUser.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{selectedUser.name}</CardTitle>
                            <CardDescription>@{selectedUser.username} • {selectedUser.email}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Label className="mb-4 block text-lg font-semibold">Feature Access Restrictions</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featureList.map(feature => {
                                const currentRestriction = userRestrictions[selectedUser.username]?.[feature.id] || 'active';
                                
                                return (
                                    <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                        <div className="flex items-center gap-2">
                                            {currentRestriction !== 'active' ? <Lock className="h-4 w-4 text-red-500" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                            <span className="font-medium">{feature.name}</span>
                                        </div>
                                        <Select 
                                            value={currentRestriction} 
                                            onValueChange={(val) => {
                                                updateUserRestriction(selectedUser.username, feature.id, val);
                                                toast({ title: "Updated", description: `Updated ${feature.name} access for @${selectedUser.username}` });
                                            }}
                                        >
                                            <SelectTrigger className="w-[110px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="blurred">Blur</SelectItem>
                                                <SelectItem value="hidden">Hide</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeatures;