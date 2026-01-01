import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clapperboard, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'admin@homieshub.com' && password === 'password') {
      await signIn('admin');
      toast({ title: 'Login Successful', description: 'Welcome back, Admin!' });
      navigate('/admin/dashboard');
    } else if (email === 'mod@homieshub.com' && password === 'password') {
      await signIn('moderator');
      toast({ title: 'Login Successful', description: 'Welcome back, Moderator!' });
      navigate('/admin/dashboard');
    } else {
      toast({ title: 'Login Failed', description: 'Invalid credentials.', variant: 'destructive' });
    }
  };

  const handleQuickLogin = async (role) => {
    await signIn(role);
    toast({
      title: 'Quick Login Successful',
      description: `Logged in as ${role === 'admin' ? 'Admin' : 'Moderator'}!`,
    });
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-sm mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
             <Clapperboard className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
          <CardDescription>Access The Homies Hub dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@homieshub.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">Log In</Button>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button type="button" variant="outline" onClick={() => handleQuickLogin('admin')}>
                Admin Demo
              </Button>
              <Button type="button" variant="secondary" className="gap-2" onClick={() => handleQuickLogin('moderator')}>
                <ShieldAlert className="h-4 w-4" />
                Mod Demo
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;