-- Add case_type field to court_cases table for better case categorization
ALTER TABLE public.court_cases 
ADD COLUMN case_type TEXT;

-- Add index for better search performance
CREATE INDEX idx_court_cases_case_type ON public.court_cases(case_type);

-- Add comment for clarity
COMMENT ON COLUMN public.court_cases.case_type IS 'Type of case (Writ A/B/C/PIL, etc.)';

-- Update court_orders table to better track original file names
ALTER TABLE public.court_orders 
ADD COLUMN original_file_name TEXT;

COMMENT ON COLUMN public.court_orders.original_file_name IS 'Original name of the uploaded file before processing';