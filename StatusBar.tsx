import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { 
  ArrowLeftRight, 
  Battery, 
  Moon, 
  Sun, 
  ChevronLeft 
} from "lucide-react";

interface StatusBarProps {
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export function StatusBar({ 
  showBack = false, 
  onBack, 
  className 
}: StatusBarProps) {
  const { theme, toggleTheme } = useTheme();
  
  // Get current time in format HH:MM
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className={cn("flex justify-between items-center p-4", className)}>
      {showBack ? (
        <button 
          onClick={onBack} 
          className="p-1"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : (
        <div className="text-sm">{currentTime}</div>
      )}
      
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-card text-foreground"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
        
        <ArrowLeftRight className="h-4 w-4" />
        <Battery className="h-4 w-4" />
        <div className="text-sm">100%</div>
      </div>
    </div>
  );
}
