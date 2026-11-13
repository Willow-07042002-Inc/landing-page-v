import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import OpenGraphMeta from "@/components/OpenGraphMeta";
import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView";
import ClarityTags from "@/components/ClarityTags";
import CookieBanner from "@/components/CookieBanner";
import {
  MemberTermsPage,
  RecipientTermsPage,
  FirmAgreementPage,
  PrivacyPage,
  HealthDataNoticePage,
  TermsIndexPage,
  SubprocessorsPage,
  ConnectionsPage,
  RequestDocumentsPage,
} from "./pages/legal/LegalPages";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ForClientsPage from "./pages/ForClientsPage";
import NewsPage from "./pages/NewsPage";
import RegulatoryLibraryPage from "./pages/RegulatoryLibraryPage";
import StateDetailPage from "./pages/StateDetailPage";
import RequestAccess from "./pages/RequestAccess";
import Investors from "./pages/Investors";
import Careers from "./pages/Careers";
import Founding100 from "./pages/Founding100";
import NewYorkStateBar from "./pages/NewYorkStateBar";
import WhereWereLive from "./pages/WhereWereLive";
import ZoomGuide from "./pages/ZoomGuide";

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
        <CookieBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/for-clients" element={<ForClientsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/legislation-by-state" element={<RegulatoryLibraryPage />} />
          <Route path="/legislation-by-state/:slug" element={<StateDetailPage />} />
          {/* Legal set of Nov 13, 2026 (src/pages/legal). The apps link to these paths. */}
          <Route path="/terms" element={<TermsIndexPage />} />
          <Route path="/member-terms" element={<MemberTermsPage />} />
          <Route path="/recipient-terms" element={<RecipientTermsPage />} />
          <Route path="/firm-agreement" element={<FirmAgreementPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/health-data-notice" element={<HealthDataNoticePage />} />
          <Route path="/subprocessors" element={<SubprocessorsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/request-documents" element={<RequestDocumentsPage />} />
          {/* Other names people will try for the same pages */}
          {[
            ["/privacy-policy", "/privacy"],
            ["/terms-of-service", "/terms"],
            ["/terms-and-conditions", "/terms"],
            ["/legal", "/terms"],
            ["/member-agreement", "/member-terms"],
            ["/recipient-agreement", "/recipient-terms"],
            ["/fsa", "/firm-agreement"],
            ["/firm-subscription-agreement", "/firm-agreement"],
            ["/firm-terms", "/firm-agreement"],
            ["/dpa", "/firm-agreement#exhibit-a"],
            ["/data-processing-addendum", "/firm-agreement#exhibit-a"],
            ["/consumer-health-data-notice", "/health-data-notice"],
            ["/health-data", "/health-data-notice"],
            ["/sub-processors", "/subprocessors"],
            ["/integrations", "/connections"],
            ["/connected-services", "/connections"],
            ["/request", "/request-documents"],
            ["/release-request", "/request-documents"],
            ["/document-request", "/request-documents"],
          ].map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/availability" element={<WhereWereLive />} />
          <Route path="/zoom" element={<ZoomGuide />} />
          <Route path="/where-were-live" element={<Navigate to="/availability" replace />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/founding-100" element={<Founding100 />} />
          <Route path="/nysba" element={<NewYorkStateBar />} />
          {/* Spelled-out alias: easier to say out loud at a booth than "nysba" */}
          <Route path="/new-york-state-bar" element={<Navigate to="/nysba" replace />} />
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
