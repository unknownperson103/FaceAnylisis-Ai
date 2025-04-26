import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { Camera, RefreshCw, UploadCloud, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBar } from "@/components/StatusBar";
import { IndicatorDots } from "@/components/IndicatorDots";
import { FaceScanOverlay } from "@/components/FaceScanOverlay";
import { toast } from "@/hooks/use-toast";
import { detectFace } from "@/lib/face-analysis";
import { cn } from "@/lib/utils";
import * as faceapi from 'face-api.js';

export default function Scan() {
  const [_, setLocation] = useLocation();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState(false);

  // Create a ref to track face detection status for timeout
  const faceDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const faceDetectedRef = useRef(faceDetected);
  
  // Update ref when state changes
  useEffect(() => {
    faceDetectedRef.current = faceDetected;
  }, [faceDetected]);

  // Check if face is detected
  useEffect(() => {
    if (!isCameraReady || !webcamRef.current) return;

    // Load face detection models
    const loadModels = async () => {
      try {
        if (!faceapi.nets.tinyFaceDetector.isLoaded) {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          ]);
          console.log('Face detection models loaded successfully');
        }
      } catch (err) {
        console.error("Error loading face detection models:", err);
      }
    };
    
    loadModels();
    
    // Force enable the capture button after 5 seconds
    // This ensures users can take photos even if face detection fails
    faceDetectionTimerRef.current = setTimeout(() => {
      if (!faceDetectedRef.current) {
        console.log('Enabling capture button as fallback');
        setFaceDetected(true);
      }
    }, 5000);

    const checkForFace = async () => {
      try {
        if (webcamRef.current && webcamRef.current.video) {
          const detection = await detectFace(webcamRef.current.video);
          setFaceDetected(!!detection);
        }
      } catch (err) {
        console.error("Face detection error:", err);
        // Enable the button as fallback
        setFaceDetected(true);
      }
    };

    // Check less frequently to improve performance
    const intervalId = setInterval(checkForFace, 1000);
    return () => {
      clearInterval(intervalId);
      // Clean up timeout on unmount
      if (faceDetectionTimerRef.current) {
        clearTimeout(faceDetectionTimerRef.current);
      }
    };
  }, [isCameraReady]);

  const handleUserMedia = () => {
    setIsCameraReady(true);
    setError(null);
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error("Camera error:", error);
    // Switch to upload mode instead of showing error
    setUploadMode(true);
    toast({
      title: "Camera Unavailable",
      description: "Switched to image upload mode as camera access failed.",
      variant: "default",
    });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 3MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsCapturing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      
      try {
        // Load the image to check for faces
        const img = new Image();
        img.src = imageDataUrl;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const detection = await detectFace(img);
        
        if (!detection) {
          setIsCapturing(false);
          toast({
            title: "No Face Detected",
            description: "Please upload an image with a clear face",
            variant: "destructive",
          });
          return;
        }
        
        // Process the image
        setCapturedImage(imageDataUrl);
        sessionStorage.setItem('capturedImage', imageDataUrl);
        
        // Navigate to analysis page
        setTimeout(() => {
          setLocation(`/analysis?image=${encodeURIComponent(imageDataUrl)}`);
        }, 1500);
      } catch (err) {
        console.error("Upload error:", err);
        setIsCapturing(false);
        toast({
          title: "Upload Failed",
          description: "There was an error processing your image",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsDataURL(file);
  };

  const captureImage = async () => {
    if (!webcamRef.current) return;
    
    setIsCapturing(true);
    
    try {
      // First ensure that camera is fully ready
      if (!webcamRef.current.video || webcamRef.current.video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
        // Wait a moment to ensure camera is ready
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Capture image
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Failed to capture image");
      }
      
      // Set captured image for display
      setCapturedImage(imageSrc);
      
      // Store in sessionStorage in case of navigation issues
      sessionStorage.setItem('capturedImage', imageSrc);
      
      // Add a fake delay for better user feedback
      setTimeout(() => {
        // Navigate to analysis page with the captured image data
        setLocation(`/analysis?image=${encodeURIComponent(imageSrc)}`);
      }, 1500);
    } catch (err) {
      console.error("Capture error:", err);
      toast({
        title: "Capture Failed",
        description: "Failed to capture image. Please try again.",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };

  const retryCapture = () => {
    setCapturedImage(null);
    setIsCapturing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      <StatusBar showBack={false} />

      <div className="px-5 pt-2 pb-10 flex flex-col flex-1">
        <h1 className="text-2xl font-semibold text-center mb-6">your scan</h1>
        
        <div className="relative bg-card rounded-3xl overflow-hidden aspect-[3/4] mb-6">
          {uploadMode ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center text-muted-foreground">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <UploadCloud className="h-20 w-20 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-medium text-foreground mb-1">Upload a photo</h3>
                <p className="mb-4 text-sm">Please select a clear photo of your face</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="default"
                  className="mx-auto mb-2"
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Choose File</>
                  )}
                </Button>
                <Button 
                  onClick={() => {
                    setUploadMode(false);
                    window.location.reload();
                  }}
                  variant="ghost"
                  className="mt-2 text-xs"
                >
                  Try camera again
                </Button>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="h-20 w-20 mx-auto mb-2 text-muted" />
                <p>{error}</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Retry Camera
                  </Button>
                  <Button 
                    onClick={() => setUploadMode(true)}
                    variant="default"
                  >
                    Upload Photo
                  </Button>
                </div>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background bg-opacity-50 flex items-center justify-center">
                <RefreshCw className="h-10 w-10 animate-spin text-foreground" />
                <span className="sr-only">Processing...</span>
              </div>
            </div>
          ) : (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                videoConstraints={{
                  facingMode: "user",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                className="w-full h-full object-cover"
                mirrored={true}
                style={{
                  transform: 'scaleX(-1)',
                }}
              />
              <FaceScanOverlay />
            </>
          )}
          
          {!capturedImage && isCameraReady && !uploadMode && (
            <div 
              className="absolute bottom-5 left-0 right-0 flex justify-center items-center"
            >
              <div className="flex flex-row gap-4 items-center">
                <Button
                  onClick={() => setUploadMode(true)}
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-background/80 hover:bg-background shadow-md"
                  aria-label="Upload photo"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                
                <Button
                  disabled={!faceDetected || isCapturing}
                  onClick={captureImage}
                  size="lg"
                  className={cn(
                    "rounded-full h-16 w-16 p-0 bg-primary hover:bg-primary/90 transition-all shadow-md",
                    faceDetected ? "opacity-100" : "opacity-40"
                  )}
                  aria-label="Take photo"
                >
                  <Camera className="h-8 w-8 text-white" />
                  <span className="sr-only">Capture</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center mt-auto">
          {!uploadMode && (
            <p className="text-sm text-muted-foreground mb-4">
              {faceDetected 
                ? "Face detected. Tap the button to capture." 
                : "Position your face in the frame"}
            </p>
          )}
          
          <IndicatorDots totalDots={4} activeDot={0} className="mt-2" />
        </div>
      </div>
    </motion.div>
  );
}
