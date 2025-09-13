
export interface UserRole {
  id: string;
  type: 'patient' | 'pharmacy' | 'doctor' | 'admin';
  permissions: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  fee: number;
  availability: string[];
  hospital: string;
  image?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'online' | 'offline';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  fee: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface Order {
  id: string;
  patientId: string;
  medicines: Medicine[];
  prescription?: string;
  deliveryType: 'home' | 'pickup';
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryETA?: string;
}

export interface EmergencyService {
  id: string;
  type: 'ambulance';
  location: {
    lat: number;
    lng: number;
  };
  status: 'requested' | 'dispatched' | 'arrived';
  eta: string;
}
