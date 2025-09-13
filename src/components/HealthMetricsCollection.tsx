
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Activity, Weight, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface HealthMetricsCollectionProps {
  onComplete: () => void;
}

const HealthMetricsCollection = ({ onComplete }: HealthMetricsCollectionProps) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    weight: '',
    bmi: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setMetrics(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate BMI if height and weight are available
    if (field === 'weight' && value) {
      // For now, we'll let users enter BMI manually
      // In a real app, you'd want to collect height separately
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Insert health metrics
      const { error: metricsError } = await supabase
        .from('health_metrics')
        .insert({
          user_id: user.id,
          blood_pressure_systolic: metrics.blood_pressure_systolic ? parseInt(metrics.blood_pressure_systolic) : null,
          blood_pressure_diastolic: metrics.blood_pressure_diastolic ? parseInt(metrics.blood_pressure_diastolic) : null,
          heart_rate: metrics.heart_rate ? parseInt(metrics.heart_rate) : null,
          weight: metrics.weight ? parseFloat(metrics.weight) : null,
          bmi: metrics.bmi ? parseFloat(metrics.bmi) : null,
        });

      if (metricsError) throw metricsError;

      // Update profile to mark health metrics as collected
      const { error: profileError } = await updateProfile({
        health_metrics_collected: true
      });

      if (profileError) throw profileError;

      toast.success('Health metrics saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving health metrics:', error);
      toast.error('Failed to save health metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-health-navy-800 dark:text-white">
            Complete Your Health Profile
          </CardTitle>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            Help us provide better care by sharing your basic health metrics
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Pressure */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-health-teal-500" />
                <Label className="text-lg font-semibold text-health-navy-800 dark:text-white">
                  Blood Pressure (mmHg)
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolic" className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    Systolic (Upper)
                  </Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={metrics.blood_pressure_systolic}
                    onChange={(e) => handleInputChange('blood_pressure_systolic', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic" className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    Diastolic (Lower)
                  </Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={metrics.blood_pressure_diastolic}
                    onChange={(e) => handleInputChange('blood_pressure_diastolic', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-health-teal-500" />
                <Label htmlFor="heart_rate" className="text-lg font-semibold text-health-navy-800 dark:text-white">
                  Heart Rate (bpm)
                </Label>
              </div>
              <Input
                id="heart_rate"
                type="number"
                placeholder="72"
                value={metrics.heart_rate}
                onChange={(e) => handleInputChange('heart_rate', e.target.value)}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Weight className="w-5 h-5 text-health-teal-500" />
                <Label htmlFor="weight" className="text-lg font-semibold text-health-navy-800 dark:text-white">
                  Weight (kg)
                </Label>
              </div>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.0"
                value={metrics.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>

            {/* BMI */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-health-teal-500" />
                <Label htmlFor="bmi" className="text-lg font-semibold text-health-navy-800 dark:text-white">
                  BMI
                </Label>
              </div>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                placeholder="22.5"
                value={metrics.bmi}
                onChange={(e) => handleInputChange('bmi', e.target.value)}
              />
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onComplete}
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-primary text-white"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMetricsCollection;
