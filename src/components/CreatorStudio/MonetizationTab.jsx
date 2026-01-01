import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Clock, ShieldCheck, DollarSign, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const MonetizationTab = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [status, setStatus] = useState('loading'); // loading, idle, pending, approved, rejected
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    // Settings for approved users
    const [settings, setSettings] = useState({
        enableStripe: false,
        enablePoints: true,
        pointsSubs: false,
        pointsPPV: false
    });

    useEffect(() => {
        // Simulate fetching status from API/LocalStorage
        const loadStatus = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const savedStatus = localStorage.getItem(`monetization_status_${user?.id}`);
            const savedSettings = localStorage.getItem(`monetization_settings_${user?.id}`);
            
            if (savedStatus) setStatus(savedStatus);
            else setStatus('idle');

            if (savedSettings) setSettings(JSON.parse(savedSettings));
        };
        
        if (user) loadStatus();
    }, [user]);

    const handleApply = async () => {
        if (!agreedToTerms) return;
        setLoading(true);
        
        // Simulate API call POST /api/monetization/apply
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        localStorage.setItem(`monetization_status_${user.id}`, 'pending');
        setStatus('pending');
        setLoading(false);
        
        toast({
            title: "Application Submitted",
            description: "Your request is being reviewed. Check back in 24-48 hours.",
            className: "bg-green-600 text-white border-none"
        });
    };

    const handleSettingChange = async (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings); // Optimistic update
        
        // Simulate API call PATCH /api/monetization/settings
        try {
             // In a real app we would await this, but for UI responsiveness we can let it float or show a small indicator
            localStorage.setItem(`monetization_settings_${user.id}`, JSON.stringify(newSettings));
            toast({
                title: "Settings Saved",
                description: "Your monetization preferences have been updated.",
            });
        } catch (e) {
             setSettings(settings); // Revert
             toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive"
            });
        }
    };

    const handleConnectStripe = async () => {
        setLoading(true);
        // Simulate GET /api/stripe/connect-link
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        toast({
            title: "Redirecting to Stripe",
            description: "You are being redirected to complete your payout setup.",
        });
        // In real app: window.location.href = response.url;
        handleSettingChange('enableStripe', true); // Auto-enable for demo
    };

    if (user?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-primary/30 rounded-lg bg-muted/10 mt-4">
                <ShieldCheck className="h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">Admin Access Detected</h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                    You are currently logged in as an Administrator. You don't need to apply for monetization. 
                    Instead, you can review and manage creator applications in the Admin Panel.
                </p>
                <Button asChild size="lg" className="gap-2">
                    <Link to="/admin/monetization">
                        <ShieldCheck className="w-4 h-4" />
                        Go to Admin Review Panel
                    </Link>
                </Button>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <Card className="mt-4 border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Application Pending</h2>
                    <p className="text-muted-foreground max-w-md mb-6">
                        Thanks for applying! Our team is reviewing your content. This usually takes 24-48 hours. 
                        You'll be notified once your status changes.
                    </p>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10 px-4 py-1">
                        Status: Under Review
                    </Badge>
                </CardContent>
            </Card>
        );
    }

    if (status === 'approved') {
        return (
            <div className="space-y-6 mt-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-green-600 font-medium">Status</CardDescription>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                Approved <Check className="h-5 w-5 text-green-500" />
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Points Earned</CardDescription>
                            <CardTitle className="text-2xl">12,450</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Stripe Earnings</CardDescription>
                            <CardTitle className="text-2xl">$1,240.50</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Configure how you want to receive support from your community.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Stripe Connect</h3>
                                    <p className="text-sm text-muted-foreground">Receive cash payments directly to your bank.</p>
                                </div>
                            </div>
                            {settings.enableStripe ? (
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-600">Connected</Badge>
                                    <Button variant="outline" size="sm" onClick={() => window.open('https://dashboard.stripe.com', '_blank')}>View Dashboard</Button>
                                </div>
                            ) : (
                                <Button onClick={handleConnectStripe} disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Connect with Stripe
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                    <ShieldCheck className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Homies Points</h3>
                                    <p className="text-sm text-muted-foreground">Earn points redeemable for platform features or cash.</p>
                                </div>
                            </div>
                             <Switch 
                                checked={settings.enablePoints}
                                onCheckedChange={(checked) => handleSettingChange('enablePoints', checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Monetization Features</CardTitle>
                        <CardDescription>Enable or disable specific ways for users to support you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Paid Subscriptions (Points)</label>
                                <p className="text-sm text-muted-foreground">Allow users to subscribe to your exclusive content using points.</p>
                            </div>
                            <Switch 
                                checked={settings.pointsSubs}
                                onCheckedChange={(checked) => handleSettingChange('pointsSubs', checked)}
                                disabled={!settings.enablePoints}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium">Pay-Per-View Content</label>
                                <p className="text-sm text-muted-foreground">Charge points for individual premium videos or streams.</p>
                            </div>
                            <Switch 
                                checked={settings.pointsPPV}
                                onCheckedChange={(checked) => handleSettingChange('pointsPPV', checked)}
                                disabled={!settings.enablePoints}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <div className="flex justify-end">
                     <Button variant="outline" className="gap-2">
                        View Payouts History
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    // Default: Apply Screen (Idle or Rejected)
    return (
        <div className="max-w-3xl mx-auto mt-4 space-y-6">
            <div className="text-center space-y-4 mb-8">
                <div className="h-20 w-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4 shadow-glow-gold-sm">
                    <DollarSign className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">Join the Partner Program</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Monetize your content, offer exclusive subscriptions, and earn from your community through points or direct cash payouts.
                </p>
            </div>

            {status === 'rejected' && (
                 <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3 text-destructive-foreground mb-6">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold">Application Rejected</h4>
                        <p className="text-sm opacity-90">Your previous application was not approved. You can re-apply after addressing the issues.</p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Eligibility Requirements</CardTitle>
                    <CardDescription>Please ensure you meet all criteria before applying.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Verified Email Address</span>
                            </div>
                             <span className="text-green-500 text-sm font-medium flex items-center gap-1"><Check className="h-3 w-3" /> Ready</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Profile Picture Set</span>
                            </div>
                            <span className="text-green-500 text-sm font-medium flex items-center gap-1"><Check className="h-3 w-3" /> Ready</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>At least 1 Public Post</span>
                            </div>
                            <span className="text-muted-foreground text-sm">
                                {user?.postsCount || 0} posts
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <label 
                            htmlFor="terms" 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            I agree to the <a href="#" className="text-primary hover:underline">Creator Terms of Service</a> and <a href="#" className="text-primary hover:underline">Monetization Policy</a>.
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full text-lg h-12" 
                        onClick={handleApply} 
                        disabled={!agreedToTerms || loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting...
                            </>
                        ) : "Submit Application"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default MonetizationTab;