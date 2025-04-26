import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareSectionProps {
  title?: string;
  className?: string;
}

export function ShareSection({ 
  title = "tap to share with your friends", 
  className 
}: ShareSectionProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My LookMax AI Analysis',
          text: 'Check out my facial analysis results from LookMax AI!',
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          description: "You can now share it with your friends"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing failed",
        description: "There was an error sharing your results",
        variant: "destructive"
      });
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-2",
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2"
      >
        <span className="text-muted-foreground text-sm">
          {title}
        </span>
        <Share2 className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
