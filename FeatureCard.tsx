import { cn } from "@/lib/utils";
import { FaceFeatureAnalysis } from "@shared/schema";

interface FeatureCardProps {
  feature: FaceFeatureAnalysis;
  className?: string;
  onClick?: () => void;
}

export function FeatureCard({ feature, className, onClick }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-2xl py-3 px-5 flex justify-between items-center mb-4",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="text-muted-foreground font-medium">
        {feature.label}
      </div>
      <div className="text-foreground font-medium">
        {feature.value}
      </div>
    </div>
  );
}
