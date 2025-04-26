import { cn } from "@/lib/utils";
import { FaceRating } from "@shared/schema";

interface RatingCardProps {
  rating: FaceRating;
  className?: string;
}

export function RatingCard({ rating, className }: RatingCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-2xl p-5 flex flex-col items-center",
        className
      )}
    >
      <div className="text-muted-foreground font-medium mb-1">
        {rating.category}
      </div>
      <div className="text-4xl font-bold mb-2">
        {rating.score}
      </div>
      <div className="progress-bar w-full bg-[#252525]">
        <div 
          className="h-full bg-[#84cc16]" 
          style={{ width: `${rating.percentage}%` }}
        />
      </div>
    </div>
  );
}
