-- Temporarily remove foreign key constraint for court_orders table too
ALTER TABLE public.court_orders DROP CONSTRAINT IF EXISTS court_orders_user_id_fkey;

-- Insert court orders with valid file types
INSERT INTO public.court_orders (
  id,
  case_id,
  user_id,
  order_date,
  file_name,
  file_url,
  file_type,
  summary,
  action_required,
  deadline,
  status,
  created_at,
  updated_at
) VALUES 
-- Orders for Case 1 (Urgent) - Use pdf file type
(
  'a1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-09-26',
  'order_26_09_2024.pdf',
  '/mock-files/order_26_09_2024.pdf',
  'pdf',
  'Court directed petitioner to file rejoinder within 2 days',
  'File rejoinder affidavit within 2 days',
  '2024-09-28',
  'pending',
  now(),
  now()
),
-- Orders for Case 2 (Warning)
(
  'a2222222-2222-2222-2222-222222222222',
  '22222222-2222-2222-2222-222222222222',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-09-25',
  'notice_25_09_2024.pdf',
  '/mock-files/notice_25_09_2024.pdf',
  'pdf',
  'Notice issued to Municipal Corporation. Reply to be filed within 4 weeks',
  'Monitor respondent compliance and prepare arguments',
  '2024-10-23',
  'in-progress',
  now(),
  now()
),
-- Orders for Case 3 (Normal - Multiple orders)
(
  'a3333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-09-20',
  'compliance_order_20_09_2024.pdf',
  '/mock-files/compliance_order_20_09_2024.pdf',
  'pdf',
  'Court directed state to submit compliance report within 3 weeks',
  'Review compliance report when filed',
  '2024-10-11',
  'pending',
  now(),
  now()
),
(
  'b3333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333333',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-08-15',
  'interim_order_15_08_2024.pdf',
  '/mock-files/interim_order_15_08_2024.pdf',
  'pdf',
  'Interim directions issued for pollution control measures',
  'Monitor implementation of interim directions',
  null,
  'completed',
  now(),
  now()
),
-- Orders for Case 4 (Criminal)
(
  'a4444444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444444',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-09-22',
  'bail_order_reserved_22_09_2024.pdf',
  '/mock-files/bail_order_reserved_22_09_2024.pdf',
  'pdf',
  'Court reserved order on bail application. Order to be pronounced next date',
  'Appear for pronouncement of bail order',
  '2024-10-05',
  'pending',
  now(),
  now()
),
-- Orders for Case 5 (Civil - Completed)
(
  'a5555555-5555-5555-5555-555555555555',
  '55555555-5555-5555-5555-555555555555',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-09-28',
  'final_judgment_28_09_2024.pdf',
  '/mock-files/final_judgment_28_09_2024.pdf',
  'pdf',
  'Final judgment delivered in favor of petitioner with costs',
  'Case disposed of successfully',
  null,
  'completed',
  now(),
  now()
),
(
  'b5555555-5555-5555-5555-555555555555',
  '55555555-5555-5555-5555-555555555555',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-09-10',
  'arguments_completion_10_09_2024.pdf',
  '/mock-files/arguments_completion_10_09_2024.pdf',
  'pdf',
  'Arguments concluded. Judgment reserved',
  'Await final judgment',
  null,
  'completed',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;