import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Bot, Send, Calendar, Clock, MapPin, Star, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PincodeSearch from './PincodeSearch';
import HospitalListView from './HospitalListView';
interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  region: string;
  country: string;
}
import { Hospital, getHospitalsByDistrict } from '@/data/hospitals';

interface OfflineConsultationBookingProps {
  onBack: () => void;
}

const OfflineConsultationBooking: React.FC<OfflineConsultationBookingProps> = ({ onBack }) => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPincode, setSelectedPincode] = useState<PincodeData | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'bot', message: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    symptoms: ''
  });

  const categories = [
    {
      id: 'fever',
      title: 'Fever & Flu',
      description: 'High temperature, body ache, cold symptoms',
      icon: '🤒',
      gradient: 'from-red-400 to-red-600'
    },
    {
      id: 'skin',
      title: 'Skin & Hair',
      description: 'Rashes, allergies, hair loss, acne',
      icon: '👨‍⚕️',
      gradient: 'from-orange-400 to-orange-600'
    },
    {
      id: 'mental',
      title: 'Mental Health',
      description: 'Stress, anxiety, depression, counseling',
      icon: '🧠',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 'women',
      title: "Women's Health",
      description: 'Gynecology, pregnancy, PCOD, periods',
      icon: '👩‍⚕️',
      gradient: 'from-pink-400 to-pink-600'
    },
    {
      id: 'general',
      title: 'General Physician',
      description: 'Overall health, regular checkups',
      icon: '🩺',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'others',
      title: 'Others',
      description: 'Tell us your symptoms, we will help',
      icon: '💬',
      gradient: 'from-gray-400 to-gray-600'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'others') {
      setShowChatbot(true);
      setChatMessages([
        { role: 'bot', message: 'Hi! I\'m here to help you find the right medical consultation. Could you please describe your symptoms or health concerns?' }
      ]);
    } else {
      setSelectedCategory(categoryId);
      setCurrentStep(2);
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const updatedMessages = [...chatMessages, { role: 'user' as const, message: userMessage }];
    setChatMessages(updatedMessages);
    setChatInput('');

    // Simple symptom-to-category mapping (in real app, this would use AI)
    setTimeout(() => {
      let suggestedCategory = 'general';
      const symptoms = userMessage.toLowerCase();
      
      if (symptoms.includes('fever') || symptoms.includes('cold') || symptoms.includes('flu') || symptoms.includes('temperature')) {
        suggestedCategory = 'fever';
      } else if (symptoms.includes('skin') || symptoms.includes('rash') || symptoms.includes('hair') || symptoms.includes('acne')) {
        suggestedCategory = 'skin';
      } else if (symptoms.includes('stress') || symptoms.includes('anxiety') || symptoms.includes('depression') || symptoms.includes('mental')) {
        suggestedCategory = 'mental';
      } else if (symptoms.includes('period') || symptoms.includes('pregnancy') || symptoms.includes('pcod') || symptoms.includes('gynec')) {
        suggestedCategory = 'women';
      }

      const categoryInfo = categories.find(c => c.id === suggestedCategory);
      const botResponse = `Based on your symptoms, I recommend consulting with a ${categoryInfo?.title} specialist. This seems like the best match for your concerns. Would you like to proceed with finding nearby ${categoryInfo?.title} doctors?`;
      
      setChatMessages(prev => [...prev, { role: 'bot', message: botResponse }]);
      
      // Auto-select the category after 2 seconds
      setTimeout(() => {
        setSelectedCategory(suggestedCategory);
        setShowChatbot(false);
        setCurrentStep(2);
      }, 2000);
    }, 1000);
  };

  const handlePincodeSelect = (pincodeData: PincodeData) => {
    console.log('Pincode selected:', pincodeData.pincode, 'Selected category:', selectedCategory);
    setSelectedPincode(pincodeData);
    // Use district/city from postal API to find relevant hospitals
    const hospitals = getHospitalsByDistrict(pincodeData.city, selectedCategory);
    console.log('Found hospitals:', hospitals.length, 'for district:', pincodeData.city);
    setNearbyHospitals(hospitals);
    setCurrentStep(3);
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleHospitalBook = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowConfirmationPopup(true);
  };

  // Update name when profile loads
  useEffect(() => {
    if (profile?.name && !userInfo.name) {
      setUserInfo(prev => ({ ...prev, name: profile.name }));
    }
  }, [profile?.name, userInfo.name]);

  const handleConfirmBooking = () => {
    setShowConfirmationPopup(false);
    setShowBookingForm(true);
  };

  const timeSlots = [
    { period: 'Morning', times: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'] },
    { period: 'Afternoon', times: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'] },
    { period: 'Evening', times: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'] }
  ];

  const handleFinalBooking = async () => {
    if (!selectedDate || !selectedTime || !userInfo.name || !userInfo.age || !selectedHospital) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // For demo users, save to localStorage
      if (!user?.id || (typeof user.id === 'string' && user.id.startsWith('dev-user-'))) {
        const appointmentData = {
          id: `appointment-${Date.now()}`,
          doctor: `${selectedHospital.name} Doctor`,
          specialization: categories.find(c => c.id === selectedCategory)?.title || 'General',
          hospital: selectedHospital.name,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          consultation_type: 'offline',
          symptoms: userInfo.symptoms || null,
          patient_name: userInfo.name,
          patient_age: userInfo.age,
          status: 'pending',
          created_at: new Date().toISOString(),
          address: selectedHospital.address
        };

        const existingAppointments = JSON.parse(localStorage.getItem(`appointments_${user?.id}`) || '[]');
        existingAppointments.push(appointmentData);
        localStorage.setItem(`appointments_${user?.id}`, JSON.stringify(existingAppointments));
        
        alert('Appointment booked successfully! You will receive a confirmation call from the hospital.');
        onBack();
        return;
      }

      // For real users with database
      const appointmentData = {
        patient_id: user.id,
        doctor_id: 'offline-' + selectedHospital.id, // Temporary ID for offline bookings
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: convertTo24Hour(selectedTime),
        consultation_type: 'offline' as const,
        status: 'pending' as const,
        symptoms: userInfo.symptoms || null,
        notes: `Hospital: ${selectedHospital.name}, Address: ${selectedHospital.address}, Patient: ${userInfo.name}, Age: ${userInfo.age}`
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
        return;
      }

      alert('Appointment booked successfully! You will receive a confirmation call from the hospital.');
      onBack();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const convertTo24Hour = (time12h: string) => {
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

  const renderStep1 = () => {
    if (showChatbot) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-health-mint-50 to-health-mint-100 dark:from-health-navy-900 dark:to-health-navy-800 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setShowChatbot(false)}
                className="mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-health-navy-800 dark:text-white">
                AI Health Assistant
              </h1>
            </div>

            <Card className="mb-4 h-96 overflow-y-auto">
              <CardContent className="p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-health-teal-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-health-navy-800 dark:text-white'
                      }`}
                    >
                      {msg.role === 'bot' && <Bot className="w-4 h-4 inline mr-2" />}
                      <span className="text-sm">{msg.message}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Input
                placeholder="Describe your symptoms..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                className="flex-1"
              />
              <Button onClick={handleChatSubmit} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-health-mint-50 to-health-mint-100 dark:from-health-navy-900 dark:to-health-navy-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
                Book Offline Consultation
              </h1>
              <p className="text-health-navy-600 dark:text-health-navy-300 mt-2">
                Choose your health concern to find nearby specialists
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-health-teal-300"
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-health-navy-800 dark:text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-health-navy-600 dark:text-health-navy-300 text-sm">
                    {category.description}
                  </p>
                  {category.id === 'others' && (
                    <div className="flex items-center mt-3 text-health-teal-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">AI-Powered Assistant</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    const selectedCategoryInfo = categories.find(c => c.id === selectedCategory);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-health-mint-50 to-health-mint-100 dark:from-health-navy-900 dark:to-health-navy-800 p-4 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => setCurrentStep(1)} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
                Enter Your Pincode
              </h1>
              <p className="text-health-navy-600 dark:text-health-navy-300 mt-2">
                Selected: {selectedCategoryInfo?.title}
              </p>
            </div>
          </div>

          <Card className="animate-scale-in">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
                    📍 Find Hospitals Near You
                  </h3>
                  <p className="text-sm text-health-navy-600 dark:text-health-navy-300 mb-4">
                    Enter your 6-digit pincode to find the best {selectedCategoryInfo?.title.toLowerCase()} specialists in your area
                  </p>
                  <PincodeSearch 
                    onPincodeSelect={handlePincodeSelect}
                    selectedPincode={selectedPincode || undefined}
                  />
                  <p className="text-sm text-health-navy-500 dark:text-health-navy-400 mt-3">
                    We'll show you hospitals and specialists available in your area with their exact locations and contact details.
                  </p>
                </div>

                {selectedPincode && (
                  <div className="p-4 bg-health-teal-50 dark:bg-health-teal-900/20 rounded-xl border border-health-teal-200 dark:border-health-teal-700">
                    <h4 className="font-medium text-health-navy-800 dark:text-white mb-2">
                      ✅ Location Confirmed
                    </h4>
                    <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                      Searching for {selectedCategoryInfo?.title} specialists near:
                    </p>
                    <p className="text-sm font-medium text-health-teal-700 dark:text-health-teal-300">
                      {selectedPincode.pincode} - {selectedPincode.city}, {selectedPincode.state}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    if (!selectedPincode) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-health-mint-50 to-health-mint-100 dark:from-health-navy-900 dark:to-health-navy-800 p-4 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => setCurrentStep(2)} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="animate-scale-in">
              <h1 className="text-2xl font-bold text-health-navy-800 dark:text-white">
                Hospitals in {selectedPincode.city}
              </h1>
              <p className="text-health-navy-600 dark:text-health-navy-300 mt-1">
                {categories.find(c => c.id === selectedCategory)?.title} specialists • Pincode: {selectedPincode.pincode} • {nearbyHospitals.length} hospitals found
              </p>
            </div>
          </div>

          <div className="animate-scale-in">
            <HospitalListView
            selectedPincode={selectedPincode}
              hospitals={nearbyHospitals}
              selectedHospital={selectedHospital || undefined}
              onHospitalSelect={handleHospitalSelect}
              onHospitalBook={handleHospitalBook}
            />
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Popup
  const renderConfirmationPopup = () => {
    if (!selectedHospital || !showConfirmationPopup) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white dark:bg-health-navy-800 rounded-3xl p-6 max-w-2xl w-full mx-4 animate-scale-in">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
              Confirm Hospital Selection
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowConfirmationPopup(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Hospital Image/Logo */}
            <div className="space-y-4">
              <div className="w-full h-48 bg-gradient-to-br from-health-teal-400 to-health-mint-500 rounded-2xl flex items-center justify-center">
                {selectedHospital.image ? (
                  <img 
                    src={selectedHospital.image} 
                    alt={selectedHospital.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-white text-4xl font-bold">
                    {selectedHospital.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
            </div>

            {/* Hospital Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-health-navy-800 dark:text-white mb-2">
                  {selectedHospital.name}
                </h3>
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{selectedHospital.rating}</span>
                  <span className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    ({selectedHospital.doctorCount} doctors)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-health-teal-600 mt-1" />
                  <span className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    {selectedHospital.address}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-health-navy-800 dark:text-white">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-health-teal-50 dark:bg-health-teal-900/20 text-health-teal-600 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-health-navy-800 dark:text-white">Service Type:</h4>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">
                    Offline Consultation
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-health-navy-800 dark:text-white">Available Days:</h4>
                  <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    {selectedHospital.consultationDays}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-health-navy-800 dark:text-white">Consultation Fee:</h4>
                  <p className="text-lg font-bold text-health-teal-600">
                    ₹{selectedHospital.consultationFee}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowConfirmationPopup(false)}
            >
              Back
            </Button>
            <Button 
              className="flex-1 bg-health-teal-600 hover:bg-health-teal-700 text-white"
              onClick={handleConfirmBooking}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Booking Form
  const renderBookingForm = () => {
    if (!showBookingForm || !selectedHospital) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in overflow-y-auto">
        <div className="bg-white dark:bg-health-navy-800 rounded-3xl p-6 max-w-4xl w-full mx-4 my-8 animate-scale-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
                Book Your Appointment
              </h2>
              <p className="text-health-navy-600 dark:text-health-navy-300 mt-1">
                {selectedHospital.name} • {categories.find(c => c.id === selectedCategory)?.title}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowBookingForm(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Patient Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
                  Patient Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                      Age *
                    </label>
                    <Input
                      type="number"
                      value={userInfo.age}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Enter your age"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                      Describe your symptoms
                    </label>
                    <Textarea
                      value={userInfo.symptoms}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Please describe your health concerns..."
                      rows={4}
                      className="w-full resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-4">
                  Select Date & Time
                </h3>
                
                {/* Date Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                      Preferred Date *
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                      Preferred Time *
                    </label>
                    <div className="space-y-3">
                      {timeSlots.map((slot) => (
                        <div key={slot.period}>
                          <h4 className="text-sm font-medium text-health-navy-600 dark:text-health-navy-400 mb-2">
                            {slot.period}
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {slot.times.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 text-xs rounded-lg transition-all ${
                                  selectedTime === time
                                    ? 'bg-health-teal-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-health-navy-600 dark:text-health-navy-300 hover:bg-health-teal-100 dark:hover:bg-health-teal-900/20'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8 pt-6 border-t border-health-mint-200 dark:border-health-navy-600">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowBookingForm(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-health-teal-600 hover:bg-health-teal-700 text-white"
              onClick={handleFinalBooking}
              disabled={!selectedDate || !selectedTime || !userInfo.name || !userInfo.age}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 1) {
    return (
      <>
        {renderStep1()}
        {renderConfirmationPopup()}
        {renderBookingForm()}
      </>
    );
  } else if (currentStep === 2) {
    return (
      <>
        {renderStep2()}
        {renderConfirmationPopup()}
        {renderBookingForm()}
      </>
    );
  } else if (currentStep === 3) {
    return (
      <>
        {renderStep3()}
        {renderConfirmationPopup()}
        {renderBookingForm()}
      </>
    );
  }

  return null;
};

export default OfflineConsultationBooking;