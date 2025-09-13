import React, { useState, useEffect } from 'react';
import { Ambulance, Phone, Clock, MapPin, Navigation, User, X, RefreshCw, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  address: string;
}

interface EmergencyCase {
  case_id: string;
  timestamp: string;
  ambulance: {
    driver_name: string;
    driver_phone: string;
    vehicle_number: string;
    eta_minutes: number;
  };
  hospital: {
    name: string;
    phone: string;
  };
}

interface LiveTrackingPanelProps {
  emergencyCase: EmergencyCase;
  location: LocationData | null;
  onClose: () => void;
}

const LiveTrackingPanel: React.FC<LiveTrackingPanelProps> = ({
  emergencyCase,
  location,
  onClose
}) => {
  const [eta, setEta] = useState(emergencyCase.ambulance.eta_minutes);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [ambulanceLocation, setAmbulanceLocation] = useState({ lat: 17.6800, lng: 83.2100 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateTracking();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateTracking = async () => {
    setIsRefreshing(true);
    
    // Simulate getting updates from backend
    setTimeout(() => {
      // Simulate ambulance getting closer
      setEta(prev => Math.max(1, prev - 1));
      setLastUpdate(new Date());
      
      // Simulate ambulance movement
      setAmbulanceLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
      
      setIsRefreshing(false);
    }, 1000);
  };

  const getMapUrl = () => {
    if (!location) return '#';
    
    // Generate Google Maps URL with route
    const origin = `${ambulanceLocation.lat},${ambulanceLocation.lng}`;
    const destination = `${location.lat},${location.lng}`;
    return `https://www.google.com/maps/dir/${origin}/${destination}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
              <Ambulance className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
                Emergency Dispatch Active
              </h2>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Case ID: {emergencyCase.case_id}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-health-navy-600 hover:text-health-navy-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* ETA Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {eta} min
          </div>
          <p className="text-health-navy-600 dark:text-health-navy-300">
            Estimated arrival time
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-health-navy-500">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button
              onClick={updateTracking}
              variant="ghost"
              size="sm"
              disabled={isRefreshing}
              className="p-1"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(10, 100 - (eta / emergencyCase.ambulance.eta_minutes) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Ambulance Details */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
          Ambulance Details
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-health-navy-600" />
            <div>
              <p className="font-medium text-health-navy-800 dark:text-white">
                {emergencyCase.ambulance.driver_name}
              </p>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Driver
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Ambulance className="w-5 h-5 text-health-navy-600" />
            <div>
              <p className="font-medium text-health-navy-800 dark:text-white">
                {emergencyCase.ambulance.vehicle_number}
              </p>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                Vehicle Number
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <a
            href={`tel:${emergencyCase.ambulance.driver_phone}`}
            className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl hover-lift transition-smooth"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">Call Driver</span>
          </a>
          
          <a
            href={getMapUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 p-3 glass-card rounded-2xl hover-lift transition-smooth"
          >
            <Navigation className="w-5 h-5" />
            <span className="font-medium">Track Route</span>
          </a>
        </div>
      </div>

      {/* Hospital Information */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
          Destination Hospital
        </h3>
        
        <div className="flex items-center space-x-3 mb-4">
          <Hospital className="w-5 h-5 text-health-navy-600" />
          <div>
            <p className="font-medium text-health-navy-800 dark:text-white">
              {emergencyCase.hospital.name}
            </p>
            <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
              Emergency department has been notified
            </p>
          </div>
        </div>

        <a
          href={`tel:${emergencyCase.hospital.phone}`}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl hover-lift transition-smooth"
        >
          <Phone className="w-5 h-5" />
          <span className="font-medium">Call Hospital</span>
        </a>
      </div>

      {/* Location Information */}
      {location && (
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
            Pickup Location
          </h3>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-health-navy-600 mt-1" />
            <div>
              <p className="text-health-navy-800 dark:text-white">
                {location.address}
              </p>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300 mt-1">
                Accuracy: {Math.round(location.accuracy)}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Actions */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
          Need Immediate Help?
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:108"
            className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl hover-lift transition-smooth"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">Call 108</span>
          </a>
          
          <a
            href="tel:100"
            className="flex items-center justify-center space-x-2 p-3 glass-card rounded-2xl hover-lift transition-smooth"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">Police 100</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingPanel;