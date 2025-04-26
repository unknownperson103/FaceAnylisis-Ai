import { cn } from "@/lib/utils";

interface IndicatorDotsProps {
  totalDots: number;
  activeDot: number;
  className?: string;
}

export function IndicatorDots({ 
  totalDots, 
  activeDot, 
  className 
}: IndicatorDotsProps) {
  return (
    <div className={cn("flex justify-center space-x-2", className)}>
      {Array.from({ length: totalDots }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "indicator-dot transition-all duration-300",
            index === activeDot 
              ? "active bg-foreground" 
              : "bg-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}
