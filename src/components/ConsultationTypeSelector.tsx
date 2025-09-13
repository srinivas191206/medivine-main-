import React, { useState } from 'react';
import { Video, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OnlineConsultationBooking from './OnlineConsultationBooking';
import OfflineConsultationBooking from './OfflineConsultationBooking';

const ConsultationTypeSelector = () => {
  const navigate = useNavigate();
  const [showOnlineBooking, setShowOnlineBooking] = useState(false);
  const [showOfflineBooking, setShowOfflineBooking] = useState(false);

  const consultationTypes = [
    {
      id: 'online',
      title: 'Online Consultation',
      description: 'Book a video consultation with a doctor from the comfort of your home.',
      icon: Video,
      color: 'gradient-primary',
      bgColor: 'from-health-teal-50 to-health-mint-50 dark:from-health-teal-900/20 dark:to-health-mint-900/20'
    },
    {
      id: 'offline',
      title: 'Offline Visit',
      description: 'Book an in-person visit at your nearest hospital or clinic.',
      icon: MapPin,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    }
  ];

  const handleConsultationSelect = (type: string) => {
    if (type === 'online') {
      setShowOnlineBooking(true);
    } else if (type === 'offline') {
      setShowOfflineBooking(true);
    }
  };

  if (showOnlineBooking) {
    return <OnlineConsultationBooking onBack={() => setShowOnlineBooking(false)} />;
  }

  if (showOfflineBooking) {
    return <OfflineConsultationBooking onBack={() => setShowOfflineBooking(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900">
      <div className="pt-20 pb-6 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6 text-health-navy-600 dark:text-health-navy-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white">
                Book Appointment
              </h1>
              <p className="text-health-navy-600 dark:text-health-navy-300 mt-2">
                How would you like to consult with the doctor?
              </p>
            </div>
          </div>
        </div>

        {/* Consultation Type Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {consultationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleConsultationSelect(type.id)}
              className="group glass-card rounded-3xl p-8 hover-lift transition-smooth text-left w-full"
            >
              <div className={`bg-gradient-to-br ${type.bgColor} rounded-2xl p-6 mb-6`}>
                <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-3">
                  {type.title}
                </h2>
                <p className="text-health-navy-600 dark:text-health-navy-300 leading-relaxed">
                  {type.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-health-teal-600 dark:text-health-teal-400 font-semibold">
                  Select this option
                </span>
                <div className="w-8 h-8 bg-health-teal-100 dark:bg-health-teal-900/30 rounded-full flex items-center justify-center group-hover:bg-health-teal-200 dark:group-hover:bg-health-teal-800/50 transition-colors">
                  <ArrowLeft className="w-4 h-4 text-health-teal-600 dark:text-health-teal-400 rotate-180" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Info */}
        <div className="glass-card rounded-3xl p-6 mt-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white mb-2">
              Need help choosing?
            </h3>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Our team is available 24/7 to help you select the best consultation option for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationTypeSelector;