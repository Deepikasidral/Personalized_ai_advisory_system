import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Registration from "./pages/RegistrationForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/community" element={<Community />} />
          {/* Placeholder routes for other features */}
          <Route path="/calendar" element={<Index />} />
          <Route path="/market" element={<Index />} />
          <Route path="/schemes" element={<Index />} />
          <Route path="/health" element={<Index />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
