import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Heart, 
  Activity, 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp,
  Bell,
  Plus,
  Download,
  MessageCircle,
  Pill,
  Ambulance
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import QuickActions from './healthcare/QuickActions';

const UserDashboard = ({ user: propUser }: { user?: any }) => {
  const { user: authUser, profile } = useAuth();
  // Use propUser if available (from simplified auth), otherwise fall back to authUser
  const user = propUser || authUser;
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your appointment with Dr. Rajesh Kumar is scheduled for tomorrow at 2:00 PM", time: "2 hours ago", type: "appointment" },
    { id: 2, message: "Medicine delivery scheduled for today between 4-6 PM", time: "5 hours ago", type: "delivery" },
    { id: 3, message: "Don't forget to take your Paracetamol at 8:00 PM", time: "1 day ago", type: "reminder" }
  ]);

  const recentOrders = [
    {
      id: 1,
      medicines: ['Paracetamol 500mg', 'Amoxicillin 250mg'],
      status: 'Delivered',
      date: '2024-01-15',
      amount: 245
    },
    {
      id: 2,
      medicines: ['Cetirizine 10mg'],
      status: 'In Transit',
      date: '2024-01-16',
      amount: 40
    }
  ];

  useEffect(() => {
    fetchHealthMetrics();
    fetchAppointments();
  }, [user]);

  const fetchHealthMetrics = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching health metrics:', error);
      } else {
        setHealthMetrics(data?.[0] || null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    if (!user?.id) return;
    
    try {
      // For demo user IDs that aren't UUIDs, get from localStorage
      if (typeof user.id === 'string' && user.id.startsWith('dev-user-')) {
        const storedAppointments = JSON.parse(localStorage.getItem(`appointments_${user.id}`) || '[]');
        
        // Filter for upcoming appointments only
        const today = new Date().toISOString().split('T')[0];
        const upcomingAppointments = storedAppointments.filter((apt: any) => apt.date >= today);
        
        setAppointments(upcomingAppointments);
        return;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors(full_name, specialization, current_hospital)
        `)
        .eq('patient_id', user.id)
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getHealthMetricsDisplay = () => {
    if (!healthMetrics) {
      return [
        { label: "Blood Pressure", value: "Not recorded", status: "unknown", trend: "stable", color: "text-gray-400" },
        { label: "Heart Rate", value: "Not recorded", status: "unknown", trend: "stable", color: "text-gray-400" },
        { label: "Weight", value: "Not recorded", status: "unknown", trend: "stable", color: "text-gray-400" },
        { label: "BMI", value: "Not recorded", status: "unknown", trend: "stable", color: "text-gray-400" }
      ];
    }

    const getBPStatus = (systolic: number, diastolic: number) => {
      if (systolic < 120 && diastolic < 80) return { status: "normal", color: "text-green-600" };
      if (systolic < 140 && diastolic < 90) return { status: "elevated", color: "text-yellow-600" };
      return { status: "high", color: "text-red-600" };
    };

    const getHRStatus = (hr: number) => {
      if (hr >= 60 && hr <= 100) return { status: "normal", color: "text-green-600" };
      return { status: "abnormal", color: "text-yellow-600" };
    };

    const getBMIStatus = (bmi: number) => {
      if (bmi >= 18.5 && bmi <= 24.9) return { status: "normal", color: "text-green-600" };
      if (bmi < 18.5) return { status: "underweight", color: "text-yellow-600" };
      if (bmi <= 29.9) return { status: "overweight", color: "text-yellow-600" };
      return { status: "obese", color: "text-red-600" };
    };

    const bpStatus = healthMetrics.blood_pressure_systolic && healthMetrics.blood_pressure_diastolic 
      ? getBPStatus(healthMetrics.blood_pressure_systolic, healthMetrics.blood_pressure_diastolic)
      : { status: "unknown", color: "text-gray-400" };

    const hrStatus = healthMetrics.heart_rate 
      ? getHRStatus(healthMetrics.heart_rate)
      : { status: "unknown", color: "text-gray-400" };

    const bmiStatus = healthMetrics.bmi 
      ? getBMIStatus(healthMetrics.bmi)
      : { status: "unknown", color: "text-gray-400" };

    return [
      { 
        label: "Blood Pressure", 
        value: healthMetrics.blood_pressure_systolic && healthMetrics.blood_pressure_diastolic 
          ? `${healthMetrics.blood_pressure_systolic}/${healthMetrics.blood_pressure_diastolic}` 
          : "Not recorded", 
        status: bpStatus.status, 
        trend: "stable", 
        color: bpStatus.color 
      },
      { 
        label: "Heart Rate", 
        value: healthMetrics.heart_rate ? `${healthMetrics.heart_rate} bpm` : "Not recorded", 
        status: hrStatus.status, 
        trend: "stable", 
        color: hrStatus.color 
      },
      { 
        label: "Weight", 
        value: healthMetrics.weight ? `${healthMetrics.weight} kg` : "Not recorded", 
        status: "normal", 
        trend: "stable", 
        color: "text-blue-600" 
      },
      { 
        label: "BMI", 
        value: healthMetrics.bmi ? healthMetrics.bmi.toString() : "Not recorded", 
        status: bmiStatus.status, 
        trend: "stable", 
        color: bmiStatus.color 
      }
    ];
  };

  const displayName = (user as any)?.name && (user as any).name.trim() 
    ? (user as any).name 
    : profile?.name && profile.name.trim() 
      ? profile.name 
      : user?.user_metadata?.name && user.user_metadata.name.trim()
        ? user.user_metadata.name
        : user?.email?.split('@')[0] || 'User';

  const healthMetricsToShow = getHealthMetricsDisplay();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Your health dashboard is ready. How can we help you today?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {healthMetricsToShow.map((metric, index) => (
          <div key={index} className="glass-card rounded-2xl p-4 hover-lift transition-smooth">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-health-navy-600 dark:text-health-navy-300">
                  {metric.label}
                </span>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'normal' ? 'bg-green-100 text-green-600' :
                metric.status === 'elevated' || metric.status === 'overweight' || metric.status === 'underweight' ? 'bg-yellow-100 text-yellow-600' :
                metric.status === 'high' || metric.status === 'obese' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {metric.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
              Upcoming Appointments
            </h2>
            <button className="p-2 gradient-primary rounded-xl hover-lift transition-smooth">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-health-navy-800 dark:text-white">
                        {/* Handle both localStorage and database appointment formats */}
                        {appointment.doctor || appointment.doctors?.full_name || 'Unknown Doctor'}
                      </h3>
                      <p className="text-sm text-health-teal-600">
                        {appointment.specialization || appointment.doctors?.specialization || 'General'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-health-navy-600 dark:text-health-navy-300">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {/* Handle both date formats */}
                          {appointment.date || appointment.appointment_date} at {appointment.time || appointment.appointment_time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-health-navy-600 dark:text-health-navy-300">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.hospital || appointment.doctors?.current_hospital || 'Healthcare Center'}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      appointment.consultation_type === 'online' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {appointment.consultation_type === 'online' ? 'Online' : 'In-person'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-health-navy-300 mb-4" />
              <p className="text-health-navy-600 dark:text-health-navy-300">
                No appointments booked yet.
              </p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
              Recent Orders
            </h2>
            <button className="p-2 gradient-primary rounded-xl hover-lift transition-smooth">
              <Pill className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-health-navy-800 dark:text-white">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                        {order.medicines.join(', ')}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-health-navy-600 dark:text-health-navy-300">
                        <Clock className="w-4 h-4" />
                        <span>{order.date}</span>
                      </div>
                      <div className="text-lg font-bold text-health-teal-600 mt-1">
                        ₹{order.amount}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Pill className="w-12 h-12 mx-auto text-health-navy-300 mb-4" />
              <p className="text-health-navy-600 dark:text-health-navy-300">
                No recent orders
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
            Recent Notifications
          </h2>
          <Bell className="w-6 h-6 text-health-teal-500" />
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4 p-4 neuro rounded-2xl hover-lift transition-smooth">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                notification.type === 'appointment' ? 'bg-blue-500' :
                notification.type === 'delivery' ? 'bg-green-500' :
                notification.type === 'reminder' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-health-navy-800 dark:text-white">
                  {notification.message}
                </p>
                <span className="text-sm text-health-navy-600 dark:text-health-navy-300">
                  {notification.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
