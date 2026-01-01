import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const WalletOption = ({ name, onClick, disabled }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className="group flex items-center justify-between w-full p-4 mb-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full" />
            </div>
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
    </button>
);

const WalletConnectModal = ({ isOpen, onOpenChange }) => {
    const { connectWallet, connectedWallet, disconnectWallet } = useWallet();
    const { toast } = useToast();
    const [status, setStatus] = useState('idle');
    const [selectedWallet, setSelectedWallet] = useState(null);

    const handleConnect = async (walletName) => {
        setSelectedWallet(walletName);
        setStatus('connecting');
        
        try {
            await connectWallet(walletName);
            setStatus('connected');
            toast({
                title: "Wallet Connected",
                description: `Successfully connected to ${walletName}`,
            });
            setTimeout(() => {
                onOpenChange(false);
                setStatus('idle');
                setSelectedWallet(null);
            }, 1500);
        } catch (error) {
            setStatus('error');
            console.error(error);
        }
    };

    const handleDisconnect = () => {
        disconnectWallet();
        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        {status === 'connecting' ? 'Connecting Wallet' : 
                         status === 'connected' ? 'Success!' : 
                         connectedWallet ? 'Wallet Connected' : 'Connect Crypto Wallet'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {status === 'connecting' ? `Requesting connection to ${selectedWallet}... Check your device.` : 
                         status === 'connected' ? 'Connection established via WalletConnect.' :
                         connectedWallet ? `Connected to ${connectedWallet.type}` : 'Select your preferred wallet to continue.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {status === 'connecting' ? (
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                <div className="relative w-20 h-20 rounded-2xl bg-black border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                                     <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground animate-pulse">Waiting for approval...</div>
                        </div>
                    ) : status === 'connected' ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                             <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <p className="font-medium text-green-500">Wallet Verified</p>
                        </div>
                    ) : connectedWallet ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-secondary/50 border border-border flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Address</span>
                                    <span className="font-mono text-lg font-medium text-primary">{connectedWallet.address}</span>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                            </div>
                            <Button 
                                variant="destructive" 
                                className="w-full" 
                                onClick={handleDisconnect}
                            >
                                Disconnect Wallet
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <WalletOption name="Pera Wallet" onClick={() => handleConnect('Pera Wallet')} />
                            <WalletOption name="Coinbase Wallet" onClick={() => handleConnect('Coinbase Wallet')} />
                            <WalletOption name="Exodus" onClick={() => handleConnect('Exodus')} />
                        </div>
                    )}
                </div>

                {status === 'idle' && !connectedWallet && (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                        <AlertCircle className="w-3 h-3" />
                        <span>Secured by WalletConnect</span>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default WalletConnectModal;