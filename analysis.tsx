import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Download, 
  RefreshCw, 
  Share2, 
  BarChart2, 
  Sparkles,
  Ruler,
  Dices,
  Palette
} from "lucide-react";
import { StatusBar } from "@/components/StatusBar";
import { IndicatorDots } from "@/components/IndicatorDots";
import { FeatureCard } from "@/components/FeatureCard";
import { ShareSection } from "@/components/ShareSection";
import { analyzeFace } from "@/lib/face-analysis";
import { FaceFeatureAnalysis, FaceRating, FaceRecommendation } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Analysis() {
  const [location, setLocation] = useLocation();
  const [features, setFeatures] = useState<FaceFeatureAnalysis[]>([]);
  const [ratings, setRatings] = useState<FaceRating[]>([]);
  const [recommendations, setRecommendations] = useState<FaceRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLookMaxResult, setShowLookMaxResult] = useState(false);
  const [generatingLookMax, setGeneratingLookMax] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Try to get the image data from the URL
  const urlParams = location.split('?')[1] || '';
  const urlImageData = new URLSearchParams(urlParams).get('image');
  // Fallback to session storage if URL parameter is missing
  const storedImageData = sessionStorage.getItem('capturedImage');
  // Use URL param if available, otherwise use stored image
  const imageData = urlImageData || storedImageData;

  // Function to generate the LookMax result
  const generateLookMaxResult = () => {
    if (isLoading) return;
    
    setGeneratingLookMax(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      setShowLookMaxResult(true);
      setGeneratingLookMax(false);
      
      // Scroll to result after small delay
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 1500);
  };
  
  // Function to save the result as image
  const saveAsImage = () => {
    if (!resultRef.current) return;
    
    // Implementation will be added
    toast({
      title: "Coming Soon",
      description: "Save as image feature will be available soon",
    });
  };

  useEffect(() => {
    if (!imageData) {
      toast({
        title: "Image Not Found",
        description: "No face image found. Please try scanning again.",
        variant: "destructive",
      });
      setLocation('/scan');
      return;
    }

    const loadAnalysis = async () => {
      try {
        setIsLoading(true);
        const analysisData = await analyzeFace(imageData);
        setFeatures(analysisData.features);
        setRatings(analysisData.ratings);
        setRecommendations(analysisData.recommendations);
        
        // Store full analysis in session storage to access in other pages
        sessionStorage.setItem('analysisData', JSON.stringify(analysisData));
        
        // Store captured image for result display
        sessionStorage.setItem('capturedImage', imageData);
      } catch (error) {
        console.error("Analysis error:", error);
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your face. Please try again.",
          variant: "destructive",
        });
        setLocation('/scan');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalysis();
  }, [imageData, setLocation]);

  const handleBack = () => {
    setLocation('/scan');
  };

  const goToRatings = () => {
    setLocation('/ratings');
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
        <h1 className="text-2xl font-semibold text-center mb-6">your analysis</h1>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl h-14 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {!showLookMaxResult ? (
              <>
                <div className="flex-1">
                  {features.map((feature, index) => (
                    <FeatureCard 
                      key={index} 
                      feature={feature} 
                      className="cursor-pointer hover:bg-card/90 transition-colors"
                      onClick={goToRatings}
                    />
                  ))}
                </div>
                
                <div className="mt-6 mb-8">
                  <Button 
                    className="w-full py-6 text-lg font-medium rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                    onClick={generateLookMaxResult}
                    disabled={generatingLookMax}
                  >
                    {generatingLookMax ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating LookMax Result...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Get LookMax Result
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col">
                <div 
                  ref={resultRef}
                  className="relative bg-card rounded-2xl overflow-hidden shadow-lg mb-6"
                >
                  {/* Top section with image */}
                  <div className="relative aspect-square w-full bg-black">
                    {imageData && (
                      <img 
                        src={imageData} 
                        alt="Your face" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h2 className="text-xl font-bold">LookMax Result</h2>
                      <p className="text-sm opacity-90">Complete facial analysis</p>
                    </div>
                  </div>
                  
                  {/* Results section */}
                  <div className="p-4 space-y-6">
                    {/* Face shape section */}
                    <div>
                      <h3 className="text-lg font-medium flex items-center mb-2">
                        <Dices className="h-5 w-5 mr-2 text-blue-500" />
                        Face Shape Analysis
                      </h3>
                      <div className="bg-background/50 p-3 rounded-xl">
                        {features.filter(f => f.label === "Face Shape").map((feature, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{feature.label}</span>
                            <span className="font-medium">{feature.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Ratings section */}
                    <div>
                      <h3 className="text-lg font-medium flex items-center mb-2">
                        <BarChart2 className="h-5 w-5 mr-2 text-pink-500" />
                        Facial Ratings
                      </h3>
                      <div className="space-y-3">
                        {ratings.map((rating, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span>{rating.category}</span>
                              <span className="font-medium">{rating.percentage}%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${rating.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Recommendations section */}
                    <div>
                      <h3 className="text-lg font-medium flex items-center mb-2">
                        <Palette className="h-5 w-5 mr-2 text-amber-500" />
                        Recommendations
                      </h3>
                      <div className="space-y-2">
                        {recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className="bg-background/50 p-3 rounded-xl">
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={saveAsImage}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => setLocation('/recommendations')}
                      >
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="mt-2"
                  onClick={() => setShowLookMaxResult(false)}
                >
                  Back to Analysis
                </Button>
              </div>
            )}
          </>
        )}

        <div className="mt-auto">
          {!showLookMaxResult && (
            <>
              <ShareSection />
              
              <div className="flex justify-center mt-4">
                <IndicatorDots totalDots={4} activeDot={1} />
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
