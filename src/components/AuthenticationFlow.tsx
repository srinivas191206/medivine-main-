import React, { useState } from 'react';
import { User, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AuthenticationFlowProps {
  onAuthenticated: () => void;
  setUser: (user: any) => void;
}

const AuthenticationFlow = ({ onAuthenticated, setUser }: AuthenticationFlowProps) => {
  const { signIn, signUp, signInWithOtp, verifyOtp, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp' | 'verify-otp'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    otpToken: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast.error(error.message || 'Login failed');
      } else {
        toast.success('Login successful!');
        onAuthenticated();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone
      });
      
      if (error) {
        toast.error(error.message || 'Signup failed');
      } else {
        toast.success('Account created! Please check your email for verification.');
        setAuthMode('login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email) {
      toast.error('Please enter your email');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signInWithOtp(formData.email);
      if (error) {
        toast.error(error.message || 'Failed to send OTP');
      } else {
        toast.success('OTP sent to your email!');
        setAuthMode('verify-otp');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.otpToken) {
      toast.error('Please enter the OTP code');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await verifyOtp(formData.email, formData.otpToken);
      if (error) {
        toast.error(error.message || 'Invalid OTP');
      } else {
        toast.success('Login successful!');
        onAuthenticated();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAuthForm = () => {
    if (authMode === 'verify-otp') {
      return (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
              Enter OTP Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
              <input
                type="text"
                value={formData.otpToken}
                onChange={(e) => handleInputChange('otpToken', e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
            <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
              Check your email ({formData.email}) for the verification code
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 gradient-primary text-white rounded-xl font-semibold hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify & Login</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="w-full py-2 text-health-navy-600 dark:text-health-navy-300 hover:text-health-teal-500 transition-smooth"
          >
            Back to Login
          </button>
        </form>
      );
    }

    if (authMode === 'otp') {
      return (
        <form onSubmit={handleOtpLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 gradient-primary text-white rounded-xl font-semibold hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <span>Send OTP</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="w-full py-2 text-health-navy-600 dark:text-health-navy-300 hover:text-health-teal-500 transition-smooth"
          >
            Back to Login
          </button>
        </form>
      );
    }

    if (authMode === 'signup') {
      return (
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-health-navy-400 hover:text-health-navy-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 gradient-primary text-white rounded-xl font-semibold hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-health-navy-600 dark:text-health-navy-300 hover:text-health-teal-500 transition-smooth"
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      );
    }

    // Default login form
    return (
      <form onSubmit={handleEmailLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 glass-card rounded-xl border-0 focus:ring-2 focus:ring-health-teal-500 transition-smooth"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-health-navy-400 hover:text-health-navy-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 gradient-primary text-white rounded-xl font-semibold hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => setAuthMode('otp')}
            className="text-health-navy-600 dark:text-health-navy-300 hover:text-health-teal-500 transition-smooth text-sm"
          >
            Login with OTP instead
          </button>
          <div>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className="text-health-navy-600 dark:text-health-navy-300 hover:text-health-teal-500 transition-smooth"
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </div>
      </form>
    );
  };

  const getAuthTitle = () => {
    switch (authMode) {
      case 'signup':
        return 'Create Your Account';
      case 'otp':
        return 'Login with OTP';
      case 'verify-otp':
        return 'Verify OTP';
      default:
        return 'Welcome Back';
    }
  };

  const getAuthSubtitle = () => {
    switch (authMode) {
      case 'signup':
        return 'Join Medivine to access healthcare services';
      case 'otp':
        return 'We\'ll send a verification code to your email';
      case 'verify-otp':
        return 'Enter the code sent to your email';
      default:
        return 'Sign in to your Medivine account';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl animate-float">
              <img 
                src="/lovable-uploads/c70e9b6c-23f8-4c73-bcd4-6ca330ae9141.png" 
                alt="Medivine Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-health-teal-500/20 animate-ping"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-health-navy-800 dark:text-white">
              {getAuthTitle()}
            </h1>
            <p className="text-lg text-health-navy-600 dark:text-health-navy-300 max-w-md mx-auto">
              {getAuthSubtitle()}
            </p>
          </div>

          {renderAuthForm()}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationFlow;