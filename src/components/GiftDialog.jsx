import React, { useState,useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Diamond, Gift } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import api from "@/api/homieshub";

const GIFT_AMOUNTS = [10, 50, 100, 500, 1000];

const GiftDialog = ({ isOpen, onOpenChange, recipientName, recipientUsername, onGiftSuccess }) => {
  const [balance, setBalance] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isSending, setIsSending] = useState(false);


  useEffect(() => {
  if (!isOpen) return;

  (async () => {
    try {
      const resp = await api.get("/wallet/me");
      setBalance(resp?.data?.result?.walletPoints ?? 0);
    } catch (e) {
      console.error("Failed to load wallet balance:", e);
      setBalance(0);
    }
  })();
}, [isOpen]);

  const handleSendGift = async () => {
    if (!selectedAmount) return;
    
    // Bug Fix: Backend validation simulation
    if (user && recipientUsername && user.username === recipientUsername) {
        toast({
            title: "Transaction Failed",
            description: "Self-gifting is strictly prohibited.",
            variant: "destructive"
        });
        onOpenChange(false);
        return;
    }

    if (balance < selectedAmount) {
        toast({
            title: "Insufficient Balance",
            description: "You don't have enough points to send this gift. Please purchase more points in your wallet.",
            variant: "destructive"
        });
        return;
    }

    setIsSending(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Deduct points (passing negative value)
    setBalance((b) => Math.max(0, b - selectedAmount));
    
    toast({
        title: "Gift Sent! 🎁",
        description: `You sent ${selectedAmount} points to ${recipientName}.`,
    });
    
    setIsSending(false);
    onOpenChange(false);
    setSelectedAmount(null);
    if (onGiftSuccess) onGiftSuccess(selectedAmount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-6 h-6 text-primary" />
            Send Gift to {recipientName}
          </DialogTitle>
          <DialogDescription>
            Support this creator by sending points.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3 py-6">
            {GIFT_AMOUNTS.map((amount) => (
                <Button
                    key={amount}
                    variant="outline"
                    className={cn(
                        "flex flex-col h-24 gap-2 border-2 transition-all hover:border-primary/50",
                        selectedAmount === amount 
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary" 
                            : "border-muted bg-card hover:bg-accent"
                    )}
                    onClick={() => setSelectedAmount(amount)}
                >
                    <Diamond className={cn("w-8 h-8", selectedAmount === amount ? 'fill-primary text-primary' : 'text-muted-foreground')} />
                    <span className="font-bold text-lg">{amount}</span>
                </Button>
            ))}
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg mb-2 border border-border/50">
            <span className="text-sm text-muted-foreground">Your Balance:</span>
            <span className="font-bold flex items-center gap-1 text-primary">
                {Number(balance || 0).toLocaleString()} <Diamond className="w-3 h-3 fill-current" />
            </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSendGift} 
            disabled={!selectedAmount || isSending}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0"
          >
            {isSending ? "Sending..." : "Send Gift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftDialog;