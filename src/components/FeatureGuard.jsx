import React from 'react';
import { useFeatures } from '@/contexts/FeatureContext';
import { Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FeatureGuard = ({ feature, children, fallback = null }) => {
  const { checkAccess } = useFeatures();
  const { allowed, status, message } = checkAccess(feature);
  const navigate = useNavigate();

  const handleDismiss = () => {
    // Navigate back to previous page to "close" the feature access attempt
    // If there is no history, go home
    if (window.history.length > 1) {
        navigate(-1);
    } else {
        navigate('/');
    }
  };

  if (allowed) {
    return children;
  }

  if (status === 'hidden') {
    return fallback;
  }

  if (status === 'blurred') {
    return (
      <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center bg-background">
        {/* Blurred Content Placeholder - We don't render actual children to prevent any access */}
        <div className="absolute inset-0 filter blur-xl opacity-20 pointer-events-none select-none bg-gradient-to-br from-primary/20 to-background overflow-hidden">
             <div className="w-full h-full grid grid-cols-3 gap-4 p-8">
                 {[...Array(9)].map((_, i) => (
                     <div key={i} className="bg-muted rounded-lg h-32 w-full animate-pulse" />
                 ))}
             </div>
        </div>
        
        {/* Overlay Container */}
        <div className="relative z-50 p-6 flex items-center justify-center">
            <div className="bg-card border border-border p-8 rounded-xl shadow-2xl max-w-md w-full text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleDismiss}
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-2">
                    <Lock className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold">Feature Unavailable</h3>
                
                <p className="text-muted-foreground">
                    {message || "This feature is currently restricted."}
                </p>

                <Button onClick={handleDismiss} className="w-full mt-2">
                    Go Back
                </Button>
            </div>
        </div>
      </div>
    );
  }

  return fallback;
};

export default FeatureGuard;