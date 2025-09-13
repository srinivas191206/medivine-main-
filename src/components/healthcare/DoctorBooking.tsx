
import React, { useState } from 'react';
import { Star, Clock, MapPin, Video, User, Calendar, ArrowRight } from 'lucide-react';

const DoctorBooking = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const specialties = [
    { id: 'all', name: 'All Doctors', count: 50 },
    { id: 'cardiology', name: 'Cardiology', count: 8 },
    { id: 'dermatology', name: 'Dermatology', count: 6 },
    { id: 'pediatrics', name: 'Pediatrics', count: 10 },
    { id: 'orthopedics', name: 'Orthopedics', count: 7 },
    { id: 'neurology', name: 'Neurology', count: 5 }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiologist',
      experience: 15,
      rating: 4.8,
      fee: 800,
      hospital: 'Apollo Hospital',
      image: '/placeholder.svg',
      availability: ['Today 2:00 PM', 'Today 4:00 PM', 'Tomorrow 10:00 AM'],
      consultationType: ['online', 'offline']
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Dermatologist',
      experience: 12,
      rating: 4.9,
      fee: 600,
      hospital: 'Max Healthcare',
      image: '/placeholder.svg',
      availability: ['Today 3:00 PM', 'Tomorrow 11:00 AM', 'Tomorrow 2:00 PM'],
      consultationType: ['online', 'offline']
    },
    {
      id: 3,
      name: 'Dr. Amit Patel',
      specialty: 'Pediatrician',
      experience: 18,
      rating: 4.7,
      fee: 700,
      hospital: 'Fortis Hospital',
      image: '/placeholder.svg',
      availability: ['Tomorrow 9:00 AM', 'Tomorrow 1:00 PM', 'Day after 10:00 AM'],
      consultationType: ['online', 'offline']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
          Book Your Appointment
        </h1>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Choose from our expert doctors and book instantly
        </p>
      </div>

      {/* Specialty Filter */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-4">
          Select Specialty
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => setSelectedSpecialty(specialty.id)}
              className={`p-4 rounded-2xl border-2 transition-smooth text-left ${
                selectedSpecialty === specialty.id
                  ? 'border-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20'
                  : 'border-health-navy-200 dark:border-health-navy-600 hover:border-health-teal-300'
              }`}
            >
              <div className="font-semibold text-health-navy-800 dark:text-white">
                {specialty.name}
              </div>
              <div className="text-sm text-health-navy-600 dark:text-health-navy-300">
                {specialty.count} doctors
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="glass-card rounded-3xl p-6 hover-lift transition-smooth">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-health-teal-400 to-health-mint-500 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-health-navy-800 dark:text-white">
                      {doctor.name}
                    </h3>
                    <p className="text-health-teal-600 font-medium">{doctor.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-health-navy-800 dark:text-white">
                        {doctor.rating}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-health-teal-600">
                      ₹{doctor.fee}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-health-navy-600 dark:text-health-navy-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.experience} years exp</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.hospital}</span>
                  </div>
                </div>

                {/* Consultation Types */}
                <div className="flex items-center space-x-2 mb-4">
                  {doctor.consultationType.includes('online') && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Video className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">Online</span>
                    </div>
                  )}
                  {doctor.consultationType.includes('offline') && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">In-person</span>
                    </div>
                  )}
                </div>

                {/* Available Slots */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                    Available Slots:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availability.slice(0, 3).map((slot, index) => (
                      <button
                        key={index}
                        className="px-3 py-1 bg-health-teal-100 dark:bg-health-teal-900/20 text-health-teal-700 dark:text-health-teal-300 rounded-full text-sm hover:bg-health-teal-200 dark:hover:bg-health-teal-900/40 transition-smooth"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full md:w-auto px-6 py-3 gradient-primary text-white rounded-2xl hover-lift transition-smooth flex items-center justify-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorBooking;
