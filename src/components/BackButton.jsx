
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BackButton = ({ className, variant = "ghost", size = "icon", onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
      if (onClick) {
          onClick(e);
      } else {
          navigate(-1);
      }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleClick} 
      className={cn("rounded-full shrink-0", className)}
      aria-label="Go back"
    >
      <ChevronLeft className="h-6 w-6" />
    </Button>
  );
};

export default BackButton;
