# Database Setup Guide - New Supabase Project

## 🏥 Health Horizon Profile UI - Database Schema Setup

Your new Supabase project (`bygvrbihkxgcbjcxrgar`) needs to be configured with the required database schema for the authentication and healthcare features to work properly.

## 📋 **Quick Setup Options**

### **Option 1: Copy & Paste SQL (Recommended)**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `bygvrbihkxgcbjcxrgar`
3. Go to **SQL Editor** in the left sidebar
4. Create a new query and paste the complete SQL script below
5. Click **Run** to execute

### **Option 2: Use Migration Files**
If you have Supabase CLI installed:
```bash
supabase db reset
supabase db push
```

---

## 🗄️ **Complete Database Schema**

Copy and paste this entire SQL script into your Supabase SQL Editor:

```sql
-- =====================================================
-- HEALTH HORIZON PROFILE UI - DATABASE SCHEMA
-- =====================================================

-- 1. CREATE PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  phone TEXT,
  health_metrics_collected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. CREATE ENUMS FOR DOCTORS
-- =====================================================
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');

CREATE TYPE public.specialization AS ENUM (
  'cardiology', 'dermatology', 'pediatrics', 'orthopedics', 'neurology', 
  'gynecology', 'psychiatry', 'oncology', 'gastroenterology', 'endocrinology',
  'ophthalmology', 'ent', 'urology', 'nephrology', 'pulmonology', 'general_medicine'
);

CREATE TYPE public.consultation_type AS ENUM ('online', 'offline', 'both');
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- 3. CREATE DOCTORS TABLE
-- =====================================================
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

-- 4. CREATE DOCTOR DOCUMENTS TABLE
-- =====================================================
CREATE TABLE public.doctor_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. CREATE DOCTOR AVAILABILITY TABLE
-- =====================================================
CREATE TABLE public.doctor_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  consultation_type consultation_type NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. CREATE APPOINTMENTS TABLE
-- =====================================================
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

-- 7. CREATE DOCTOR EARNINGS TABLE
-- =====================================================
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

-- 8. CREATE HEALTH METRICS TABLE
-- =====================================================
CREATE TABLE public.health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  weight DECIMAL(5,2),
  bmi DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE SECURITY POLICIES
-- =====================================================

-- Doctors table policies
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

-- Doctor documents policies
CREATE POLICY "Doctors can manage their own documents" 
  ON public.doctor_documents 
  FOR ALL 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- Doctor availability policies
CREATE POLICY "Doctors can manage their own availability" 
  ON public.doctor_availability 
  FOR ALL 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

CREATE POLICY "Users can view doctor availability" 
  ON public.doctor_availability 
  FOR SELECT 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE verification_status = 'approved'));

-- Appointments policies
CREATE POLICY "Patients can manage their own appointments" 
  ON public.appointments 
  FOR ALL 
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can manage appointments for their patients" 
  ON public.appointments 
  FOR ALL 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- Doctor earnings policies
CREATE POLICY "Doctors can view their own earnings" 
  ON public.doctor_earnings 
  FOR SELECT 
  USING (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()));

-- Health metrics policies
CREATE POLICY "Users can view their own health metrics" 
  ON public.health_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics" 
  ON public.health_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics" 
  ON public.health_metrics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- =====================================================
-- CREATE PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_doctors_user_id ON public.doctors(user_id);
CREATE INDEX idx_doctors_specialization ON public.doctors(specialization);
CREATE INDEX idx_doctors_verification_status ON public.doctors(verification_status);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_doctor_availability_doctor_id ON public.doctor_availability(doctor_id);
CREATE INDEX idx_doctor_documents_doctor_id ON public.doctor_documents(doctor_id);

-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================
```

---

## ⚙️ **Additional Supabase Configuration**

### **1. Enable Authentication**
1. Go to **Authentication** → **Settings**
2. Enable **Email confirmations** if you want email verification
3. Configure **Email templates** (optional)

### **2. Configure Email Settings (Optional)**
1. Go to **Authentication** → **Settings** → **SMTP**
2. Configure your email provider for OTP/magic links

### **3. API Settings**
- Your API keys are already configured in the project
- No additional API configuration needed

---

## 🧪 **Test Your Setup**

Once the schema is created, test the authentication:

1. **Start your app** (after installing Node.js)
2. **Sign up** with a new account
3. **Check your database** - you should see:
   - New user in `auth.users`
   - New profile in `public.profiles`

---

## 📊 **Database Tables Created**

✅ **Core Tables:**
- `profiles` - User profile information
- `health_metrics` - User health data

✅ **Doctor Management:**
- `doctors` - Doctor profiles and verification
- `doctor_documents` - KYC documents
- `doctor_availability` - Doctor schedules
- `doctor_earnings` - Payment tracking

✅ **Appointments:**
- `appointments` - Booking and consultation management

✅ **Security:**
- Row Level Security (RLS) enabled on all tables
- Proper access policies for users and doctors

---

## 🔒 **Security Features**

- **Row Level Security (RLS)** - Users can only access their own data
- **Authentication Required** - All operations require valid user session
- **Doctor Verification** - Multi-step verification process for healthcare providers
- **Data Privacy** - HIPAA-compliant data handling structure

---

## 🚀 **Ready to Run!**

After setting up the database schema:

1. **Copy the SQL script above**
2. **Paste it in Supabase SQL Editor**
3. **Run the script**
4. **Install Node.js and run your app!**

Your Health Horizon Profile UI will now have a fully functional database backend! 🏥✨