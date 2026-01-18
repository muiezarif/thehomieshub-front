import React, { useState, useRef } from "react";
import { Image as ImageIcon, Video, BarChart2, MapPin, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useContent } from "@/contexts/ContentContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/api/homieshub";

const CommunityPostCreator = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { addPost, loadCommunityPosts } = useContent();
  const { toast } = useToast();

  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollData, setPollData] = useState({
    question: "",
    options: [{ id: 1, text: "" }, { id: 2, text: "" }],
  });
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleTextChange = (e) => setContent(e.target.value);

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newMedia = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      type,
      preview: URL.createObjectURL(file),
    }));

    setMediaFiles((prev) => [...prev, ...newMedia]);
    e.target.value = null;
  };

  const removeMedia = (id) => setMediaFiles((prev) => prev.filter((m) => m.id !== id));

  const togglePoll = () => setShowPoll((v) => !v);

  const handlePollOptionChange = (id, text) => {
    setPollData((prev) => ({
      ...prev,
      options: prev.options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    }));
  };

  const addPollOption = () => {
    if (pollData.options.length >= 4) return;
    setPollData((prev) => ({
      ...prev,
      options: [...prev.options, { id: Date.now(), text: "" }],
    }));
  };

  const removePollOption = (id) => {
    if (pollData.options.length <= 2) return;
    setPollData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
  };

  const toggleLocation = () => {
    setShowLocation((v) => !v);
    if (showLocation) setLocation("");
  };

  const handleSubmit = async () => {
    const hasText = !!content.trim();
    const hasMedia = mediaFiles.length > 0;

    if (!hasText && !hasMedia && !showPoll) {
      toast({
        title: "Empty Post",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    if (showPoll) {
      const q = pollData.question.trim();
      const opts = pollData.options.map((o) => o.text.trim());
      if (!q || opts.some((t) => !t)) {
        toast({
          title: "Incomplete Poll",
          description: "Please fill out the poll question and all options.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let resp;

      // POLL
      if (showPoll) {
        resp = await api.post("/user/community/poll", {
          question: pollData.question.trim(),
          options: pollData.options.map((o) => o.text.trim()),
        });
      } else {
        // THREAD (text + optional images)
        // NOTE: Your backend thread endpoint expects images as URLs (from your files upload API),
        // not raw File objects. For now, we send only text.
        resp = await api.post("/user/community/thread", {
          text: content.trim(),
          location: location.trim() || undefined,
        });
      }

      const created = resp?.data?.result?.post || resp?.data?.result;

      if (!created) {
        throw new Error(resp?.data?.message || "Post creation failed");
      }

      // Insert immediately (your ContentContext should map backend docs)
      addPost(created);

      // Reload feed to be sure
      await loadCommunityPosts?.();

      toast({
        title: "Post Published 🎉",
        description: "Your post is now live in the community.",
      });

      setContent("");
      setMediaFiles([]);
      setShowPoll(false);
      setPollData({ question: "", options: [{ id: 1, text: "" }, { id: 2, text: "" }] });
      setShowLocation(false);
      setLocation("");

      onPostCreated?.();
    } catch (err) {
      console.error("Community post create error:", err);
      toast({
        title: "Failed to post",
        description: err?.response?.data?.message || err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user?.name || user?.username || "User";

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback>{displayName?.[0] || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              placeholder="What's happening, traveler?"
              className="min-h-[80px] border-none resize-none focus-visible:ring-0 p-0 text-base bg-transparent placeholder:text-muted-foreground/70"
              value={content}
              onChange={handleTextChange}
            />
          </div>
        </div>

        {/* Media Previews (UI only for now) */}
        <AnimatePresence>
          {mediaFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-2 gap-2"
            >
              {mediaFiles.map((media) => (
                <div key={media.id} className="relative aspect-video rounded-lg overflow-hidden bg-black/10 group">
                  {media.type === "image" ? (
                    <img src={media.preview} alt="Upload" className="w-full h-full object-cover" />
                  ) : (
                    <video src={media.preview} className="w-full h-full object-cover" controls />
                  )}

                  <button
                    onClick={() => removeMedia(media.id)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Poll Creator */}
        <AnimatePresence>
          {showPoll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border border-border rounded-lg p-4 bg-accent/20"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" /> Create Poll
                </h3>
                <Button variant="ghost" size="sm" onClick={togglePoll} className="h-6 w-6 p-0 rounded-full">
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <Input
                placeholder="Ask a question..."
                className="mb-3 bg-background"
                value={pollData.question}
                onChange={(e) => setPollData((prev) => ({ ...prev, question: e.target.value }))}
              />

              <div className="space-y-2">
                {pollData.options.map((option, idx) => (
                  <div key={option.id} className="flex gap-2 items-center">
                    <Input
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 bg-background"
                      value={option.text}
                      onChange={(e) => handlePollOptionChange(option.id, e.target.value)}
                    />
                    {pollData.options.length > 2 && (
                      <Button variant="ghost" size="icon" onClick={() => removePollOption(option.id)}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {pollData.options.length < 4 && (
                <Button variant="outline" size="sm" onClick={addPollOption} className="mt-3 text-xs w-full border-dashed">
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location */}
        <AnimatePresence>
          {showLocation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-2 text-sm text-primary"
            >
              <MapPin className="h-4 w-4" />
              <Input
                placeholder="Add location..."
                className="h-8 bg-accent/20 border-none focus-visible:ring-1"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoFocus
              />
              <Button variant="ghost" size="sm" onClick={toggleLocation} className="h-8 w-8 p-0">
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2 text-primary">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={imageInputRef}
              onChange={(e) => handleFileSelect(e, "image")}
            />
            <input
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              ref={videoInputRef}
              onChange={(e) => handleFileSelect(e, "video")}
            />

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("hover:bg-primary/10", showPoll ? "text-primary" : "text-muted-foreground hover:text-primary")}
              onClick={togglePoll}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("hover:bg-primary/10", showLocation ? "text-primary" : "text-muted-foreground hover:text-primary")}
              onClick={toggleLocation}
            >
              <MapPin className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0 && !showPoll)}
            className="px-6 font-semibold"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCreator;
