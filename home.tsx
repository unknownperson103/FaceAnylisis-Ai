import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Image } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const [_, setLocation] = useLocation();

  const goToScan = () => {
    setLocation("/scan");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">LookMax AI</CardTitle>
          <CardDescription className="text-muted-foreground">
            Advanced facial analysis and personalized recommendations
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-0">
              <CardContent className="p-6 flex flex-col items-center">
                <Camera className="h-10 w-10 mb-2" />
                <span className="text-sm text-muted-foreground text-center">Face Shape Analysis</span>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0">
              <CardContent className="p-6 flex flex-col items-center">
                <Image className="h-10 w-10 mb-2" />
                <span className="text-sm text-muted-foreground text-center">Detailed Ratings</span>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-0">
              <CardContent className="p-6 flex flex-col items-center">
                <svg className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-muted-foreground text-center">Feature Evaluation</span>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-0">
              <CardContent className="p-6 flex flex-col items-center">
                <svg className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-muted-foreground text-center">Personalized Tips</span>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button 
            onClick={goToScan} 
            size="lg" 
            className="w-full"
          >
            Start Facial Analysis
          </Button>
        </CardFooter>
      </motion.div>
    </div>
  );
}
