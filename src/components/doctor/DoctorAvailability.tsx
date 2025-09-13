
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const days = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const DoctorAvailability = () => {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDoctorProfile();
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    try {
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (doctorData) {
        setDoctorId(doctorData.id);
        fetchAvailability(doctorData.id);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  const fetchAvailability = async (docId: string) => {
    try {
      const { data, error } = await supabase
        .from('doctor_availability')
        .select('*')
        .eq('doctor_id', docId)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailability(prev => [...prev, {
      id: `temp-${Date.now()}`,
      day_of_week: 1,
      start_time: '09:00',
      end_time: '17:00',
      consultation_type: 'online',
      is_active: true,
      isNew: true
    }]);
  };

  const updateSlot = (index: number, field: string, value: any) => {
    setAvailability(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const removeSlot = async (index: number) => {
    const slot = availability[index];
    
    if (!slot.isNew && slot.id) {
      try {
        const { error } = await supabase
          .from('doctor_availability')
          .delete()
          .eq('id', slot.id);

        if (error) throw error;
        toast.success('Availability slot removed');
      } catch (error) {
        console.error('Error removing slot:', error);
        toast.error('Failed to remove slot');
        return;
      }
    }

    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  const saveAvailability = async () => {
    if (!doctorId) return;

    setSaving(true);
    try {
      const newSlots = availability.filter(slot => slot.isNew);
      const existingSlots = availability.filter(slot => !slot.isNew);

      // Insert new slots
      if (newSlots.length > 0) {
        const slotsToInsert = newSlots.map(slot => ({
          doctor_id: doctorId,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          consultation_type: slot.consultation_type,
          is_active: slot.is_active
        }));

        const { error: insertError } = await supabase
          .from('doctor_availability')
          .insert(slotsToInsert);

        if (insertError) throw insertError;
      }

      // Update existing slots
      for (const slot of existingSlots) {
        const { error } = await supabase
          .from('doctor_availability')
          .update({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            consultation_type: slot.consultation_type,
            is_active: slot.is_active
          })
          .eq('id', slot.id);

        if (error) throw error;
      }

      toast.success('Availability saved successfully');
      // Refresh data
      fetchAvailability(doctorId);
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto gradient-primary rounded-full animate-pulse mb-4"></div>
          <p className="text-health-navy-600 dark:text-health-navy-300">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
            Manage Availability
          </h1>
          <p className="text-health-navy-600 dark:text-health-navy-300 mt-1">
            Set your consultation hours and availability
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={addAvailabilitySlot}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </Button>
          <Button
            onClick={saveAvailability}
            disabled={saving}
            className="gradient-primary text-white"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Availability Slots */}
      <div className="space-y-4">
        {availability.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-health-navy-300 mb-4" />
              <h3 className="text-lg font-semibold text-health-navy-600 dark:text-health-navy-300 mb-2">
                No availability set
              </h3>
              <p className="text-health-navy-500 dark:text-health-navy-400 text-center mb-4">
                Add your first availability slot to start receiving appointments.
              </p>
              <Button
                onClick={addAvailabilitySlot}
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          availability.map((slot, index) => (
            <Card key={slot.id || index} className="glass-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div>
                    <Label>Day</Label>
                    <Select
                      value={slot.day_of_week.toString()}
                      onValueChange={(value) => updateSlot(index, 'day_of_week', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <Select
                      value={slot.consultation_type}
                      onValueChange={(value) => updateSlot(index, 'consultation_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">In-Person</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={slot.is_active}
                      onCheckedChange={(checked) => updateSlot(index, 'is_active', checked)}
                    />
                    <Label>Active</Label>
                  </div>

                  <div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSlot(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Weekly Schedule Preview */}
      {availability.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Weekly Schedule Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {days.map((day) => {
                const daySlots = availability.filter(
                  slot => slot.day_of_week === day.value && slot.is_active
                );
                
                return (
                  <div key={day.value} className="space-y-2">
                    <h3 className="font-semibold text-health-navy-800 dark:text-white">
                      {day.label}
                    </h3>
                    {daySlots.length === 0 ? (
                      <p className="text-sm text-health-navy-500 dark:text-health-navy-400">
                        Not available
                      </p>
                    ) : (
                      daySlots.map((slot, idx) => (
                        <div key={idx} className="text-sm text-health-navy-600 dark:text-health-navy-300">
                          <div>{slot.start_time} - {slot.end_time}</div>
                          <div className="text-xs capitalize text-health-navy-500">
                            {slot.consultation_type}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorAvailability;
