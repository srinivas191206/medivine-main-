import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, Star, User, Video, CheckCircle, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const OnlineConsultationBooking = ({ onBack }: { onBack: () => void }) => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotInput, setChatbotInput] = useState('');
  const [chatbotSuggestion, setChatbotSuggestion] = useState('');
  const [showDoctorPopup, setShowDoctorPopup] = useState(false);
  const [popupDoctor, setPopupDoctor] = useState<any>(null);
  const [userInfo, setUserInfo] = useState({
    name: profile?.name || '', // Auto-filled from authenticated user profile
    age: '',
    symptoms: ''
  });

  // Update name when profile loads
  useEffect(() => {
    if (profile?.name && !userInfo.name) {
      setUserInfo(prev => ({ ...prev, name: profile.name }));
    }
  }, [profile?.name, userInfo.name]);

  const categories = [
    { id: 'fever', name: 'Fever', icon: '🌡️', color: 'from-red-400 to-red-600' },
    { id: 'skin', name: 'Skin Problems', icon: '🩺', color: 'from-orange-400 to-orange-600' },
    { id: 'mental', name: 'Mental Health', icon: '🧠', color: 'from-purple-400 to-purple-600' },
    { id: 'women', name: "Women's Health", icon: '👩‍⚕️', color: 'from-pink-400 to-pink-600' },
    { id: 'general', name: 'General Physician', icon: '👨‍⚕️', color: 'from-blue-400 to-blue-600' },
    { id: 'others', name: 'Others', icon: '💬', color: 'from-gray-400 to-gray-600', isOther: true }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialization: 'General Physician',
      rating: 4.9,
      image: '/placeholder.svg',
      experience: '12 years',
      hospital: 'City General Hospital',
      bio: 'Dr. Wilson specializes in comprehensive healthcare for all ages with focus on preventive medicine.',
      languages: 'English, Spanish'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Internal Medicine',
      rating: 4.8,
      image: '/placeholder.svg',
      experience: '15 years',
      hospital: 'Metropolitan Medical Center',
      bio: 'Expert in complex medical conditions with extensive research in cardiovascular health.',
      languages: 'English, Mandarin'
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      specialization: 'Family Medicine',
      rating: 4.9,
      image: '/placeholder.svg',
      experience: '10 years',
      hospital: 'Community Health Clinic',
      bio: 'Dedicated to providing holistic family care with emphasis on patient education.',
      languages: 'English, Hindi'
    },
    {
      id: 4,
      name: 'Dr. James Rodriguez',
      specialization: 'Emergency Medicine',
      rating: 4.7,
      image: '/placeholder.svg',
      experience: '8 years',
      hospital: 'Central Emergency Care',
      bio: 'Specialist in urgent care and emergency medical situations with rapid response expertise.',
      languages: 'English, Spanish'
    },
    {
      id: 5,
      name: 'Dr. Emily Thompson',
      specialization: 'Pediatrics',
      rating: 4.9,
      image: '/placeholder.svg',
      experience: '14 years',
      hospital: 'Children\'s Health Center',
      bio: 'Pediatric specialist with expertise in child development and adolescent health.',
      languages: 'English, French'
    },
    {
      id: 6,
      name: 'Dr. Ahmed Hassan',
      specialization: 'Cardiology',
      rating: 4.8,
      image: '/placeholder.svg',
      experience: '18 years',
      hospital: 'Heart & Vascular Institute',
      bio: 'Leading cardiologist specializing in heart disease prevention and treatment.',
      languages: 'English, Arabic'
    }
  ];

  const timeSlots = {
    morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
    afternoon: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'],
    evening: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM']
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleConfirmBooking = async () => {
    // Debug current values
    console.log('Booking validation:', {
      user: user,
      selectedDoctor: selectedDoctor,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
      userInfo: userInfo
    });

    // Check required fields - be more lenient with user validation
    if (!selectedDoctor || !selectedDate || !selectedTime || !userInfo.name || !userInfo.age) {
      alert('Please complete all required fields');
      return;
    }

    try {
      // For demo users, save to localStorage instead of database
      if (!user?.id || (typeof user.id === 'string' && user.id.startsWith('dev-user-'))) {
        const appointmentData = {
          id: `appointment-${Date.now()}`,
          doctor: selectedDoctor?.name || 'Auto-Assigned Doctor',
          specialization: selectedDoctor?.specialization || 'Best Match',
          hospital: selectedDoctor?.hospital || 'Healthcare Center',
          date: selectedDate?.toISOString().split('T')[0],
          time: selectedTime,
          consultation_type: 'online',
          symptoms: userInfo.symptoms || null,
          patient_name: userInfo.name,
          patient_age: userInfo.age,
          status: 'pending',
          created_at: new Date().toISOString()
        };

        // Get existing appointments from localStorage
        const existingAppointments = JSON.parse(localStorage.getItem(`appointments_${user?.id}`) || '[]');
        existingAppointments.push(appointmentData);
        
        // Save back to localStorage
        localStorage.setItem(`appointments_${user?.id}`, JSON.stringify(existingAppointments));
        
        alert('Appointment booked successfully! Redirecting to dashboard...');
        onBack();
        return;
      }

      // Convert 12-hour format to 24-hour format for database storage
      const time24 = convert12to24(selectedTime);

      const appointmentData = {
        patient_id: user.id,
        doctor_id: selectedDoctor.id.toString(),
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: time24,
        consultation_type: 'online' as const,
        status: 'pending' as const,
        symptoms: userInfo.symptoms || null,
        notes: `Patient: ${userInfo.name}, Age: ${userInfo.age}`
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();

      if (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
        return;
      }

      alert('Appointment booked successfully! Redirecting to dashboard...');
      onBack(); // This will redirect to dashboard
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  // Helper function to convert 12-hour to 24-hour format
  const convert12to24 = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}:00`;
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'others') {
      setShowChatbot(true);
      setSelectedCategory(categoryId);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleChatbotSubmit = () => {
    if (chatbotInput.trim()) {
      // Simple placeholder logic to suggest specialization
      const suggestions = {
        'skin': 'Dermatologist',
        'hair': 'Dermatologist', 
        'rash': 'Dermatologist',
        'acne': 'Dermatologist',
        'headache': 'Neurologist',
        'migraine': 'Neurologist',
        'stomach': 'Gastroenterologist',
        'digestive': 'Gastroenterologist',
        'heart': 'Cardiologist',
        'chest': 'Cardiologist',
        'joint': 'Orthopedist',
        'bone': 'Orthopedist',
        'anxiety': 'Psychiatrist',
        'depression': 'Psychiatrist',
        'stress': 'Psychiatrist'
      };
      
      const input = chatbotInput.toLowerCase();
      const suggestion = Object.keys(suggestions).find(key => input.includes(key));
      
      setChatbotSuggestion(
        suggestion 
          ? `It sounds like you may need to consult a ${suggestions[suggestion as keyof typeof suggestions]}.`
          : "Based on your description, a General Physician would be the best starting point."
      );
    }
  };

  const proceedToDoctorSelection = () => {
    setShowChatbot(false);
    nextStep();
  };

  const handleDoctorSelect = (doctor: any) => {
    setPopupDoctor(doctor);
    setShowDoctorPopup(true);
  };

  const confirmDoctorSelection = () => {
    setSelectedDoctor(popupDoctor);
    setShowDoctorPopup(false);
    nextStep();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {!showChatbot ? (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
              What do you want to consult about?
            </h2>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Select your consultation category
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-6 rounded-2xl border-2 transition-smooth text-left hover-scale ${
                  selectedCategory === category.id
                    ? 'border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20'
                    : category.isOther
                    ? 'border-dashed border-health-navy-300 dark:border-health-navy-500 hover:border-health-teal-400'
                    : 'border-health-navy-200 dark:border-health-navy-600 hover:border-health-teal-300'
                }`}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-health-navy-800 dark:text-white text-lg">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
              Tell us about your health concern
            </h2>
          </div>

          {/* Chatbot Interface */}
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Bot Message */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-health-teal-400 to-health-mint-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="bg-health-teal-50 dark:bg-health-teal-900/20 rounded-2xl rounded-tl-md p-4 flex-1 animate-scale-in">
                <p className="text-health-navy-800 dark:text-white">
                  Hi, could you briefly describe the issue you're facing?
                </p>
              </div>
            </div>

            {/* User Input */}
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Textarea
                  value={chatbotInput}
                  onChange={(e) => setChatbotInput(e.target.value)}
                  placeholder="E.g., I have been experiencing skin rashes on my arms for the past week..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleChatbotSubmit}
                disabled={!chatbotInput.trim()}
                className="mb-1"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Bot Response */}
            {chatbotSuggestion && (
              <div className="animate-fade-in space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-health-teal-400 to-health-mint-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-health-teal-50 dark:bg-health-teal-900/20 rounded-2xl rounded-tl-md p-4 flex-1">
                    <p className="text-health-navy-800 dark:text-white">
                      {chatbotSuggestion}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={proceedToDoctorSelection}
                    className="gradient-primary text-white px-8 py-2"
                  >
                    Proceed to Doctor Selection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
          Choose your doctor or let us pick the best for you
        </h2>
      </div>

      <Button
        variant="outline"
        onClick={() => setSelectedDoctor({ id: 'auto', name: 'Auto-Assigned Doctor' })}
        className={`w-full p-4 h-auto ${
          selectedDoctor?.id === 'auto' ? 'border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-health-teal-400 to-health-mint-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Auto-Assign Best Doctor</div>
            <div className="text-sm text-muted-foreground">We'll match you with the most suitable doctor</div>
          </div>
        </div>
      </Button>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <Card
            key={doctor.id}
            className={`cursor-pointer transition-smooth hover-lift ${
              selectedDoctor?.id === doctor.id ? 'ring-2 ring-health-teal-500' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-health-teal-400 to-health-mint-500 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-health-navy-800 dark:text-white">{doctor.name}</h3>
                  <p className="text-health-teal-600">{doctor.specialization}</p>
                  <p className="text-sm text-health-navy-600 dark:text-health-navy-300">{doctor.experience} experience</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  Book
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
          Pick a convenient time
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Time Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(timeSlots).map(([period, slots]) => (
              <div key={period}>
                <h4 className="font-medium text-health-navy-700 dark:text-health-navy-300 mb-2 capitalize">
                  {period}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-xs"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
          Tell us a bit about you
        </h2>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <Input
                value={userInfo.age}
                onChange={(e) => setUserInfo(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Your age"
                type="number"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Symptoms/Notes (Optional)</label>
            <Textarea
              value={userInfo.symptoms}
              onChange={(e) => setUserInfo(prev => ({ ...prev, symptoms: e.target.value }))}
              placeholder="E.g., Cough for 2 days, headache"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
          Confirm Your Appointment
        </h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-health-teal-400 to-health-mint-500 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-health-navy-800 dark:text-white">
                  {selectedDoctor?.name || 'Auto-Assigned Doctor'}
                </h3>
                <p className="text-health-teal-600">{selectedDoctor?.specialization || 'Best Match'}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-health-teal-600" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-health-teal-600" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    {selectedTime || 'Not selected'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Video className="w-5 h-5 text-health-teal-600" />
              <div>
                <p className="font-medium">Consultation Mode</p>
                <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                  Online Video Consultation
                </p>
              </div>
            </div>

            {userInfo.symptoms && (
              <div>
                <p className="font-medium mb-2">Symptoms/Notes</p>
                <p className="text-sm text-health-navy-600 dark:text-health-navy-300 bg-health-teal-50 dark:bg-health-teal-900/20 p-3 rounded-lg">
                  {userInfo.symptoms}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCategory;
      case 2: return selectedDoctor;
      case 3: return selectedDate && selectedTime;
      case 4: return userInfo.name && userInfo.age;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900">
      <div className="pt-20 pb-6 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-health-navy-600 dark:text-health-navy-300" />
            </button>
            
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-smooth ${
                    step === currentStep
                      ? 'bg-health-teal-500'
                      : step < currentStep
                      ? 'bg-health-teal-300'
                      : 'bg-health-navy-200 dark:bg-health-navy-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Step {currentStep} of 5
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleConfirmBooking}
              disabled={!canProceed()}
              className="gradient-primary text-white flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Book Appointment</span>
            </Button>
          )}
        </div>
      </div>

      {/* Doctor Selection Popup */}
      {showDoctorPopup && popupDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDoctorPopup(false)}
          />
          
          {/* Popup Card */}
          <div className="relative bg-white dark:bg-health-navy-900 rounded-3xl p-8 mx-4 max-w-2xl w-full animate-scale-in shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Doctor Image */}
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-health-teal-400 to-health-mint-500 rounded-3xl flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              
              {/* Right - Doctor Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-health-navy-800 dark:text-white">
                    {popupDoctor.name}
                  </h3>
                  <p className="text-health-teal-600 font-medium text-lg">
                    {popupDoctor.specialization}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-health-navy-600 dark:text-health-navy-300">
                    <span className="font-medium">Hospital:</span> {popupDoctor.hospital}
                  </p>
                  <p className="text-health-navy-600 dark:text-health-navy-300">
                    <span className="font-medium">Experience:</span> {popupDoctor.experience}
                  </p>
                  <p className="text-health-navy-600 dark:text-health-navy-300">
                    <span className="font-medium">Languages:</span> {popupDoctor.languages}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{popupDoctor.rating}</span>
                    <span className="text-health-navy-500 dark:text-health-navy-400">rating</span>
                  </div>
                </div>
                
                <div className="bg-health-teal-50 dark:bg-health-teal-900/20 p-4 rounded-2xl">
                  <p className="text-sm text-health-navy-700 dark:text-health-navy-300">
                    {popupDoctor.bio}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowDoctorPopup(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={confirmDoctorSelection}
                className="flex-1 gradient-primary text-white"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineConsultationBooking;