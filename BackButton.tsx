import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ 
  onClick, 
  label, 
  className 
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      aria-label={label || "Go back"}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
}
