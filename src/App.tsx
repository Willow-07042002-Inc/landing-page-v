import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import OpenGraphMeta from "@/components/OpenGraphMeta";
import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView";
import ClarityTags from "@/components/ClarityTags";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ForClientsPage from "./pages/ForClientsPage";
import RequestAccess from "./pages/RequestAccess";
import Investors from "./pages/Investors";

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
          <Route path="/" element={<Home />} />
          <Route path="/for-clients" element={<ForClientsPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="/investors" element={<Investors />} />
          {/* Retired pages — old links land somewhere sensible instead of a 404 */}
          {["/attorneys", "/old-home", "/clients", "/for-lawyers", "/contact", "/create-will", "/availability-map", "/learn", "/about-us", "/pitol"].map((p) => (
            <Route key={p} path={p} element={<Navigate to="/" replace />} />
          ))}
          <Route path="/book" element={<Navigate to="/request-access" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
