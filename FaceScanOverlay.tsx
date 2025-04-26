import { cn } from "@/lib/utils";

interface FaceScanOverlayProps {
  className?: string;
}

export function FaceScanOverlay({ className }: FaceScanOverlayProps) {
  return (
    <svg 
      className={cn("absolute inset-0 pointer-events-none", className)}
      width="100%" 
      height="100%" 
      viewBox="0 0 400 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M100,50 L50,50 Q30,50 30,70 L30,100" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
      />
      <path 
        d="M300,50 L350,50 Q370,50 370,70 L370,100" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
      />
      <path 
        d="M100,450 L50,450 Q30,450 30,430 L30,400" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
      />
      <path 
        d="M300,450 L350,450 Q370,450 370,430 L370,400" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
      />
    </svg>
  );
}
