
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserDashboard from '../components/UserDashboard';
import HealthMetricsCollection from '../components/HealthMetricsCollection';
import ProfileCompletion from '../components/ProfileCompletion';
import { useAuth } from '@/hooks/useAuth';

const Index = ({ user: propUser, setUser }: { user: any; setUser: (user: any) => void }) => {
  const { user: authUser, profile, loading } = useAuth();
  // Use the authenticated user from useAuth hook instead of propUser
  const user = authUser;
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showHealthMetrics, setShowHealthMetrics] = useState(false);

  useEffect(() => {
    if (user && profile && !loading) {
      // Check if user needs to complete their profile (name is missing or empty)
      const hasName = profile.name && profile.name.trim();
      
      if (!hasName) {
        setShowProfileCompletion(true);
        setShowHealthMetrics(false);
      } else if (!profile.health_metrics_collected) {
        setShowProfileCompletion(false);
        setShowHealthMetrics(true);
      } else {
        setShowProfileCompletion(false);
        setShowHealthMetrics(false);
      }
    } else {
      setShowProfileCompletion(false);
      setShowHealthMetrics(false);
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
          <p className="text-health-navy-600 dark:text-health-navy-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication is now handled in App.tsx, so we can assume user exists here
  
  // Show profile completion form if user needs to enter their name
  if (showProfileCompletion) {
    return (
      <ProfileCompletion 
        onComplete={() => setShowProfileCompletion(false)} 
      />
    );
  }

  // Show health metrics collection form if needed
  if (showHealthMetrics) {
    return (
      <HealthMetricsCollection 
        onComplete={() => setShowHealthMetrics(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900">
      <main className="pt-20 pb-6 px-4 max-w-7xl mx-auto">
        <Routes>
          <Route path="/*" element={<UserDashboard user={user} />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
