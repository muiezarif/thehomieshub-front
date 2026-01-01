import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Flame, Film, MessageSquare, BarChart2, MapPin, Calendar, ShieldAlert } from 'lucide-react';

const FilterBar = ({ activeFilter, onFilterChange, className }) => {
  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'moments', label: 'Moments', icon: Film }, // Renamed from Reels
    { id: 'videos', label: 'Videos', icon: Film }, // Distinguish clip vs long form if needed, reusing icon
    { id: 'tweets', label: 'Threads', icon: MessageSquare },
    { id: 'polls', label: 'Polls', icon: BarChart2 },
    { id: 'trips', label: 'Trips', icon: MapPin },
    { id: 'events', label: 'Events', icon: Calendar },
    // NSFW filter removed from navigation as requested
  ];

  return (
    <div className={cn("w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full transition-all duration-200",
                  isActive ? "" : "hover:bg-muted"
                )}
                onClick={() => onFilterChange(filter.id)}
              >
                {Icon && <Icon className="mr-2 h-3.5 w-3.5" />}
                {filter.label}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
};

export default FilterBar;