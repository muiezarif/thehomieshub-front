import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const UploadStoryModal = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addStory } = useContent();
  
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Currently only images are supported for stories.",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
        addStory({
            user: user,
            url: previewUrl, // In a real app, this would be the uploaded URL
            type: 'image'
        });
        
        toast({
            title: "Story Added!",
            description: "Your story is now visible to your followers.",
        });
        
        setUploading(false);
        setFile(null);
        setPreviewUrl(null);
        onOpenChange(false);
    }, 1500);
  };

  const clearFile = () => {
      setFile(null);
      setPreviewUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">Add to Story</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 min-h-[300px]">
            {!previewUrl ? (
                 <div 
                    className="w-full h-64 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                 >
                    <div className="bg-zinc-800 p-4 rounded-full mb-4">
                        <ImagePlus className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="font-medium text-zinc-300">Click to upload photo</p>
                    <p className="text-xs text-zinc-500 mt-2">Supports JPG, PNG</p>
                 </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden aspect-[9/16]">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                        onClick={clearFile}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button 
                onClick={handleUpload} 
                disabled={!file || uploading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {uploading ? 'Sharing...' : 'Share to Story'}
            </Button>
             <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
                Cancel
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadStoryModal;