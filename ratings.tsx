import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { StatusBar } from "@/components/StatusBar";
import { IndicatorDots } from "@/components/IndicatorDots";
import { RatingCard } from "@/components/RatingCard";
import { ShareSection } from "@/components/ShareSection";
import { FaceRating } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function Ratings() {
  const [_, setLocation] = useLocation();
  const [ratings, setRatings] = useState<FaceRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get analysis data from session storage
    const analysisData = sessionStorage.getItem('analysisData');
    
    if (!analysisData) {
      toast({
        title: "Error",
        description: "No analysis data found. Please try scanning again.",
        variant: "destructive",
      });
      setLocation('/scan');
      return;
    }

    try {
      const { ratings } = JSON.parse(analysisData);
      setRatings(ratings);
    } catch (error) {
      console.error("Error parsing analysis data:", error);
      toast({
        title: "Error",
        description: "Invalid analysis data. Please try scanning again.",
        variant: "destructive",
      });
      setLocation('/scan');
    } finally {
      setIsLoading(false);
    }
  }, [setLocation]);

  const handleBack = () => {
    setLocation('/analysis');
  };

  const goToRecommendations = () => {
    setLocation('/recommendations');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <StatusBar showBack onBack={handleBack} />

      <div className="px-5 pt-2 pb-12 flex-1 flex flex-col">
        <h1 className="text-2xl font-semibold text-center mb-8">your ratings</h1>
        
        {isLoading ? (
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-36" />
            ))}
          </div>
        ) : (
          <div 
            className="flex-1 grid grid-cols-2 gap-4 cursor-pointer"
            onClick={goToRecommendations}
          >
            {ratings.map((rating, index) => (
              <RatingCard 
                key={index} 
                rating={rating}
                className="hover:bg-card/90 transition-colors"
              />
            ))}
          </div>
        )}

        <div className="mt-auto">
          <ShareSection />
          
          <div className="flex justify-center mt-4">
            <IndicatorDots totalDots={4} activeDot={2} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
