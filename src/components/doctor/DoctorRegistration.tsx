
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Upload, Shield } from 'lucide-react';

const specializations = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'ent', label: 'ENT' },
  { value: 'urology', label: 'Urology' },
  { value: 'nephrology', label: 'Nephrology' },
  { value: 'pulmonology', label: 'Pulmonology' },
  { value: 'general_medicine', label: 'General Medicine' }
];

const DoctorRegistration = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const consultationTypes = watch('consultation_types') || [];

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('Please log in to register as a doctor');
      return;
    }

    setLoading(true);
    try {
      const doctorData = {
        user_id: user.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        specialization: data.specialization,
        experience_years: parseInt(data.experience_years),
        education: data.education,
        current_hospital: data.current_hospital || null,
        consultation_fee: parseInt(data.consultation_fee),
        consultation_types: data.consultation_types,
        bio: data.bio || null,
      };

      const { error } = await supabase
        .from('doctors')
        .insert(doctorData);

      if (error) {
        throw error;
      }

      toast.success('Doctor profile created successfully! Verification pending.');
      navigate('/doctor-portal');
    } catch (error: any) {
      console.error('Error registering doctor:', error);
      toast.error(error.message || 'Failed to register doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationTypeChange = (type: string, checked: boolean) => {
    const current = consultationTypes || [];
    if (checked) {
      setValue('consultation_types', [...current, type]);
    } else {
      setValue('consultation_types', current.filter((t: string) => t !== type));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center mb-6">
          <Stethoscope className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
          Join as Healthcare Professional
        </h1>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Complete your profile to start providing quality healthcare services
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Doctor Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name', { required: 'Full name is required' })}
                    placeholder="Dr. John Doe"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name.message as string}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="doctor@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select onValueChange={(value) => setValue('specialization', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">{errors.specialization.message as string}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_years">Years of Experience *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    {...register('experience_years', { required: 'Experience is required' })}
                    placeholder="5"
                  />
                  {errors.experience_years && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience_years.message as string}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="consultation_fee">Consultation Fee (₹) *</Label>
                  <Input
                    id="consultation_fee"
                    type="number"
                    min="0"
                    {...register('consultation_fee', { required: 'Consultation fee is required' })}
                    placeholder="500"
                  />
                  {errors.consultation_fee && (
                    <p className="text-red-500 text-sm mt-1">{errors.consultation_fee.message as string}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="education">Education & Qualifications *</Label>
                <Textarea
                  id="education"
                  {...register('education', { required: 'Education details are required' })}
                  placeholder="MBBS, MD - Cardiology, Harvard Medical School"
                  rows={3}
                />
                {errors.education && (
                  <p className="text-red-500 text-sm mt-1">{errors.education.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="current_hospital">Current Hospital/Clinic</Label>
                <Input
                  id="current_hospital"
                  {...register('current_hospital')}
                  placeholder="Apollo Hospital, Mumbai"
                />
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Brief description about your practice and expertise..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Consultation Types *</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="online"
                      checked={consultationTypes.includes('online')}
                      onCheckedChange={(checked) => handleConsultationTypeChange('online', checked as boolean)}
                    />
                    <Label htmlFor="online">Online Consultation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offline"
                      checked={consultationTypes.includes('offline')}
                      onCheckedChange={(checked) => handleConsultationTypeChange('offline', checked as boolean)}
                    />
                    <Label htmlFor="offline">In-Person Consultation</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/doctor-portal')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gradient-primary text-white"
              >
                {loading ? 'Registering...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-health-navy-600 dark:text-health-navy-300">
            <p>• After registration, you'll need to upload KYC documents</p>
            <p>• Admin verification is required before your profile goes live</p>
            <p>• Set up your availability schedule once verified</p>
            <p>• Start receiving patient appointments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRegistration;
