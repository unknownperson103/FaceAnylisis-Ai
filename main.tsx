import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as faceapi from "face-api.js";

// Load face-api.js models when the app starts
async function loadModels() {
  try {
    console.log("Starting to load face-api models...");
    
    // Load models one by one with retries to be more resilient
    const modelLoaders = [
      { name: 'tinyFaceDetector', loader: () => faceapi.nets.tinyFaceDetector.loadFromUri('/models') },
      { name: 'faceLandmark68', loader: () => faceapi.nets.faceLandmark68Net.loadFromUri('/models') },
      { name: 'faceRecognition', loader: () => faceapi.nets.faceRecognitionNet.loadFromUri('/models') }
    ];
    
    for (const model of modelLoaders) {
      try {
        await model.loader();
        console.log(`Loaded ${model.name} model`);
      } catch (err) {
        console.error(`Failed to load ${model.name} model:`, err);
      }
    }
    
    console.log("Face model loading completed");
  } catch (error) {
    console.error("Error in model loading process:", error);
  }
}

// Start loading models in the background
loadModels();

createRoot(document.getElementById("root")!).render(<App />);
