
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppointmentsPage from "./pages/AppointmentsPage";
import MedicinesPage from "./pages/MedicinesPage";
import MedicineSearchPage from "./pages/MedicineSearchPage";
import EmergencyPage from "./pages/EmergencyPage";
import RecordsPage from "./pages/RecordsPage";
import RemindersPage from "./pages/RemindersPage";
import DoctorPortalPage from "./pages/DoctorPortalPage";
import ProfileCreation from "./components/ProfileCreation";
import DocumentUpload from "./components/DocumentUpload";
import SettingsPanel from "./components/SettingsPanel";
import FeedbackHelp from "./components/FeedbackHelp";
// ChatBot components removed
import BookingSystem from "./components/BookingSystem";
import Navigation from "./components/Navigation";
import AuthenticationFlow from "./components/AuthenticationFlow";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
              <p className="text-health-navy-600 dark:text-health-navy-300">Loading...</p>
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show authentication flow if user is not logged in
  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900">
            <AuthenticationFlow 
              onAuthenticated={() => {}} 
              setUser={() => {}} // Not needed with useAuth hook
            />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Main app with authenticated user
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation toggleTheme={toggleTheme} darkMode={darkMode} />
          <Routes>
            <Route path="/" element={<Index user={user} setUser={() => {}} />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/search" element={<MedicineSearchPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/doctor-portal/*" element={<DoctorPortalPage />} />
            <Route path="/profile" element={<ProfileCreation user={user} />} />
            <Route path="/documents" element={<DocumentUpload />} />
            <Route path="/settings" element={<SettingsPanel toggleTheme={toggleTheme} darkMode={darkMode} />} />
            <Route path="/feedback" element={<FeedbackHelp />} />
            <Route path="/booking" element={<BookingSystem />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* ChatBot feature removed */}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
