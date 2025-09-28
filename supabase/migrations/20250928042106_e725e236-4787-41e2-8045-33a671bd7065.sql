-- Re-enable RLS and add foreign key constraints back
ALTER TABLE public.court_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_orders ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraints back
ALTER TABLE public.court_cases 
ADD CONSTRAINT court_cases_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.court_orders 
ADD CONSTRAINT court_orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;