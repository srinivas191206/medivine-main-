import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Video, 
  Star, 
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

const BookingSystem = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [step, setStep] = useState(1);

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'General Practice', 
    'Gynecology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry'
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      rating: 4.9,
      experience: '15 years',
      location: 'Mumbai Central Hospital',
      avatar: 'PS',
      availability: ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM'],
      consultationFee: '₹800'
    },
    {
      id: 2,
      name: 'Dr. Arjun Mehta',
      specialty: 'General Practice',
      rating: 4.8,
      experience: '12 years',
      location: 'Delhi Medical Center',
      avatar: 'AM',
      availability: ['9:00 AM', '10:30 AM', '12:00 PM', '4:00 PM'],
      consultationFee: '₹600'
    },
    {
      id: 3,
      name: 'Dr. Kavya Reddy',
      specialty: 'Dermatology',
      rating: 4.9,
      experience: '10 years',
      location: 'Bangalore Skin Clinic',
      avatar: 'KR',
      availability: ['11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
      consultationFee: '₹750'
    },
    {
      id: 4,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Orthopedics',
      rating: 4.7,
      experience: '18 years',
      location: 'Chennai Bone & Joint Hospital',
      avatar: 'RK',
      availability: ['9:30 AM', '11:00 AM', '2:30 PM', '4:30 PM'],
      consultationFee: '₹900'
    },
    {
      id: 5,
      name: 'Dr. Sneha Gupta',
      specialty: 'Gynecology',
      rating: 4.8,
      experience: '14 years',
      location: 'Kolkata Women\'s Hospital',
      avatar: 'SG',
      availability: ['10:00 AM', '12:30 PM', '3:00 PM', '5:30 PM'],
      consultationFee: '₹700'
    },
    {
      id: 6,
      name: 'Dr. Vikram Singh',
      specialty: 'Neurology',
      rating: 4.6,
      experience: '20 years',
      location: 'Pune Neuro Center',
      avatar: 'VS',
      availability: ['9:00 AM', '11:30 AM', '2:30 PM', '4:00 PM'],
      consultationFee: '₹1000'
    }
  ];

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const filteredDoctors = selectedSpecialty 
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : doctors;

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    alert(`Appointment booked successfully!\n\nDoctor: ${selectedDoctor.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nType: ${appointmentType}`);
    
    // Reset form
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setStep(1);
  };

  const renderSpecialtySelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
          Choose a Specialty
        </h2>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Select the medical specialty you need
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => {
              setSelectedSpecialty(specialty);
              setStep(2);
            }}
            className="p-4 glass-card rounded-2xl hover-lift transition-smooth text-left"
          >
            <h3 className="font-semibold text-health-navy-800 dark:text-white mb-1">
              {specialty}
            </h3>
            <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
              {doctors.filter(d => d.specialty === specialty).length} doctors available
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
            Select a Doctor
          </h2>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            {selectedSpecialty} specialists
          </p>
        </div>
        <button
          onClick={() => setStep(1)}
          className="flex items-center space-x-2 px-4 py-2 glass-card rounded-xl hover-lift transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className={`glass-card rounded-3xl p-6 hover-lift transition-smooth cursor-pointer ${
              selectedDoctor?.id === doctor.id ? 'ring-2 ring-health-teal-500' : ''
            }`}
            onClick={() => {
              setSelectedDoctor(doctor);
              setStep(3);
            }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{doctor.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-health-navy-800 dark:text-white mb-1">
                  {doctor.name}
                </h3>
                <p className="text-health-navy-600 dark:text-health-navy-300 mb-2">
                  {doctor.specialty} • {doctor.experience}
                </p>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                  <span className="text-sm text-health-navy-600 dark:text-health-navy-300">
                    {doctor.consultationFee}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-health-navy-600 dark:text-health-navy-300">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointmentBooking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white">
            Book Appointment
          </h2>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            {selectedDoctor?.name} - {selectedDoctor?.specialty}
          </p>
        </div>
        <button
          onClick={() => setStep(2)}
          className="flex items-center space-x-2 px-4 py-2 glass-card rounded-xl hover-lift transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Date Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
            Select Date
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {getAvailableDates().slice(0, 8).map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`p-3 rounded-xl text-sm transition-smooth ${
                    selectedDate === dateStr
                      ? 'gradient-primary text-white'
                      : 'glass-card hover-lift'
                  }`}
                >
                  <div className="font-medium">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs opacity-80">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
            Select Time
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {selectedDoctor?.availability.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-xl text-sm transition-smooth ${
                  selectedTime === time
                    ? 'gradient-primary text-white'
                    : 'glass-card hover-lift'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
          Appointment Type
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setAppointmentType('in-person')}
            className={`p-4 rounded-2xl transition-smooth flex items-center space-x-3 ${
              appointmentType === 'in-person'
                ? 'gradient-primary text-white'
                : 'glass-card hover-lift'
            }`}
          >
            <User className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">In-Person Visit</div>
              <div className="text-sm opacity-80">Visit the clinic</div>
            </div>
          </button>
          <button
            onClick={() => setAppointmentType('video-call')}
            className={`p-4 rounded-2xl transition-smooth flex items-center space-x-3 ${
              appointmentType === 'video-call'
                ? 'gradient-primary text-white'
                : 'glass-card hover-lift'
            }`}
          >
            <Video className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Video Consultation</div>
              <div className="text-sm opacity-80">Online consultation</div>
            </div>
          </button>
        </div>
      </div>

      {/* Book Button */}
      {selectedDate && selectedTime && (
        <div className="pt-6 border-t border-health-navy-200 dark:border-health-navy-600">
          <button
            onClick={handleBookAppointment}
            className="w-full p-4 gradient-primary text-white rounded-2xl hover-lift hover-glow transition-smooth flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Confirm Booking</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="glass-card rounded-3xl p-6 md:p-8">
        {step === 1 && renderSpecialtySelection()}
        {step === 2 && renderDoctorSelection()}
        {step === 3 && renderAppointmentBooking()}
      </div>
    </div>
  );
};

export default BookingSystem;
