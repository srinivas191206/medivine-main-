
-- Create enum for doctor verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');

-- Create enum for specializations
CREATE TYPE public.specialization AS ENUM (
  'cardiology', 'dermatology', 'pediatrics', 'orthopedics', 'neurology', 
  'gynecology', 'psychiatry', 'oncology', 'gastroenterology', 'endocrinology',
  'ophthalmology', 'ent', 'urology', 'nephrology', 'pulmonology', 'general_medicine'
);

-- Create enum for consultation types
CREATE TYPE public.consultation_type AS ENUM ('online', 'offline', 'both');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialization specialization NOT NULL,
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  education TEXT NOT NULL,
  current_hospital TEXT,
  consultation_fee INTEGER NOT NULL CHECK (consultation_fee >= 0),
  consultation_types consultation_type[] NOT NULL DEFAULT '{online}',
  bio TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  is_available BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor_documents table for KYC
CREATE TABLE public.doctor_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL, -- 'aadhaar', 'pan', 'medical_license', 'certificate'
  document_url TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor_availability table
CREATE TABLE public.doctor_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  consultation_type consultation_type NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES auth.users NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  consultation_type consultation_type NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  symptoms TEXT,
  notes TEXT,
  prescription TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor_earnings table
CREATE TABLE public.doctor_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) NOT NULL,
  amount INTEGER NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  platform_fee INTEGER NOT NULL,
  doctor_earning INTEGER NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors table
CREATE POLICY "Doctors can view their own profile" 
  ON public.doctors 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view approved doctors" 
  ON public.doctors 
  FOR SELECT 
  USING (verification_status = 'approved');

CREATE POLICY "Doctors can update their own profile" 
  ON public.doctors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create doctor profile" 
  ON public.doctors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for doctor_documents table
CREATE POLICY "Doctors can manage their own documents" 
  ON public.doctor_documents 
  FOR ALL 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- RLS Policies for doctor_availability table
CREATE POLICY "Doctors can manage their own availability" 
  ON public.doctor_availability 
  FOR ALL 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Users can view doctor availability" 
  ON public.doctor_availability 
  FOR SELECT 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE verification_status = 'approved'));

-- RLS Policies for appointments table
CREATE POLICY "Patients can manage their own appointments" 
  ON public.appointments 
  FOR ALL 
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can manage appointments for their patients" 
  ON public.appointments 
  FOR ALL 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- RLS Policies for doctor_earnings table
CREATE POLICY "Doctors can view their own earnings" 
  ON public.doctor_earnings 
  FOR SELECT 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_doctors_user_id ON public.doctors(user_id);
CREATE INDEX idx_doctors_specialization ON public.doctors(specialization);
CREATE INDEX idx_doctors_verification_status ON public.doctors(verification_status);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_doctor_availability_doctor_id ON public.doctor_availability(doctor_id);
CREATE INDEX idx_doctor_documents_doctor_id ON public.doctor_documents(doctor_id);
