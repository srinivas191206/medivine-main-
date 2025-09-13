
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  FileText, 
  Settings, 
  MessageCircle, 
  Calendar, 
  Moon, 
  Sun, 
  Menu, 
  X,
  LogOut,
  Pill,
  Ambulance,
  Bell,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
// ChatBot component removed

const Navigation = ({ toggleTheme, darkMode }: { toggleTheme: () => void; darkMode: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Chat feature removed
  const location = useLocation();
  const { signOut, user } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/medicines', icon: Pill, label: 'Medicines' },
    { path: '/emergency', icon: Ambulance, label: 'Emergency' },
    { path: '/records', icon: FileText, label: 'Records' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    
    { path: '/doctor-portal', icon: Stethoscope, label: 'Doctor Portal' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/doctor-portal') {
      return location.pathname.startsWith('/doctor-portal');
    }
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img 
                src="/lovable-uploads/c70e9b6c-23f8-4c73-bcd4-6ca330ae9141.png" 
                alt="Medivine Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-health-navy-800 dark:text-white">
              Medivine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 7).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-smooth text-sm ${
                  isActive(item.path)
                    ? 'bg-health-teal-500 text-white shadow-lg'
                    : 'text-health-navy-600 dark:text-health-navy-300 hover:bg-white/20 dark:hover:bg-black/20'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Chat Button - Removed */}
          </div>

          {/* User Actions & Theme Toggle */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 glass-card rounded-lg">
                <User className="w-4 h-4 text-health-navy-600 dark:text-health-navy-300" />
                <span className="text-sm text-health-navy-700 dark:text-health-navy-300">
                  {user.email}
                </span>
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-smooth"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-health-navy-600" />
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-smooth text-health-navy-600 dark:text-health-navy-300"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-smooth"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-health-navy-600 dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-health-navy-600 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Chat Interface - Removed */}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 animate-slide-up">
            <div className="space-y-2">
              {user && (
                <div className="flex items-center space-x-3 px-4 py-3 glass-card rounded-xl mb-4">
                  <User className="w-5 h-5 text-health-navy-600 dark:text-health-navy-300" />
                  <span className="font-medium text-health-navy-700 dark:text-health-navy-300">
                    {user.email}
                  </span>
                </div>
              )}
              
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-smooth ${
                    isActive(item.path)
                      ? 'bg-health-teal-500 text-white shadow-lg'
                      : 'text-health-navy-600 dark:text-health-navy-300 hover:bg-white/20 dark:hover:bg-black/20'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Chat Button - Removed */}
              
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-smooth text-health-navy-600 dark:text-health-navy-300 hover:bg-white/20 dark:hover:bg-black/20 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
