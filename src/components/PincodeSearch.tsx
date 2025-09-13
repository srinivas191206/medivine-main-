import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  region: string;
  country: string;
}

interface PincodeSearchProps {
  onPincodeSelect: (pincodeData: PincodeData) => void;
  selectedPincode?: PincodeData;
}

const PincodeSearch: React.FC<PincodeSearchProps> = ({ onPincodeSelect, selectedPincode }) => {
  const [inputValue, setInputValue] = useState(selectedPincode?.pincode || '');
  const [locationData, setLocationData] = useState<PincodeData | null>(selectedPincode || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isValidPincode, setIsValidPincode] = useState(false);

  // Debounced API call function
  const debouncedApiCall = useCallback(
    async (pincode: string) => {
      if (pincode.length !== 6) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
          const postOffice = data[0].PostOffice[0];
          const pincodeData: PincodeData = {
            pincode: pincode,
            city: postOffice.District || postOffice.Name,
            state: postOffice.State,
            region: postOffice.Region,
            country: postOffice.Country
          };
          
          setLocationData(pincodeData);
          setIsValidPincode(true);
          onPincodeSelect(pincodeData);
        } else {
          setError('No location data found for this PIN code');
          setLocationData(null);
          setIsValidPincode(false);
        }
      } catch (err) {
        setError('Failed to fetch location data. Please try again.');
        setLocationData(null);
        setIsValidPincode(false);
      } finally {
        setIsLoading(false);
      }
    },
    [onPincodeSelect]
  );

  // Debounce effect
  useEffect(() => {
    if (inputValue.length === 6 && /^\d{6}$/.test(inputValue)) {
      const timer = setTimeout(() => {
        debouncedApiCall(inputValue);
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (inputValue.length < 6) {
      setLocationData(null);
      setError('');
      setIsValidPincode(false);
    } else if (inputValue.length === 6 && !/^\d{6}$/.test(inputValue)) {
      setError('Please enter a valid 6-digit PIN code');
      setLocationData(null);
      setIsValidPincode(false);
    }
  }, [inputValue, debouncedApiCall]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only digits, max 6
    setInputValue(value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-health-navy-500" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter 6-digit pincode (e.g., 530001)"
          className={`pl-10 pr-10 ${isValidPincode ? 'border-health-teal-500' : ''} ${error ? 'border-red-500' : ''}`}
          maxLength={6}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-health-navy-500 animate-spin" />
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="mt-3 p-3 bg-health-teal-50 dark:bg-health-teal-900/20 rounded-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-health-teal-600 animate-spin" />
            <span className="text-sm text-health-navy-800 dark:text-white">
              Fetching location data...
            </span>
          </div>
        </div>
      )}

      {/* Location data display */}
      {locationData && !isLoading && (
        <div className="mt-3 p-4 bg-health-teal-50 dark:bg-health-teal-900/20 rounded-lg border border-health-teal-200 dark:border-health-teal-800 animate-fade-in">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-health-teal-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-health-navy-800 dark:text-white mb-1">
                {locationData.pincode} - {locationData.city}
              </div>
              <div className="text-sm text-health-navy-600 dark:text-health-navy-300 space-y-1">
                <div><span className="font-medium">State:</span> {locationData.state}</div>
                <div><span className="font-medium">Region:</span> {locationData.region}</div>
                <div><span className="font-medium">Country:</span> {locationData.country}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-fade-in">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600 dark:text-red-400">
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Input validation message */}
      {inputValue.length > 0 && inputValue.length < 6 && (
        <div className="mt-2 text-xs text-health-navy-500 dark:text-health-navy-400">
          Enter a complete 6-digit PIN code
        </div>
      )}
    </div>
  );
};

export default PincodeSearch;