// Mock hospital data for demonstration
export interface Hospital {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  pincode: string; // Hospital pincode
  specialties: string[];
  doctorCount: number;
  rating: number;
  image: string;
  consultationDays: string[];
  consultationFee: number;
  distance?: number; // Will be calculated based on user location
}

export const hospitals: Hospital[] = [
  // Hyderabad, Telangana
  {
    id: 'apollo-hyd',
    name: 'Apollo Hospitals',
    address: 'Jubilee Hills, Hyderabad, Telangana',
    coordinates: [78.4089, 17.4239],
    pincode: '500033',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'General Medicine'],
    doctorCount: 45,
    rating: 4.8,
    image: '/placeholder.svg',
    consultationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    consultationFee: 800
  },
  {
    id: 'care-hyd',
    name: 'CARE Hospitals',
    address: 'Banjara Hills, Hyderabad, Telangana',
    coordinates: [78.4482, 17.4126],
    pincode: '500034',
    specialties: ['Emergency Medicine', 'Critical Care', 'Gastroenterology'],
    doctorCount: 32,
    rating: 4.6,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 600
  },
  {
    id: 'yashoda-hyd',
    name: 'Yashoda Hospitals',
    address: 'Somajiguda, Hyderabad, Telangana',
    coordinates: [78.4512, 17.4239],
    pincode: '500038',
    specialties: ['Neurology', 'Cardiology', 'Nephrology'],
    doctorCount: 38,
    rating: 4.4,
    image: '/placeholder.svg',
    consultationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    consultationFee: 650
  },

  // Kakinada, East Godavari, Andhra Pradesh
  {
    id: 'gems-kakinada',
    name: 'GEMS Hospital',
    address: 'Sarpavaram Junction, Kakinada, East Godavari',
    coordinates: [82.2275, 16.9891],
    pincode: '533001',
    specialties: ['General Medicine', 'Orthopedics', 'Cardiology', 'Emergency Medicine'],
    doctorCount: 28,
    rating: 4.3,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 400
  },
  {
    id: 'government-kakinada',
    name: 'Kakinada Government Hospital',
    address: 'Main Road, Kakinada, East Godavari',
    coordinates: [82.2275, 16.9891],
    pincode: '533001',
    specialties: ['General Medicine', 'Emergency Medicine', 'Pediatrics', 'Gynecology'],
    doctorCount: 35,
    rating: 3.8,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 50
  },
  {
    id: 'rangaraya-kakinada',
    name: 'Rangaraya Medical College Hospital',
    address: 'Medical College Road, Kakinada, East Godavari',
    coordinates: [82.2275, 16.9891],
    pincode: '533001',
    specialties: ['General Medicine', 'Surgery', 'Internal Medicine', 'ENT'],
    doctorCount: 42,
    rating: 4.1,
    image: '/placeholder.svg',
    consultationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    consultationFee: 100
  },
  {
    id: 'aditya-kakinada',
    name: 'Aditya Hospital',
    address: 'Ramanayyapeta, Kakinada, East Godavari',
    coordinates: [82.2275, 16.9891],
    pincode: '533003',
    specialties: ['Cardiology', 'Neurology', 'General Medicine', 'Dermatology'],
    doctorCount: 25,
    rating: 4.2,
    image: '/placeholder.svg',
    consultationDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFee: 500
  },

  // Visakhapatnam, Andhra Pradesh  
  {
    id: 'care-vizag',
    name: 'CARE Hospitals Visakhapatnam',
    address: 'Ramnagar, Visakhapatnam, Andhra Pradesh',
    coordinates: [83.3002, 17.6868],
    pincode: '530002',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine'],
    doctorCount: 48,
    rating: 4.5,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 700
  },
  {
    id: 'government-vizag',
    name: 'King George Hospital',
    address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh',
    coordinates: [83.3002, 17.6868],
    pincode: '530002',
    specialties: ['General Medicine', 'Emergency Medicine', 'Surgery', 'Pediatrics'],
    doctorCount: 65,
    rating: 3.9,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 50
  },

  // Vijayawada, Andhra Pradesh
  {
    id: 'manipal-vijayawada',
    name: 'Manipal Hospitals',
    address: 'NH-5, Tadepalli, Vijayawada, Andhra Pradesh',
    coordinates: [80.6480, 16.5062],
    pincode: '520007',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
    doctorCount: 52,
    rating: 4.6,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 750
  },
  {
    id: 'government-vijayawada',
    name: 'Government General Hospital',
    address: 'Ring Road, Vijayawada, Andhra Pradesh',
    coordinates: [80.6480, 16.5062],
    pincode: '520001',
    specialties: ['General Medicine', 'Emergency Medicine', 'Surgery', 'Gynecology'],
    doctorCount: 45,
    rating: 3.7,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 50
  },

  // Warangal, Telangana
  {
    id: 'care-warangal',
    name: 'CARE Hospital Warangal',
    address: 'Balasamudram, Hanamkonda, Warangal, Telangana',
    coordinates: [79.5941, 17.9784],
    pincode: '506001',
    specialties: ['General Medicine', 'Cardiology', 'Orthopedics', 'Emergency Medicine'],
    doctorCount: 32,
    rating: 4.2,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 600
  },
  {
    id: 'government-warangal',
    name: 'MGM Hospital Warangal',
    address: 'Station Road, Warangal, Telangana',
    coordinates: [79.5941, 17.9784],
    pincode: '506002',
    specialties: ['General Medicine', 'Emergency Medicine', 'Surgery', 'Pediatrics'],
    doctorCount: 38,
    rating: 3.8,
    image: '/placeholder.svg',
    consultationDays: ['All Days'],
    consultationFee: 100
  }
];

// Function to get hospitals near a city with optional specialty filter
export const getHospitalsNearCity = (cityCoordinates: [number, number], specialty?: string): Hospital[] => {
  // Simple distance calculation (in a real app, you'd use a proper geospatial query)
  const hospitalsWithDistance = hospitals.map(hospital => {
    const distance = calculateDistance(cityCoordinates, hospital.coordinates);
    return { ...hospital, distance };
  });

  // Filter by specialty if provided
  let filteredHospitals = hospitalsWithDistance;
  if (specialty && specialty !== 'general') {
    const specialtyMap: { [key: string]: string[] } = {
      'fever': ['General Medicine', 'Emergency Medicine'],
      'skin': ['Dermatology', 'General Medicine'],
      'mental': ['Psychiatry', 'Neurology'],
      'women': ['Gynecology', 'Obstetrics'],
      'general': ['General Medicine']
    };
    
    const relevantSpecialties = specialtyMap[specialty] || ['General Medicine'];
    filteredHospitals = hospitalsWithDistance.filter(hospital =>
      hospital.specialties.some(spec => 
        relevantSpecialties.some(relSpec => 
          spec.toLowerCase().includes(relSpec.toLowerCase())
        )
      )
    );
  }

  // Sort by distance and return top results
  return filteredHospitals
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, 6);
};

// Get hospitals by district name from postal API response
export const getHospitalsByDistrict = (district: string, specialty?: string): Hospital[] => {
  // Normalize district name for matching
  const normalizedDistrict = district.toLowerCase().trim();
  
  // Filter hospitals by district/city name in address
  let filteredHospitals = hospitals.filter(hospital => {
    const address = hospital.address.toLowerCase();
    return address.includes(normalizedDistrict) || 
           address.includes(normalizedDistrict.replace(' ', ''));
  });

  // If no exact district match, try by state
  if (filteredHospitals.length === 0) {
    const stateKeywords = ['andhra pradesh', 'telangana', 'hyderabad'];
    filteredHospitals = hospitals.filter(hospital => {
      const address = hospital.address.toLowerCase();
      return stateKeywords.some(state => address.includes(state));
    });
  }

  // Ultimate fallback - show all hospitals with distance note
  if (filteredHospitals.length === 0) {
    filteredHospitals = hospitals;
  }
  
  // Filter by specialty if provided
  if (specialty && specialty !== 'general') {
    const specialtyMap: { [key: string]: string[] } = {
      'fever': ['General Medicine', 'Emergency Medicine'],
      'skin': ['Dermatology', 'General Medicine'],
      'mental': ['Psychiatry', 'Neurology'],
      'women': ['Gynecology', 'Obstetrics'],
      'general': ['General Medicine']
    };
    
    const relevantSpecialties = specialtyMap[specialty] || ['General Medicine'];
    filteredHospitals = filteredHospitals.filter(hospital => 
      hospital.specialties.some(spec => 
        relevantSpecialties.some(relevant => 
          spec.toLowerCase().includes(relevant.toLowerCase())
        )
      )
    );
  }
  
  return filteredHospitals.slice(0, 6);
};

export const getHospitalsNearPincode = (pincode: string, specialty?: string): Hospital[] => {
  // Filter hospitals by pincode (first 3 digits for regional matching)
  const pincodePrefix = pincode.substring(0, 3);
  
  let filteredHospitals = hospitals.filter(hospital => {
    const hospitalPincode = hospital.pincode || '500001';
    return hospitalPincode.substring(0, 3) === pincodePrefix;
  });

  // If no hospitals found with exact prefix match, get all hospitals (fallback)
  if (filteredHospitals.length === 0) {
    filteredHospitals = hospitals;
  }
  
  // Filter by specialty if provided
  if (specialty && specialty !== 'general') {
    const specialtyMap: { [key: string]: string[] } = {
      'fever': ['General Medicine', 'Emergency Medicine'],
      'skin': ['Dermatology', 'General Medicine'],
      'mental': ['Psychiatry', 'Neurology'],
      'women': ['Gynecology', 'Obstetrics']
    };
    
    const relevantSpecialties = specialtyMap[specialty] || ['General Medicine'];
    filteredHospitals = filteredHospitals.filter(hospital => 
      hospital.specialties.some(spec => 
        relevantSpecialties.some(relevant => 
          spec.toLowerCase().includes(relevant.toLowerCase())
        )
      )
    );
  }
  
  return filteredHospitals.slice(0, 6);
};

// Simple distance calculation using Haversine formula
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}