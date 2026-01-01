import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Video, MessageSquare, BarChart2, Map } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CreatorToolbar = ({ onPostClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isPremium, triggerLockedFeature } = useAuth();

  const handlePostClick = (postType) => {
    if (!isPremium) {
        triggerLockedFeature();
        setIsOpen(false);
        return;
    }
    onPostClick(postType);
    setIsOpen(false);
  }

  const handleToggle = () => {
      if(!isPremium) {
          triggerLockedFeature();
          return;
      }
      setIsOpen(!isOpen);
  }

  const subButtonVariants = {
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15 + i * 5,
      },
    }),
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const menuItems = [
    { icon: Video, action: () => handlePostClick('clip'), label: "Clip" },
    { icon: MessageSquare, action: () => handlePostClick('thread'), label: "Thread" },
    { icon: BarChart2, action: () => handlePostClick('poll'), label: "Poll" },
    { icon: Map, action: () => handlePostClick('trip'), label: "Trip" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div className="relative flex flex-col items-center">
        <AnimatePresence>
          {isOpen && (
              <motion.div className="flex flex-col items-end gap-3 mb-3">
              {menuItems.map((item, i) => (
                <motion.div 
                    key={i} 
                    custom={i} 
                    variants={subButtonVariants} 
                    initial="closed" 
                    animate="open" 
                    exit="closed"
                    className="flex items-center gap-2"
                >
                  <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-md shadow-sm whitespace-nowrap">{item.label}</span>
                  <Button size="icon" variant="secondary" onClick={item.action} className="rounded-full w-12 h-12 shadow-md">
                    <item.icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Button size="icon" className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90" onClick={handleToggle}>
            <Plus className="h-7 w-7 text-primary-foreground transition-transform duration-300" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreatorToolbar;