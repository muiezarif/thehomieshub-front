import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import api from '../api/homieshub';

const FeatureLockedModal = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('homies');
  const [discountCode, setDiscountCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans = {
    homies: {
      id: 'homies',
      name: 'The Homies',
      price: { monthly: 15, yearly: 150 },
      features: ['Unlock exclusive content', 'Priority support']
    },
    nomad: {
      id: 'nomad',
      name: 'Digital Nomad',
      price: { monthly: 100, yearly: 840 },
      features: ['All Homies perks', 'Monthly group calls', 'Direct access to team']
    }
  };

  const handlePayment = async () => {
    try {
      setIsSubmitting(true);

      const resp = await api.post("/subscription/checkout", {
        plan: selectedPlan,
        billingCycle,
        discountCode: discountCode || undefined, // optional (backend may ignore)
      });

      const url = resp?.data?.result?.url;
      if (!url) throw new Error("Missing checkout url");
      window.location.href = url;
    } catch (err) {
      console.error("Subscription checkout error:", err);
      toast({
        title: "Upgrade failed",
        description: err?.response?.data?.message || err?.message || "Please try again",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#0a0a0a] text-white border border-gray-800">
        <div className="flex flex-col items-center pt-6">
          <div className="bg-[#fbbf24] p-3 rounded-full mb-4">
            <Clapperboard className="h-8 w-8 text-black" />
          </div>
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl text-[#fbbf24] font-bold">Upgrade Your Plan</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Unlock your potential with premium features.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-6 py-4">
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(plans).map((plan) => (
              <Label
                key={plan.id}
                htmlFor={plan.id}
                className={cn(
                  "flex flex-col justify-between border-2 rounded-xl p-4 cursor-pointer transition-all h-full",
                  selectedPlan === plan.id
                    ? "border-[#fbbf24] bg-[#fbbf24]/5"
                    : "border-gray-800 hover:border-gray-700 bg-black"
                )}
              >
                <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                <div>
                  <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      ${billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                    </span>
                    <span className="text-gray-400 text-sm">/mo</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-xs text-green-500 font-medium mt-1">
                      Billed ${plan.price.yearly} yearly
                    </p>
                  )}
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-xs flex items-start gap-2 text-gray-400">
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Label>
            ))}
          </RadioGroup>

          <div className="flex items-center justify-center gap-3 py-2">
            <span className={cn("text-sm font-medium", billingCycle === 'monthly' ? "text-white" : "text-gray-400")}>Monthly</span>
            <div
              className="w-12 h-6 bg-gray-800 rounded-full relative cursor-pointer p-1 transition-colors hover:bg-gray-700"
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            >
              <div className={cn("w-4 h-4 bg-[#fbbf24] rounded-full shadow-sm transition-transform duration-200", billingCycle === 'yearly' && "translate-x-6")} />
            </div>
            <span className={cn("text-sm font-medium", billingCycle === 'yearly' ? "text-white" : "text-gray-400")}>Yearly (Save more!)</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount" className="text-white">Discount Code</Label>
            <Input
              id="discount"
              placeholder="Enter code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="bg-[#1a1a1a] border-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-[#fbbf24]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto border-[#fbbf24] text-[#fbbf24] hover:bg-[#fbbf24]/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#fbbf24] text-black hover:bg-[#f59e0b] font-semibold"
          >
            {isSubmitting ? "Redirecting..." : "Continue to Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureLockedModal;
