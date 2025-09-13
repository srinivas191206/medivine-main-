
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, Users, FileText, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalEarnings: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDoctorProfile();
      fetchStats();
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching doctor profile:', error);
        return;
      }

      setDoctorProfile(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { data: todayAppts } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', today);

      // Fetch earnings
      const { data: earnings } = await supabase
        .from('doctor_earnings')
        .select('doctor_earning');

      // Fetch appointment stats
      const { data: allAppts } = await supabase
        .from('appointments')
        .select('status');

      const totalEarnings = earnings?.reduce((sum, earning) => sum + earning.doctor_earning, 0) || 0;
      const pendingAppts = allAppts?.filter(apt => apt.status === 'pending').length || 0;
      const completedAppts = allAppts?.filter(apt => apt.status === 'completed').length || 0;

      setStats({
        todayAppointments: todayAppts?.length || 0,
        totalEarnings,
        pendingAppointments: pendingAppts,
        completedAppointments: completedAppts
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (!doctorProfile) return null;
    
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Verification Pending', icon: Clock },
      approved: { color: 'bg-green-500', text: 'Verified', icon: CheckCircle },
      rejected: { color: 'bg-red-500', text: 'Verification Rejected', icon: AlertCircle },
      under_review: { color: 'bg-blue-500', text: 'Under Review', icon: Clock }
    };

    const config = statusConfig[doctorProfile.verification_status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
          <p className="text-health-navy-600 dark:text-health-navy-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-4">
          Welcome to Doctor Portal
        </h1>
        <p className="text-health-navy-600 dark:text-health-navy-300 mb-8 max-w-md mx-auto">
          Join our platform as a healthcare professional and start providing quality care to patients.
        </p>
        <Button 
          onClick={() => navigate('/doctor-portal/register')} 
          className="gradient-primary text-white hover:opacity-90"
          size="lg"
        >
          Register as Doctor
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
            Welcome, Dr. {doctorProfile.full_name}
          </h1>
          <p className="text-health-navy-600 dark:text-health-navy-300 mt-1">
            {doctorProfile.specialization.replace('_', ' ').toUpperCase()} Specialist
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getVerificationStatus()}
          <Button
            onClick={() => navigate('/doctor-portal/availability')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage Availability
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-health-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              {stats.todayAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              ₹{stats.totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              {stats.pendingAppointments}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-health-navy-800 dark:text-white">
              {stats.completedAppointments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card hover-lift cursor-pointer" onClick={() => navigate('/doctor-portal/appointments')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-health-teal-500" />
              Manage Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              View and manage your upcoming appointments, accept or reject bookings.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift cursor-pointer" onClick={() => navigate('/doctor-portal/earnings')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Earnings & Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Track your earnings, view payment history and generate reports.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift cursor-pointer" onClick={() => navigate('/doctor-portal/documents')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Documents & KYC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Upload and manage your professional documents and certifications.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-health-navy-600 dark:text-health-navy-300">
                Experience
              </label>
              <p className="text-health-navy-800 dark:text-white">
                {doctorProfile.experience_years} years
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-health-navy-600 dark:text-health-navy-300">
                Consultation Fee
              </label>
              <p className="text-health-navy-800 dark:text-white">
                ₹{doctorProfile.consultation_fee}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-health-navy-600 dark:text-health-navy-300">
                Hospital
              </label>
              <p className="text-health-navy-800 dark:text-white">
                {doctorProfile.current_hospital || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-health-navy-600 dark:text-health-navy-300">
                Status
              </label>
              <p className="text-health-navy-800 dark:text-white">
                {doctorProfile.is_available ? 'Available' : 'Unavailable'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
