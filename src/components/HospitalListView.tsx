import React from 'react';
import { MapPin, Star, Clock, Phone, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital } from '@/data/hospitals';
interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  region: string;
  country: string;
}

interface HospitalListViewProps {
  selectedPincode: PincodeData;
  hospitals: Hospital[];
  selectedHospital?: Hospital;
  onHospitalSelect: (hospital: Hospital) => void;
  onHospitalBook: (hospital: Hospital) => void;
}

const HospitalListView: React.FC<HospitalListViewProps> = ({
  selectedPincode,
  hospitals,
  selectedHospital,
  onHospitalSelect,
  onHospitalBook
}) => {
  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-health-navy-300 mb-4" />
        <h3 className="text-xl font-semibold text-health-navy-800 dark:text-white mb-2">
          No hospitals found
        </h3>
        <p className="text-health-navy-600 dark:text-health-navy-300">
          Try searching for a different pincode or select a different specialty.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[75vh] overflow-y-auto">
      {/* Hospital List */}
      <div className="space-y-4">
        <div className="sticky top-0 bg-white/80 dark:bg-health-navy-800/80 backdrop-blur-sm p-4 rounded-2xl mb-4">
          <h3 className="text-lg font-semibold text-health-navy-800 dark:text-white">
            Hospitals in {selectedPincode.city}
          </h3>
          <p className="text-sm text-health-navy-600 dark:text-health-navy-300">
            {hospitals.length} hospitals found near pincode {selectedPincode.pincode}
          </p>
        </div>

        <div className="space-y-4 px-2">
          {hospitals.map((hospital) => (
            <Card
              key={hospital.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                selectedHospital?.id === hospital.id 
                  ? 'ring-2 ring-health-teal-500 bg-health-teal-50 dark:bg-health-teal-900/20' 
                  : 'hover:bg-health-mint-50 dark:hover:bg-health-navy-700'
              }`}
              onClick={() => onHospitalSelect(hospital)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Hospital Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-health-navy-800 dark:text-white mb-1">
                        {hospital.name}
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                            {hospital.rating}
                          </span>
                        </div>
                        <span className="text-sm text-health-navy-500 dark:text-health-navy-400">
                          • {hospital.doctorCount} doctors
                        </span>
                        {hospital.distance && (
                          <span className="text-sm text-health-teal-600">
                            • {hospital.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-health-teal-400 to-health-mint-500 rounded-2xl flex items-center justify-center">
                      {hospital.image ? (
                        <img 
                          src={hospital.image} 
                          alt={hospital.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="text-white text-lg font-bold">
                          {hospital.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-health-teal-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-health-navy-600 dark:text-health-navy-300">
                      {hospital.address}
                    </span>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-health-navy-800 dark:text-white">
                      Specialties:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.slice(0, 3).map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-health-teal-100 dark:bg-health-teal-900/30 text-health-teal-700 dark:text-health-teal-300 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{hospital.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Consultation Details */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-health-mint-200 dark:border-health-navy-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-health-navy-500" />
                      <div>
                        <div className="text-xs text-health-navy-500 dark:text-health-navy-400">
                          Available
                        </div>
                        <div className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                          {hospital.consultationDays}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-health-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">₹</span>
                      </div>
                      <div>
                        <div className="text-xs text-health-navy-500 dark:text-health-navy-400">
                          Consultation Fee
                        </div>
                        <div className="text-sm font-medium text-health-navy-700 dark:text-health-navy-300">
                          ₹{hospital.consultationFee}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open directions in Google Maps
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates[1]},${hospital.coordinates[0]}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // This would typically open a phone dialer
                        alert(`Call hospital: +91-${hospital.id}000000${hospital.id}`);
                      }}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-health-teal-600 hover:bg-health-teal-700 text-white text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onHospitalBook(hospital);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Hospital Details */}
      <div className="hidden md:block">
        <div className="sticky top-0 bg-white dark:bg-health-navy-800 rounded-2xl p-6 h-[75vh] overflow-y-auto">
          {selectedHospital ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-health-teal-400 to-health-mint-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  {selectedHospital.image ? (
                    <img 
                      src={selectedHospital.image} 
                      alt={selectedHospital.name}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  ) : (
                    <div className="text-white text-2xl font-bold">
                      {selectedHospital.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-health-navy-800 dark:text-white mb-2">
                  {selectedHospital.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-medium text-health-navy-700 dark:text-health-navy-300">
                    {selectedHospital.rating} Rating
                  </span>
                  <span className="text-health-navy-500 dark:text-health-navy-400">
                    • {selectedHospital.doctorCount} Doctors
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-health-navy-800 dark:text-white mb-2">Address</h4>
                  <p className="text-health-navy-600 dark:text-health-navy-300 text-sm">
                    {selectedHospital.address}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-health-navy-800 dark:text-white mb-3">All Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-health-teal-100 dark:bg-health-teal-900/30 text-health-teal-700 dark:text-health-teal-300 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-health-mint-50 dark:bg-health-navy-700 rounded-xl">
                    <h5 className="font-medium text-health-navy-800 dark:text-white mb-1">
                      Consultation Days
                    </h5>
                    <p className="text-health-navy-600 dark:text-health-navy-300 text-sm">
                      {selectedHospital.consultationDays}
                    </p>
                  </div>
                  <div className="p-4 bg-health-mint-50 dark:bg-health-navy-700 rounded-xl">
                    <h5 className="font-medium text-health-navy-800 dark:text-white mb-1">
                      Consultation Fee
                    </h5>
                    <p className="text-2xl font-bold text-health-teal-600">
                      ₹{selectedHospital.consultationFee}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full bg-health-teal-600 hover:bg-health-teal-700 text-white py-3"
                  onClick={() => onHospitalBook(selectedHospital)}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-health-navy-300 mb-4" />
              <h3 className="text-xl font-semibold text-health-navy-800 dark:text-white mb-2">
                Select a Hospital
              </h3>
              <p className="text-health-navy-600 dark:text-health-navy-300">
                Click on any hospital from the list to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalListView;