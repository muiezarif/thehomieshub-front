import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Coins, CreditCard, Loader2 } from "lucide-react";

const SubscriptionDialog = ({ 
  isOpen, 
  onOpenChange, 
  creator, 
  subscription, 
  onConfirm, 
  isSubscribing 
}) => {
  if (!creator || !subscription) return null;

  const isPoints = subscription.type === 'points';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
        <DialogHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-primary/20">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <DialogTitle className="text-2xl">Subscribe to {creator.name}</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              @{creator.username}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="rounded-lg border bg-card p-4">
             <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  {isPoints ? <Coins className="h-5 w-5 text-yellow-500" /> : <CreditCard className="h-5 w-5 text-primary" />}
                  {isPoints ? 'Points Subscription' : 'Monthly Subscription'}
                </h4>
                <span className="font-bold text-lg">
                   {isPoints 
                      ? `${subscription.price} ${subscription.currency}`
                      : `${subscription.currency}${subscription.price}`
                   }
                </span>
             </div>
             <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Exclusive locked content</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Supporter badge on profile</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Direct messaging access</li>
             </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            size="lg" 
            className="w-full font-semibold text-lg" 
            onClick={onConfirm}
            disabled={isSubscribing}
          >
            {isSubscribing ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    Confirm Subscription
                </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;