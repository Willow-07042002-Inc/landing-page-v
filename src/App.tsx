
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import OpenGraphMeta from "@/components/OpenGraphMeta";
import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView";
import ClarityTags from "@/components/ClarityTags";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CreateWill from "./pages/CreateWill";
import AvailabilityMap from "./pages/AvailabilityMap";
import Learn from "./pages/Learn";
import ForLawyers from "./pages/ForLawyers";
import AboutUs from "./pages/AboutUs";
import Giveback from "./pages/Giveback";
import Pitol from "./pages/Pitol";
import Book from "./pages/Book";
import RequestAccess from "./pages/RequestAccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <OpenGraphMeta />
        <GoogleAnalyticsPageView />
        <ClarityTags />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/create-will" element={<CreateWill />} />
          <Route path="/availability-map" element={<AvailabilityMap />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/for-lawyers" element={<ForLawyers />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/giveback" element={<Giveback />} />
          <Route path="/pitol" element={<Pitol />} />
          <Route path="/book" element={<Book />} />
          <Route path="/request-access" element={<RequestAccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
