import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/home";
import Scan from "@/pages/scan";
import Analysis from "@/pages/analysis";
import Ratings from "@/pages/ratings";
import Recommendations from "@/pages/recommendations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scan" component={Scan} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/ratings" component={Ratings} />
      <Route path="/recommendations" component={Recommendations} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <div className="max-w-md mx-auto relative pb-16 min-h-screen">
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
