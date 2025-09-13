
import React, { useState } from 'react';
import { Ambulance, Phone, MapPin, Clock, AlertTriangle, Navigation } from 'lucide-react';
import SOSFlow from '../emergency/SOSFlow';

const EmergencyServices = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [isRequestingAmbulance, setIsRequestingAmbulance] = useState(false);

  const emergencyContacts = [
    { name: 'Emergency Helpline', number: '108', type: 'primary' },
    { name: 'Police', number: '100', type: 'secondary' },
    { name: 'Fire Brigade', number: '101', type: 'secondary' },
    { name: 'Women Helpline', number: '1091', type: 'secondary' }
  ];

  const nearbyHospitals = [
    {
      name: 'Apollo Hospital',
      distance: '2.3 km',
      eta: '8 mins',
      emergency: true,
      contact: '+91-9876543210'
    },
    {
      name: 'Max Healthcare',
      distance: '3.1 km',
      eta: '12 mins',
      emergency: true,
      contact: '+91-9876543211'
    },
    {
      name: 'Fortis Hospital',
      distance: '4.5 km',
      eta: '15 mins',
      emergency: true,
      contact: '+91-9876543212'
    }
  ];

  const handleAmbulanceRequest = () => {
    setIsRequestingAmbulance(true);
    // Simulate ambulance booking process
    setTimeout(() => {
      setIsRequestingAmbulance(false);
      alert('Ambulance booked successfully! ETA: 8 minutes');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* SOS Emergency Flow */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Emergency Services</h1>
        </div>
        <p className="text-red-100 mb-6">
          In case of medical emergency, press the SOS button or call emergency services
        </p>
        <SOSFlow />
      </div>

      {/* Quick Emergency Contacts */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-4">
          Emergency Contacts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, index) => (
            <a
              key={index}
              href={`tel:${contact.number}`}
              className={`p-4 rounded-2xl text-center hover-lift transition-smooth ${
                contact.type === 'primary' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                  : 'glass-card'
              }`}
            >
              <Phone className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-semibold text-sm mb-1">{contact.name}</h3>
              <p className="text-lg font-bold">{contact.number}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Ambulance Booking */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-4">
          Book Ambulance
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
              Emergency Type
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full p-3 glass-card rounded-2xl border-0 focus:ring-2 focus:ring-health-teal-500"
            >
              <option value="">Select emergency type</option>
              <option value="cardiac">Cardiac Emergency</option>
              <option value="accident">Accident</option>
              <option value="stroke">Stroke</option>
              <option value="breathing">Breathing Problem</option>
              <option value="other">Other Medical Emergency</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-navy-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  className="w-full pl-10 pr-4 py-3 glass-card rounded-2xl border-0 focus:ring-2 focus:ring-health-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-health-navy-700 dark:text-health-navy-300 mb-2">
                Destination Hospital
              </label>
              <select className="w-full p-3 glass-card rounded-2xl border-0 focus:ring-2 focus:ring-health-teal-500">
                <option value="">Select hospital</option>
                {nearbyHospitals.map((hospital, index) => (
                  <option key={index} value={hospital.name}>
                    {hospital.name} - {hospital.distance}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAmbulanceRequest}
            disabled={!emergencyType || isRequestingAmbulance}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover-lift transition-smooth disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Ambulance className="w-6 h-6" />
            <span>{isRequestingAmbulance ? 'Booking Ambulance...' : 'Book Emergency Ambulance'}</span>
          </button>
        </div>
      </div>

      {/* Nearby Hospitals */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-health-navy-800 dark:text-white mb-4">
          Nearby Emergency Hospitals
        </h2>
        <div className="space-y-4">
          {nearbyHospitals.map((hospital, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-health-teal-500 to-health-mint-500 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-health-navy-800 dark:text-white">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-health-navy-600 dark:text-health-navy-300">
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-4 h-4" />
                      <span>{hospital.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{hospital.eta}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={`tel:${hospital.contact}`}
                  className="px-4 py-2 gradient-primary text-white rounded-xl hover-lift transition-smooth"
                >
                  Call
                </a>
                <button className="px-4 py-2 glass-card rounded-xl hover-lift transition-smooth">
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
