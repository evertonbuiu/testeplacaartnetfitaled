import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SchematicPage from "./pages/SchematicPage";
import PCBPage from "./pages/PCBPage";
import DisplayPCBPage from "./pages/DisplayPCBPage";
import OutputPCBPage from "./pages/OutputPCBPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/schematic" element={<SchematicPage />} />
          <Route path="/pcb" element={<PCBPage />} />
        <Route path="/display-pcb" element={<DisplayPCBPage />} />
        <Route path="/output-pcb" element={<OutputPCBPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
