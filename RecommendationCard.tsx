import { FaceRecommendation } from "@shared/schema";
import { cn, getTailwindColor } from "@/lib/utils";
import { ChevronRight, Heart, Cloud, BarChart3 } from "lucide-react";

interface RecommendationCardProps {
  recommendation: FaceRecommendation;
  onClick?: () => void;
  className?: string;
}

export function RecommendationCard({ 
  recommendation, 
  onClick,
  className 
}: RecommendationCardProps) {
  // Render appropriate icon based on the recommendation's icon property
  const renderIcon = () => {
    const iconColor = getTailwindColor(recommendation.color);
    
    switch (recommendation.icon) {
      case 'heart':
        return <Heart className="h-5 w-5 text-black" />;
      case 'cloud':
        return <Cloud className="h-5 w-5 text-black" />;
      case 'bar-chart':
        return <BarChart3 className="h-5 w-5 text-black" />;
      case 'number':
        return <span className="font-medium text-black">{recommendation.id}</span>;
      default:
        return <Heart className="h-5 w-5 text-black" />;
    }
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-2xl p-4 mb-4 flex items-start cursor-pointer transition-colors hover:bg-opacity-90",
        className
      )}
      onClick={onClick}
    >
      <div 
        className={`w-8 h-8 rounded-full bg-${recommendation.color} flex items-center justify-center mr-3 flex-shrink-0`}
        style={{ backgroundColor: getTailwindColor(recommendation.color) }}
      >
        {renderIcon()}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-foreground mb-1">
          {recommendation.title}
        </h3>
        {recommendation.description && (
          <p className="text-muted-foreground text-sm">
            {recommendation.description}
          </p>
        )}
      </div>
      
      <div className="ml-2">
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}
