import React from 'react';
import { RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AspectRatioToggle = ({ aspectRatio, setAspectRatio }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 gap-2 shadow-xl">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-full transition-all duration-300",
                        aspectRatio === 'vertical' 
                            ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-110 z-10' 
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                      )}
                      onClick={() => setAspectRatio('vertical')}
                    >
                      <RectangleVertical className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Portrait Mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-full transition-all duration-300",
                        aspectRatio === 'horizontal' 
                            ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-110 z-10' 
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                      )}
                      onClick={() => setAspectRatio('horizontal')}
                    >
                      <RectangleHorizontal className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Landscape Mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
  );
};

export default AspectRatioToggle;