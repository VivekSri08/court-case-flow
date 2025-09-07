-- Add fields for separate case status and court order documents
ALTER TABLE public.court_orders 
ADD COLUMN case_status_file_url TEXT,
ADD COLUMN case_status_file_name TEXT,
ADD COLUMN court_order_file_url TEXT,
ADD COLUMN court_order_file_name TEXT;

-- Update existing records to use the new structure (optional - for existing data)
UPDATE public.court_orders 
SET court_order_file_url = file_url,
    court_order_file_name = file_name
WHERE file_url IS NOT NULL;