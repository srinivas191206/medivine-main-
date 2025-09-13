
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Heart, Activity, Scale, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileCompletionProps {
  onComplete: () => void;
}

const ProfileCompletion = ({ onComplete }: ProfileCompletionProps) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    weight: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    bmi: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateBMI = (weight: number, height: number = 170) => {
    // Using a default height of 170cm if not provided
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        health_metrics_collected: true
      });

      if (profileError) throw profileError;

      // Save health metrics if any are provided
      const hasHealthMetrics = formData.weight || formData.bloodPressureSystolic || 
                              formData.bloodPressureDiastolic || formData.heartRate || formData.bmi;

      if (hasHealthMetrics && user) {
        const healthMetricsData: any = {
          user_id: user.id
        };

        if (formData.weight) {
          healthMetricsData.weight = parseFloat(formData.weight);
          // Auto-calculate BMI if weight is provided
          if (!formData.bmi) {
            healthMetricsData.bmi = parseFloat(calculateBMI(parseFloat(formData.weight)));
          }
        }

        if (formData.bmi) {
          healthMetricsData.bmi = parseFloat(formData.bmi);
        }

        if (formData.bloodPressureSystolic) {
          healthMetricsData.blood_pressure_systolic = parseInt(formData.bloodPressureSystolic);
        }

        if (formData.bloodPressureDiastolic) {
          healthMetricsData.blood_pressure_diastolic = parseInt(formData.bloodPressureDiastolic);
        }

        if (formData.heartRate) {
          healthMetricsData.heart_rate = parseInt(formData.heartRate);
        }

        const { error: healthError } = await supabase
          .from('health_metrics')
          .insert(healthMetricsData);

        if (healthError) {
          console.error('Error saving health metrics:', healthError);
          // Don't throw error here, just log it
        }
      }

      toast.success('Profile completed successfully!');
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-health-navy-800 dark:text-white">
            Complete Your Profile
          </CardTitle>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            Please provide your details and health metrics to personalize your experience
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Health Metrics (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                    Weight (kg)
                  </Label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight in kg"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="pl-10"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bmi" className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                    BMI
                  </Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                    <Input
                      id="bmi"
                      type="number"
                      placeholder="BMI (auto-calculated from weight)"
                      value={formData.bmi}
                      onChange={(e) => handleInputChange('bmi', e.target.value)}
                      className="pl-10"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRate" className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                    Heart Rate (bpm)
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="Enter heart rate"
                      value={formData.heartRate}
                      onChange={(e) => handleInputChange('heartRate', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                    Blood Pressure
                  </Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-health-navy-400" />
                      <Input
                        type="number"
                        placeholder="Systolic"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) => handleInputChange('bloodPressureSystolic', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <span className="self-center text-health-navy-600 dark:text-health-navy-300">/</span>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Diastolic"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) => handleInputChange('bloodPressureDiastolic', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white mt-6"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
