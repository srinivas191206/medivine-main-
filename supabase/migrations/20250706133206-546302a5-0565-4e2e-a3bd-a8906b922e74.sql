
-- Create a table for user health metrics
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

-- Add Row Level Security (RLS)
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for health metrics
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

-- Add a column to profiles to track if health metrics have been collected
ALTER TABLE public.profiles 
ADD COLUMN health_metrics_collected BOOLEAN DEFAULT FALSE;
