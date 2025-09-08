-- Fix the file_type check constraint to allow 'pdf' value
ALTER TABLE court_orders DROP CONSTRAINT IF EXISTS court_orders_file_type_check;

-- Add a new check constraint that allows common file types including 'pdf'
ALTER TABLE court_orders ADD CONSTRAINT court_orders_file_type_check 
CHECK (file_type IN ('pdf', 'PDF', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'));

-- Also ensure the case_id column properly references court_cases table
-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'court_orders_case_id_fkey'
    ) THEN
        ALTER TABLE court_orders 
        ADD CONSTRAINT court_orders_case_id_fkey 
        FOREIGN KEY (case_id) REFERENCES court_cases(id) ON DELETE CASCADE;
    END IF;
END $$;