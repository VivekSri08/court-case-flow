-- Add completion_date and completion_document_url columns to court_orders table
ALTER TABLE public.court_orders 
ADD COLUMN completion_date date,
ADD COLUMN completion_document_url text;