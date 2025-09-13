
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, CheckCircle, X, MessageSquare, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      // First get doctor profile
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!doctorData) return;

      // Then fetch appointments with patient profile data
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles!appointments_patient_id_fkey (
            name,
            email,
            phone
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );

      toast.success(`Appointment ${status}`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const completeConsultation = async () => {
    if (!selectedAppointment) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed' as AppointmentStatus,
          prescription,
          notes
        })
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'completed', prescription, notes }
            : apt
        )
      );

      toast.success('Consultation completed successfully');
      setShowConsultationDialog(false);
      setPrescription('');
      setNotes('');
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast.error('Failed to complete consultation');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      confirmed: { color: 'bg-blue-500', text: 'Confirmed' },
      completed: { color: 'bg-green-500', text: 'Completed' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled' },
      no_show: { color: 'bg-gray-500', text: 'No Show' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return apt.appointment_date === today;
    }
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
          <p className="text-health-navy-600 dark:text-health-navy-300">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
          Appointments Management
        </h1>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'today', 'pending', 'confirmed', 'completed'].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterType)}
              className={filter === filterType ? "gradient-primary text-white" : ""}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-health-navy-300 mb-4" />
              <h3 className="text-lg font-semibold text-health-navy-600 dark:text-health-navy-300 mb-2">
                No appointments found
              </h3>
              <p className="text-health-navy-500 dark:text-health-navy-400 text-center">
                {filter === 'today' 
                  ? "You don't have any appointments today."
                  : `No ${filter === 'all' ? '' : filter + ' '}appointments available.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Patient Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-health-teal-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-health-navy-800 dark:text-white">
                          {appointment.profiles?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                          {appointment.profiles?.email}
                        </p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-health-navy-500" />
                        <span>{format(new Date(appointment.appointment_date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-health-navy-500" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.consultation_type === 'online' ? (
                          <Video className="w-4 h-4 text-health-navy-500" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-health-navy-500" />
                        )}
                        <span className="capitalize">{appointment.consultation_type}</span>
                      </div>
                    </div>

                    {/* Symptoms */}
                    {appointment.symptoms && (
                      <div>
                        <p className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                          Symptoms:
                        </p>
                        <p className="text-sm text-health-navy-600 dark:text-health-navy-400">
                          {appointment.symptoms}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(appointment.status)}
                    
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          className="gradient-primary text-white"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowConsultationDialog(true);
                          }}
                        >
                          Start Consultation
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Consultation Dialog */}
      <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Prescription</label>
              <Textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription details..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or recommendations..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConsultationDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="gradient-primary text-white"
                onClick={completeConsultation}
              >
                Complete Consultation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;
