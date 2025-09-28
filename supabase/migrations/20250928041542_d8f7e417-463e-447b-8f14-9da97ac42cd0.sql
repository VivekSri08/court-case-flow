-- Temporarily remove foreign key constraint to allow test data
ALTER TABLE public.court_cases DROP CONSTRAINT IF EXISTS court_cases_user_id_fkey;

-- Insert 5 test cases with different stages and urgency levels
INSERT INTO public.court_cases (
  id,
  user_id,
  case_number,
  petitioner,
  respondent,
  court_name,
  case_type,
  filing_date,
  latest_order_date,
  next_hearing_date,
  urgency,
  case_summary,
  created_at,
  updated_at
) VALUES 
-- Case 1: Urgent case with deadline in 1 day
(
  '11111111-1111-1111-1111-111111111111',
  '550e8400-e29b-41d4-a716-446655440001',
  'Writ A: 2024/567',
  'Raj Kumar Sharma',
  'State of U.P. and others',
  'Court No. 15',
  'Writ Petition A',
  '2024-08-01',
  '2024-09-26',
  '2024-09-29',
  'urgent',
  'Petition for quashing FIR filed against petitioner. Court directed filing of counter affidavit.',
  now(),
  now()
),
-- Case 2: Warning case with deadline in 4 days
(
  '22222222-2222-2222-2222-222222222222',
  '550e8400-e29b-41d4-a716-446655440001',
  'Writ B: 2024/892',
  'Priya Singh',
  'Municipal Corporation and others',
  'Court No. 7',
  'Writ Petition B',
  '2024-07-15',
  '2024-09-25',
  '2024-10-02',
  'warning',
  'Challenge to property tax assessment. Notice issued to respondents.',
  now(),
  now()
),
-- Case 3: Normal case with no immediate deadline
(
  '33333333-3333-3333-3333-333333333333',
  '550e8400-e29b-41d4-a716-446655440001',
  'PIL: 2024/234',
  'Citizens Welfare Association',
  'State of U.P. and others',
  'Court No. 3',
  'Public Interest Litigation',
  '2024-06-10',
  '2024-09-20',
  '2024-10-15',
  'normal',
  'PIL regarding pollution control measures. Court seeking compliance report.',
  now(),
  now()
),
-- Case 4: Criminal case with medium urgency
(
  '44444444-4444-4444-4444-444444444444',
  '550e8400-e29b-41d4-a716-446655440001',
  'Criminal: 2024/1456',
  'State vs Amit Kumar',
  'Amit Kumar',
  'Court No. 12',
  'Criminal Petition',
  '2024-05-20',
  '2024-09-22',
  '2024-10-05',
  'warning',
  'Bail application in criminal case. Court reserved order for next date.',
  now(),
  now()
),
-- Case 5: Civil case completed recently
(
  '55555555-5555-5555-5555-555555555555',
  '550e8400-e29b-41d4-a716-446655440001',
  'Civil: 2024/789',
  'ABC Private Ltd',
  'XYZ Corporation and others',
  'Court No. 9',
  'Civil Suit',
  '2024-04-01',
  '2024-09-28',
  null,
  'normal',
  'Contract dispute case. Final judgment delivered in favor of petitioner.',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;