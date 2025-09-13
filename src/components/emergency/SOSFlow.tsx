import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Volume2, VolumeX, X, Check, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import LocationCapture from './LocationCapture';
import EmergencyConsentModal from './EmergencyConsentModal';
import LiveTrackingPanel from './LiveTrackingPanel';
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

const SOSFlow = () => {
  const [sosState, setSOSState] = useState<'idle' | 'countdown' | 'locating' | 'consent' | 'dispatching' | 'tracking'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [silentMode, setSilentMode] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [hasEmergencyConsent, setHasEmergencyConsent] = useState(false);
  const [emergencyCase, setEmergencyCase] = useState<EmergencyCase | null>(null);
  const { toast } = useToast();

  // Check existing consent on mount
  useEffect(() => {
    const consent = localStorage.getItem('emergency_medical_consent');
    setHasEmergencyConsent(consent === 'true');
  }, []);

  // Countdown timer
  useEffect(() => {
    if (sosState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (sosState === 'countdown' && countdown === 0) {
      startLocationCapture();
    }
  }, [sosState, countdown]);

  const triggerSOS = useCallback(() => {
    if (sosState !== 'idle') return;
    
    setSOSState('countdown');
    setCountdown(3);
    
    // Show cancel toast
    toast({
      title: "SOS Alert Triggered",
      description: (
        <div className="flex items-center justify-between">
          <span>Emergency services will be contacted in {countdown}s</span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={cancelSOS}
            className="ml-4"
          >
            Cancel
          </Button>
        </div>
      ),
      duration: 3000,
    });

    // Silent mode audio feedback
    if (!silentMode) {
      // Simulate audio alert (replace with actual audio in production)
      console.log('Playing SOS alert sound');
    }
  }, [sosState, countdown, silentMode, toast]);

  const cancelSOS = useCallback(() => {
    setSOSState('idle');
    setCountdown(3);
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
      variant: "default",
    });
  }, [toast]);

  const startLocationCapture = useCallback(() => {
    setSOSState('locating');
  }, []);

  const onLocationCaptured = useCallback((locationData: LocationData) => {
    setLocation(locationData);
    
    if (hasEmergencyConsent) {
      startDispatch(locationData);
    } else {
      setSOSState('consent');
    }
  }, [hasEmergencyConsent]);

  const onConsentGiven = useCallback((consent: boolean) => {
    setHasEmergencyConsent(consent);
    localStorage.setItem('emergency_medical_consent', consent.toString());
    
    if (consent && location) {
      startDispatch(location);
    } else {
      // Proceed without medical profile
      startDispatch(location);
    }
  }, [location]);

  const startDispatch = useCallback((locationData: LocationData | null) => {
    setSOSState('dispatching');
    
    // Simulate dispatch process
    setTimeout(() => {
      const mockCase: EmergencyCase = {
        case_id: `MEDV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        timestamp: new Date().toISOString(),
        ambulance: {
          driver_name: "Rajesh Kumar",
          driver_phone: "+91 9876543210",
          vehicle_number: "AP 39 EA 1234",
          eta_minutes: 8
        },
        hospital: {
          name: "Apollo Hospital Visakhapatnam",
          phone: "+91 1860 500 1066"
        }
      };
      
      setEmergencyCase(mockCase);
      setSOSState('tracking');
      
      // Send SMS fallback if needed
      simulateSMSFallback(locationData, mockCase);
      
    }, 2000);
  }, []);

  const simulateSMSFallback = (locationData: LocationData | null, caseData: EmergencyCase) => {
    // Simulate SMS fallback for poor network conditions
    const smsTemplate = `MEDIVINE EMERGENCY: Case ${caseData.case_id}. Location: ${locationData?.address || 'Location pending'}. Ambulance dispatched ETA ${caseData.ambulance.eta_minutes}min. Track: https://medivine.app/track/${caseData.case_id}`;
    console.log('SMS Fallback sent:', smsTemplate);
  };

  return (
    <div className="space-y-6">
      {/* SOS Button */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Button
            onClick={triggerSOS}
            disabled={sosState !== 'idle'}
            className={cn(
              "w-32 h-32 rounded-full text-2xl font-bold transition-all duration-300",
              sosState === 'countdown' 
                ? "bg-gradient-to-r from-orange-500 to-red-600 animate-pulse scale-110" 
                : "bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 hover:shadow-2xl shadow-elegant",
              sosState !== 'idle' && "cursor-not-allowed"
            )}
          >
            {sosState === 'countdown' ? countdown : 'SOS'}
          </Button>
          
          {sosState === 'countdown' && (
            <div className="absolute -top-2 -right-2">
              <Button
                onClick={cancelSOS}
                variant="secondary"
                size="icon"
                className="w-8 h-8 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Silent Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSilentMode(!silentMode)}
            className="flex items-center space-x-2"
          >
            {silentMode ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{silentMode ? 'Silent' : 'Audio'}</span>
          </Button>
        </div>
      </div>

      {/* Status Display */}
      {sosState !== 'idle' && (
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-center">
              {sosState === 'countdown' && `SOS in ${countdown}s`}
              {sosState === 'locating' && 'Locating your position...'}
              {sosState === 'consent' && 'Emergency consent required'}
              {sosState === 'dispatching' && 'Finding nearest ambulance...'}
              {sosState === 'tracking' && 'Emergency dispatch active'}
            </h2>
          </div>
          
          {sosState === 'locating' && (
            <LocationCapture onLocationCaptured={onLocationCaptured} />
          )}
          
          {sosState === 'dispatching' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-health-navy-600 dark:text-health-navy-300">
                Connecting to emergency services and nearby hospitals...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Emergency Consent Modal */}
      {sosState === 'consent' && (
        <EmergencyConsentModal
          isOpen={true}
          onClose={() => onConsentGiven(false)}
          onConsent={onConsentGiven}
        />
      )}

      {/* Live Tracking Panel */}
      {sosState === 'tracking' && emergencyCase && (
        <LiveTrackingPanel 
          emergencyCase={emergencyCase}
          location={location}
          onClose={() => setSOSState('idle')}
        />
      )}

      {/* Quick Emergency Contacts */}
      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
          Emergency Contacts
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="tel:108"
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl hover-lift transition-smooth"
          >
            <Phone className="w-5 h-5" />
            <span className="font-semibold">Call 108</span>
          </a>
          <a
            href="tel:100"
            className="flex items-center justify-center space-x-2 p-4 glass-card rounded-2xl hover-lift transition-smooth"
          >
            <Phone className="w-5 h-5" />
            <span className="font-semibold">Police 100</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SOSFlow;