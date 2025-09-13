import React, { useState, useEffect } from 'react';
import { MapPin, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  address: string;
}

interface LocationCaptureProps {
  onLocationCaptured: (location: LocationData) => void;
}

const LocationCapture: React.FC<LocationCaptureProps> = ({ onLocationCaptured }) => {
  const [status, setStatus] = useState<'requesting' | 'locating' | 'success' | 'error' | 'fallback'>('requesting');
  const [accuracy, setAccuracy] = useState<number>(0);
  const [locationMethod, setLocationMethod] = useState<'gps' | 'ip' | 'manual'>('gps');

  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = async () => {
    setStatus('requesting');
    
    try {
      // Try GPS first
      if ('geolocation' in navigator) {
        setStatus('locating');
        
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        };

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setAccuracy(accuracy);
            setLocationMethod('gps');
            
            // Simulate reverse geocoding
            const address = await reverseGeocode(latitude, longitude);
            
            const locationData: LocationData = {
              lat: latitude,
              lng: longitude,
              accuracy: accuracy,
              address: address
            };
            
            setStatus('success');
            setTimeout(() => onLocationCaptured(locationData), 1000);
          },
          (error) => {
            console.error('GPS location error:', error);
            fallbackToIPLocation();
          },
          options
        );
      } else {
        fallbackToIPLocation();
      }
    } catch (error) {
      console.error('Location capture error:', error);
      fallbackToIPLocation();
    }
  };

  const fallbackToIPLocation = async () => {
    setStatus('fallback');
    setLocationMethod('ip');
    
    try {
      // Simulate IP-based geolocation
      setTimeout(async () => {
        // Mock location for Visakhapatnam
        const mockLocation = {
          lat: 17.6868,
          lng: 83.2185,
          accuracy: 5000, // Lower accuracy for IP-based location
          address: "Visakhapatnam, Andhra Pradesh, India"
        };
        
        setAccuracy(mockLocation.accuracy);
        setStatus('success');
        setTimeout(() => onLocationCaptured(mockLocation), 1000);
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Mock reverse geocoding - in production, use a real service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("MVP Colony, Visakhapatnam, Andhra Pradesh 530017");
      }, 500);
    });
  };

  const getAccuracyLevel = (accuracy: number): string => {
    if (accuracy < 50) return 'High';
    if (accuracy < 200) return 'Medium';
    if (accuracy < 1000) return 'Low';
    return 'Very Low';
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy < 50) return 'text-green-600';
    if (accuracy < 200) return 'text-yellow-600';
    if (accuracy < 1000) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="text-center space-y-4">
      {/* Location Status */}
      <div className="flex items-center justify-center space-x-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          status === 'locating' && "bg-blue-100 dark:bg-blue-900",
          status === 'success' && "bg-green-100 dark:bg-green-900",
          status === 'error' && "bg-red-100 dark:bg-red-900",
          status === 'fallback' && "bg-yellow-100 dark:bg-yellow-900"
        )}>
          {status === 'locating' && <MapPin className="w-6 h-6 text-blue-600 animate-pulse" />}
          {status === 'success' && <MapPin className="w-6 h-6 text-green-600" />}
          {status === 'error' && <AlertCircle className="w-6 h-6 text-red-600" />}
          {status === 'fallback' && <Wifi className="w-6 h-6 text-yellow-600" />}
        </div>
        
        <div>
          <h3 className="font-semibold text-health-navy-800 dark:text-white">
            {status === 'requesting' && 'Requesting location access...'}
            {status === 'locating' && 'Getting your precise location...'}
            {status === 'success' && 'Location captured successfully'}
            {status === 'error' && 'Unable to get location'}
            {status === 'fallback' && 'Using network-based location...'}
          </h3>
          
          {accuracy > 0 && (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-health-navy-600 dark:text-health-navy-300">
                Accuracy: {Math.round(accuracy)}m
              </span>
              <span className={cn("font-medium", getAccuracyColor(accuracy))}>
                ({getAccuracyLevel(accuracy)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Location Method Indicator */}
      <div className="flex items-center justify-center space-x-2 text-sm text-health-navy-600 dark:text-health-navy-300">
        {locationMethod === 'gps' && (
          <>
            <MapPin className="w-4 h-4" />
            <span>GPS Location</span>
          </>
        )}
        {locationMethod === 'ip' && (
          <>
            <Wifi className="w-4 h-4" />
            <span>Network-based Location</span>
          </>
        )}
      </div>

      {/* Warning for low accuracy */}
      {accuracy > 1000 && (
        <div className="flex items-center justify-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            Low accuracy location. Emergency services may need additional details.
          </span>
        </div>
      )}

      {/* Progress indicator */}
      {(status === 'locating' || status === 'fallback') && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}
    </div>
  );
};

export default LocationCapture;