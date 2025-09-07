-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.case_urgency AS ENUM ('urgent', 'warning', 'normal');
CREATE TYPE public.order_status AS ENUM ('pending', 'in-progress', 'completed');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  bar_registration TEXT,
  practice_areas TEXT[],
  firm_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create court_cases table
CREATE TABLE public.court_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  case_number TEXT NOT NULL,
  petitioner TEXT NOT NULL,
  respondent TEXT NOT NULL,
  court_name TEXT NOT NULL,
  case_type TEXT,
  filing_date DATE,
  latest_order_date DATE,
  next_hearing_date DATE,
  urgency public.case_urgency DEFAULT 'normal',
  case_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create court_orders table
CREATE TABLE public.court_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.court_cases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_date DATE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('court_order', 'case_status')) NOT NULL,
  thumbnail_url TEXT,
  summary TEXT,
  action_required TEXT,
  deadline DATE,
  status public.order_status DEFAULT 'pending',
  extracted_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('court-documents', 'court-documents', false),
  ('avatars', 'avatars', true);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for court_cases
CREATE POLICY "Users can view their own cases" 
  ON public.court_cases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases" 
  ON public.court_cases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases" 
  ON public.court_cases FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases" 
  ON public.court_cases FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for court_orders
CREATE POLICY "Users can view their own orders" 
  ON public.court_orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
  ON public.court_orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
  ON public.court_orders FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" 
  ON public.court_orders FOR DELETE 
  USING (auth.uid() = user_id);

-- Storage policies for court documents
CREATE POLICY "Users can view their own documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'court-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'court-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'court-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'court-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars (public read, user write)
CREATE POLICY "Avatar images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_court_cases_updated_at
  BEFORE UPDATE ON public.court_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_court_orders_updated_at
  BEFORE UPDATE ON public.court_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_court_cases_user_id ON public.court_cases(user_id);
CREATE INDEX idx_court_cases_case_number ON public.court_cases(case_number);
CREATE INDEX idx_court_orders_case_id ON public.court_orders(case_id);
CREATE INDEX idx_court_orders_user_id ON public.court_orders(user_id);
CREATE INDEX idx_court_orders_status ON public.court_orders(status);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);