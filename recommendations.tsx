import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { StatusBar } from "@/components/StatusBar";
import { IndicatorDots } from "@/components/IndicatorDots";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";
import { FaceRecommendation } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function Recommendations() {
  const [_, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<FaceRecommendation[]>([]);
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
      const { recommendations } = JSON.parse(analysisData);
      setRecommendations(recommendations);
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
    setLocation('/ratings');
  };

  const handleContinue = () => {
    setLocation('/');
    
    toast({
      title: "Analysis Complete",
      description: "Thank you for using LookMax AI!",
    });
  };

  const handleRecommendationClick = (id: number) => {
    toast({
      title: "Feature Coming Soon",
      description: "Detailed recommendation info will be available soon.",
    });
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
        <h1 className="text-2xl font-semibold text-center mb-8">your recommendations</h1>
        
        {isLoading ? (
          <div className="flex-1 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-20" />
            ))}
          </div>
        ) : (
          <div className="flex-1">
            {recommendations.map((recommendation) => (
              <RecommendationCard 
                key={recommendation.id} 
                recommendation={recommendation}
                onClick={() => handleRecommendationClick(recommendation.id)}
              />
            ))}
          </div>
        )}

        <Button 
          onClick={handleContinue} 
          className="w-full py-4 bg-[#f97316] text-white hover:bg-[#f97316]/90 rounded-2xl font-medium mt-6"
        >
          Continue
        </Button>
        
        <div className="flex justify-center mt-4">
          <IndicatorDots totalDots={4} activeDot={3} />
        </div>
      </div>
    </motion.div>
  );
}
