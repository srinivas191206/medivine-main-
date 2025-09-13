import React, { useState } from 'react';
import { Shield, Heart, User, Phone, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface EmergencyConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: boolean) => void;
}

const EmergencyConsentModal: React.FC<EmergencyConsentModalProps> = ({
  isOpen,
  onClose,
  onConsent
}) => {
  const [understood, setUnderstood] = useState(false);

  if (!isOpen) return null;

  const medicalFields = [
    { icon: Heart, label: 'Blood Group', value: 'B+', sensitive: true },
    { icon: AlertTriangle, label: 'Allergies', value: 'Penicillin', sensitive: true },
    { icon: Heart, label: 'Medical Conditions', value: 'Asthma', sensitive: true },
    { icon: User, label: 'Emergency Contact', value: 'Spouse - Priya (+91 98765xxxxx)', sensitive: false },
    { icon: Phone, label: 'Doctor Contact', value: 'Dr. Sharma (+91 98765xxxxx)', sensitive: false },
  ];

  const handleConsent = (giveConsent: boolean) => {
    if (giveConsent) {
      // Log consent timestamp
      const consentLog = {
        timestamp: new Date().toISOString(),
        fields_shared: medicalFields.map(field => field.label),
        user_consent: true
      };
      localStorage.setItem('emergency_consent_log', JSON.stringify(consentLog));
    }
    onConsent(giveConsent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-health-navy-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-health-navy-700">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-health-navy-800 dark:text-white">
                Emergency Medical Information
              </h2>
              <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
                One-time consent required
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Urgency indicator */}
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <Clock className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300 font-medium">
              Time-sensitive: Emergency services are waiting
            </span>
          </div>

          {/* Explanation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-health-navy-800 dark:text-white">
              Share medical information with emergency responders?
            </h3>
            <p className="text-sm text-health-navy-600 dark:text-health-navy-300 leading-relaxed">
              Sharing your medical profile helps emergency responders provide better care. 
              This information will only be shared with the ambulance crew and receiving hospital.
            </p>
          </div>

          {/* Medical fields to be shared */}
          <div className="space-y-3">
            <h4 className="font-medium text-health-navy-800 dark:text-white">
              Information to be shared:
            </h4>
            <div className="space-y-2">
              {medicalFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-health-navy-700 rounded-2xl">
                  <field.icon className={`w-5 h-5 ${field.sensitive ? 'text-red-500' : 'text-blue-500'}`} />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-health-navy-800 dark:text-white">
                      {field.label}
                    </span>
                    <span className="text-sm text-health-navy-600 dark:text-health-navy-300 ml-2">
                      {field.value}
                    </span>
                  </div>
                  {field.sensitive && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy assurance */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                  Your privacy is protected
                </p>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Information is encrypted in transit and at rest</li>
                  <li>• Only authorized medical personnel can access it</li>
                  <li>• Usage is logged for your security</li>
                  <li>• You can revoke consent in settings later</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Consent checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked === true)}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm text-health-navy-600 dark:text-health-navy-300 leading-relaxed">
              I understand that my medical information will be shared with emergency responders 
              to provide better care, and I consent to this one-time sharing.
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-health-navy-700 space-y-3">
          <Button
            onClick={() => handleConsent(true)}
            disabled={!understood}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-3"
          >
            Yes, Share Medical Information
          </Button>
          
          <Button
            onClick={() => handleConsent(false)}
            variant="outline"
            className="w-full"
          >
            Continue Without Sharing
          </Button>
          
          <p className="text-xs text-center text-health-navy-500 dark:text-health-navy-400">
            Either choice will continue with emergency dispatch
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyConsentModal;