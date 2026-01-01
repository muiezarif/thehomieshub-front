import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Clapperboard, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import api from '../api/homieshub';

// ✅ Import your API base
// <- adjust path if your file is located elsewhere

// --- Sub-components defined OUTSIDE to prevent re-render focus loss issues ---

const SignUpForm = ({ formData, handleInputChange, onSignup, onCancel, isSubmitting }) => (
  <>
    <DialogHeader>
      <DialogTitle className="text-2xl text-primary">Create Your Account</DialogTitle>
      <DialogDescription>Join the community for free. No credit card required.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="displayName">Display Name / Username *</Label>
        <Input
          id="displayName"
          value={formData.displayName}
          onChange={handleInputChange}
          placeholder="traveling_tom"
          required
          autoComplete="off"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password *</Label>
        <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required />
      </div>
    </div>
    <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
      <Button
        onClick={onSignup}
        disabled={isSubmitting || !formData.displayName || !formData.email || !formData.password}
      >
        {isSubmitting ? 'Creating...' : 'Create Free Account'}
      </Button>
    </DialogFooter>
  </>
);

const ForgotPasswordView = ({ setAuthView, handleFeatureNotImplemented }) => (
  <div>
    <DialogHeader>
      <DialogTitle className="text-2xl text-primary">Reset Password</DialogTitle>
      <DialogDescription>
        Enter your email and we'll send you a link to get back into your account.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="email-forgot">Email</Label>
        <Input id="email-forgot" type="email" placeholder="m@example.com" />
      </div>
    </div>
    <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
      <Button variant="link" onClick={() => setAuthView('main')}>Back to Sign In</Button>
      <Button onClick={handleFeatureNotImplemented}>Send Reset Link</Button>
    </DialogFooter>
  </div>
);

const MainAuthView = ({
  activeTab,
  setActiveTab,
  formData,
  handleInputChange,
  handleSignUpSubmit,
  handleSignInSubmit,
  resetFlow,
  handleFeatureNotImplemented,
  setAuthView,
  handleAdminLoginClick,
  isSubmitting,
}) => (
  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="signin">Sign In</TabsTrigger>
      <TabsTrigger value="signup">Sign Up</TabsTrigger>
    </TabsList>

    <TabsContent value="signin">
      <DialogHeader className="my-4">
        <DialogTitle className="text-2xl text-primary">Welcome Back!</DialogTitle>
        <DialogDescription>Sign in to continue your adventure.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email-signin">Email</Label>
          <Input
            id="email-signin"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password-signin">Password</Label>
          <Input
            id="password-signin"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <DialogFooter className="mt-4 flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleSignInSubmit}
          disabled={isSubmitting || !formData.email || !formData.password}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* ❌ Removed Quick Sign In (Test User) */}

        <Button variant="link" size="sm" className="self-end" onClick={() => setAuthView('forgotPassword')}>
          Forgot password?
        </Button>
      </DialogFooter>

      <div className="mt-6 text-center">
        <Button variant="ghost" size="sm" onClick={handleAdminLoginClick}>
          Are you an Admin? Login here.
        </Button>
      </div>
    </TabsContent>

    <TabsContent value="signup">
      <SignUpForm
        formData={formData}
        handleInputChange={handleInputChange}
        onSignup={handleSignUpSubmit}
        onCancel={resetFlow}
        isSubmitting={isSubmitting}
      />
    </TabsContent>
  </Tabs>
);

const PlanSelectionStep = ({ user, plans, formData, handlePlanChange, setFormData, onNext, onCancel }) => (
  <>
    <DialogHeader>
      <DialogTitle className="text-2xl text-primary">{user ? 'Upgrade Your Plan' : 'Choose Your Plan'}</DialogTitle>
      <DialogDescription>Unlock your potential with premium features.</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <RadioGroup value={formData.plan} onValueChange={handlePlanChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(plans).map(planKey => {
          const plan = plans[planKey];
          return (
            <Label
              key={planKey}
              htmlFor={planKey}
              className={cn(
                "block cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm p-4 transition-all hover:shadow-glow-gold-lg",
                formData.plan === planKey && "border-primary ring-2 ring-primary"
              )}
            >
              <RadioGroupItem value={planKey} id={planKey} className="sr-only" />
              <h3 className="font-semibold text-lg text-foreground">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2">
                ${formData.billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                <span className="text-sm font-normal text-muted-foreground">/{formData.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </p>
              <ul className="mt-2 space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
            </Label>
          )
        })}
      </RadioGroup>

      <div className="mt-4 flex items-center justify-center">
        <Label htmlFor="billingCycle" className="mr-2 text-sm">Monthly</Label>
        <label htmlFor="billingCycle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="billingCycle"
            className="sr-only peer"
            checked={formData.billingCycle === 'yearly'}
            onChange={() => setFormData(prev => ({ ...prev, billingCycle: prev.billingCycle === 'monthly' ? 'yearly' : 'monthly' }))}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
        <Label htmlFor="billingCycle" className="ml-2 text-sm">Yearly (Save more!)</Label>
      </div>

      <div className="mt-6">
        <Label htmlFor="discountCode">Discount Code</Label>
        <Input
          id="discountCode"
          placeholder="Enter code"
          value={formData.discountCode}
          onChange={(e) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
        />
      </div>
    </div>

    <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={onNext}>Continue to Payment</Button>
    </DialogFooter>
  </>
);

const ConfirmationStep = ({ user, plans, formData, onBack, onConfirm }) => {
  const selectedPlan = plans[formData.plan];
  const price = selectedPlan.price[formData.billingCycle];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl text-primary">Confirm Upgrade</DialogTitle>
        <DialogDescription>Review your plan selection.</DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <Card>
          <CardContent className="p-6 grid gap-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-semibold">{user ? user.email : formData.email}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-2">
              <span className="text-muted-foreground">Plan</span>
              <div className="text-right">
                <p className="font-semibold">{selectedPlan.name} ({formData.billingCycle})</p>
                <p className="text-sm text-muted-foreground">${price}</p>
              </div>
            </div>
            {formData.discountCode && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="text-muted-foreground">Discount "{formData.discountCode}"</span>
                <span className="font-semibold">- $0.00 (Fake)</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2">
              <span>Total Due Today</span>
              <span>${price}.00</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">By completing your purchase, you agree to our Terms of Service.</p>
      </div>
      <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onConfirm}>Complete Upgrade</Button>
      </DialogFooter>
    </>
  )
};

const AuthModal = ({ isOpen, onOpenChange, initialView = 'main' }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn, updateUserTier, refreshMe,setAccessToken  } = useAuth();

  const [activeTab, setActiveTab] = useState('signin');
  const [authView, setAuthView] = useState(initialView);
  const [upgradeStep, setUpgradeStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    plan: 'homies',
    billingCycle: 'monthly',
    discountCode: ''
  });

  useEffect(() => {
    setAuthView(initialView);
    if (initialView === 'upgrade') setUpgradeStep(1);
  }, [initialView, isOpen]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Map signin fields to the same state keys (no UI change)
    if (id === 'email-signin') return setFormData(prev => ({ ...prev, email: value }));
    if (id === 'password-signin') return setFormData(prev => ({ ...prev, password: value }));

    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePlanChange = (value) => {
    setFormData(prev => ({ ...prev, plan: value }));
  };

  const nextUpgradeStep = () => setUpgradeStep(prev => prev + 1);
  const prevUpgradeStep = () => setUpgradeStep(prev => prev - 1);

  const resetFlow = () => {
    setUpgradeStep(1);
    setAuthView('main');
    setActiveTab('signin');
    setIsSubmitting(false);
    setFormData({
      displayName: '',
      email: '',
      password: '',
      plan: 'homies',
      billingCycle: 'monthly',
      discountCode: ''
    });
    onOpenChange(false);
  };

  const handleFeatureNotImplemented = () => {
    toast({
      title: '🚧 Feature Not Implemented',
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleAdminLoginClick = async () => {
    // leaving as-is (your admin auth flow is separate)
    await signIn('admin');
    onOpenChange(false);
    toast({
      title: '👑 Welcome, Admin!',
      description: 'You have been signed in with admin privileges.',
    });
    navigate('/admin/dashboard');
  };

  const handleSignInSubmit = async () => {
    setIsSubmitting(true);
    try {
      const resp = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const data = resp?.data;
      if (!data?.status) {
        throw new Error(data?.message || 'Login failed');
      }

      const token = data?.result?.access_token;
      if (token){
        await setAccessToken(token);
         localStorage.setItem('access_token', token);
        }
      await refreshMe();
      toast({
        title: '🎉 Welcome Back!',
        description: data?.message || 'Signed in successfully.',
      });

      // Close modal; AuthContext can pick token and fetch /auth/me
      resetFlow();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed';

      toast({
        title: '❌ Sign In Failed',
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Backend passes through to Central Billing register endpoint :contentReference[oaicite:4]{index=4}
      const resp = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.displayName,
        username: formData.displayName,
      });

      const data = resp?.data;

      if (!data?.status) {
        throw new Error(data?.message || 'Registration failed');
      }

      const token = data?.result?.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
        await setAccessToken(token);
        await refreshMe();        // <-- add this
        toast({
          title: '🎉 Account Created!',
          description: data?.message || `Welcome, ${formData.displayName}!`,
        });
        resetFlow();
        return;
      }

      // If CB doesn't return token on register, backend sends message prompting login
      toast({
        title: '✅ Registered!',
        description: data?.message || 'Registration successful. Please sign in.',
      });

      // Switch to sign-in tab but keep email filled
      setActiveTab('signin');
      setAuthView('main');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed';

      toast({
        title: '❌ Sign Up Failed',
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpgradeComplete = () => {
    if (user) {
      updateUserTier(formData.plan);
      toast({
        title: '🎉 Upgrade Successful!',
        description: `You are now a ${plans[formData.plan].name} member.`,
      });
    }
    resetFlow();
  };

  const plans = {
    homies: { name: 'The Homies', price: { monthly: 15, yearly: 150 }, features: ["Unlock exclusive content", "Priority support"] },
    nomad: { name: 'Digital Nomad', price: { monthly: 100, yearly: 840 }, features: ["All Homies perks", "Monthly group calls", "Direct access to team"] },
  };

  const handleOpenChangeProp = (open) => {
    if (!open) resetFlow();
    onOpenChange(open);
  };

  const renderContent = () => {
    if (authView === 'main') {
      return (
        <MainAuthView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSignUpSubmit={handleSignUpSubmit}
          handleSignInSubmit={handleSignInSubmit}
          resetFlow={resetFlow}
          handleFeatureNotImplemented={handleFeatureNotImplemented}
          setAuthView={setAuthView}
          handleAdminLoginClick={handleAdminLoginClick}
          isSubmitting={isSubmitting}
        />
      );
    }

    if (authView === 'forgotPassword') {
      return (
        <ForgotPasswordView
          setAuthView={setAuthView}
          handleFeatureNotImplemented={handleFeatureNotImplemented}
        />
      );
    }

    if (authView === 'upgrade') {
      if (upgradeStep === 1) {
        return (
          <PlanSelectionStep
            user={user}
            plans={plans}
            formData={formData}
            handlePlanChange={handlePlanChange}
            setFormData={setFormData}
            onNext={nextUpgradeStep}
            onCancel={resetFlow}
          />
        );
      }
      if (upgradeStep === 2) {
        return (
          <ConfirmationStep
            user={user}
            plans={plans}
            formData={formData}
            onBack={prevUpgradeStep}
            onConfirm={handleUpgradeComplete}
          />
        );
      }
    }

    return (
      <MainAuthView
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSignUpSubmit={handleSignUpSubmit}
        handleSignInSubmit={handleSignInSubmit}
        resetFlow={resetFlow}
        handleFeatureNotImplemented={handleFeatureNotImplemented}
        setAuthView={setAuthView}
        handleAdminLoginClick={handleAdminLoginClick}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeProp}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-lg">
        <div className="flex flex-col items-center justify-center pt-6 space-y-2">
          <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-2">
            <Clapperboard className="h-8 w-8" />
          </div>
        </div>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
