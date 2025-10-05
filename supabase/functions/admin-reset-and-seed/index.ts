import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting full reset and seed...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const testEmail = 'test@courtdashboard.com';
    const testPassword = 'Password123!';

    // 1) Wipe app data (orders -> cases -> profiles)
    console.log('Deleting court_orders...');
    const { error: delOrdersErr } = await supabaseAdmin
      .from('court_orders')
      .delete()
      .gt('created_at', '1970-01-01');
    if (delOrdersErr) throw delOrdersErr;

    console.log('Deleting court_cases...');
    const { error: delCasesErr } = await supabaseAdmin
      .from('court_cases')
      .delete()
      .gt('created_at', '1970-01-01');
    if (delCasesErr) throw delCasesErr;

    console.log('Deleting profiles...');
    const { error: delProfilesErr } = await supabaseAdmin
      .from('profiles')
      .delete()
      .gt('created_at', '1970-01-01');
    if (delProfilesErr) throw delProfilesErr;

    // 2) Remove existing test user if present
    console.log('Looking for existing test user to delete...');
    const { data: users, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) throw listErr;

    const existing = users.users.find((u) => u.email === testEmail);
    if (existing) {
      console.log(`Deleting existing user ${existing.id}`);
      const { error: delUserErr } = await supabaseAdmin.auth.admin.deleteUser(existing.id);
      if (delUserErr) throw delUserErr;
    }

    // 3) Create fresh test user
    console.log('Creating new test user...');
    const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Test User' },
    });
    if (createErr) throw createErr;

    const userId = createData.user!.id;
    console.log('Inserting profile...');
    const { error: profileErr } = await supabaseAdmin.from('profiles').insert({
      user_id: userId,
      full_name: 'Test User',
      email: testEmail,
    });
    if (profileErr) throw profileErr;

    // 4) Seed 5 cases in various stages
    const today = new Date();
    const addDays = (n: number) => new Date(today.getTime() + n * 86400000).toISOString().slice(0, 10);

    const cases = [
      {
        case_number: 'Writ A: 2025/101',
        petitioner: 'Raj Kumar Sharma',
        respondent: 'State of U.P. and others',
        court_name: 'Court No. 15',
        urgency: 'urgent',
        filing_date: addDays(-14),
        latest_order_date: addDays(-2),
        next_hearing_date: addDays(2),
        user_id: userId,
        case_type: 'Writ',
        case_summary: 'Directions sought for timely action by authorities.'
      },
      {
        case_number: 'Writ B: 2025/202',
        petitioner: 'Priya Singh',
        respondent: 'Municipal Corporation and others',
        court_name: 'Court No. 7',
        urgency: 'warning',
        filing_date: addDays(-20),
        latest_order_date: addDays(-5),
        next_hearing_date: addDays(10),
        user_id: userId,
        case_type: 'Writ',
        case_summary: 'Challenging property tax assessment.'
      },
      {
        case_number: 'PIL: 2025/303',
        petitioner: 'Citizens Welfare Association',
        respondent: 'State of U.P. and others',
        court_name: 'Court No. 3',
        urgency: 'normal',
        filing_date: addDays(-40),
        latest_order_date: addDays(-15),
        next_hearing_date: addDays(20),
        user_id: userId,
        case_type: 'PIL',
        case_summary: 'Environmental measures for river cleanup.'
      },
      {
        case_number: 'Criminal: 2025/404',
        petitioner: 'State vs Amit Kumar',
        respondent: 'Amit Kumar',
        court_name: 'Court No. 12',
        urgency: 'warning',
        filing_date: addDays(-10),
        latest_order_date: addDays(-1),
        next_hearing_date: addDays(5),
        user_id: userId,
        case_type: 'Criminal',
        case_summary: 'Bail application proceedings.'
      },
      {
        case_number: 'Civil: 2025/505',
        petitioner: 'ABC Private Ltd',
        respondent: 'XYZ Corporation and others',
        court_name: 'Court No. 9',
        urgency: 'normal',
        filing_date: addDays(-60),
        latest_order_date: addDays(-7),
        next_hearing_date: null,
        user_id: userId,
        case_type: 'Civil',
        case_summary: 'Breach of contract dispute.'
      },
    ];

    console.log('Inserting court_cases...');
    const { data: insertedCases, error: casesErr } = await supabaseAdmin
      .from('court_cases')
      .insert(cases)
      .select('*');
    if (casesErr) throw casesErr;

    // map by case_number for deterministic orders
    const byNumber: Record<string, any> = {};
    insertedCases?.forEach((c) => (byNumber[c.case_number] = c));

    console.log('Inserting court_orders...');
    const orders = [
      // For Writ A urgent - pending
      {
        case_id: byNumber['Writ A: 2025/101'].id,
        user_id: userId,
        order_date: addDays(-2),
        deadline: addDays(1),
        status: 'pending',
        summary: 'File rejoinder within 3 days',
        action_required: 'Prepare and file rejoinder',
        file_name: 'order_writ_a.pdf',
        file_url: 'https://example.com/order_writ_a.pdf',
        file_type: 'application/pdf',
        thumbnail_url: null,
      },
      // For Writ B warning - in-progress
      {
        case_id: byNumber['Writ B: 2025/202'].id,
        user_id: userId,
        order_date: addDays(-5),
        deadline: addDays(20),
        status: 'in-progress',
        summary: 'Notice issued to Municipal Corporation',
        action_required: 'Monitor compliance and prepare arguments',
        file_name: 'notice_writ_b.pdf',
        file_url: 'https://example.com/notice_writ_b.pdf',
        file_type: 'application/pdf',
        thumbnail_url: null,
      },
      // For PIL normal - pending and completed
      {
        case_id: byNumber['PIL: 2025/303'].id,
        user_id: userId,
        order_date: addDays(-15),
        deadline: addDays(14),
        status: 'pending',
        summary: 'State to submit compliance report within 2 weeks',
        action_required: 'Review compliance report on filing',
        file_name: 'order_pil_pending.pdf',
        file_url: 'https://example.com/order_pil_pending.pdf',
        file_type: 'application/pdf',
        thumbnail_url: null,
      },
      {
        case_id: byNumber['PIL: 2025/303'].id,
        user_id: userId,
        order_date: addDays(-30),
        deadline: null,
        status: 'completed',
        summary: 'Interim directions issued',
        action_required: 'Monitor implementation',
        file_name: 'order_pil_completed.pdf',
        file_url: 'https://example.com/order_pil_completed.pdf',
        file_type: 'application/pdf',
        thumbnail_url: null,
      },
      // For Criminal warning - pending
      {
        case_id: byNumber['Criminal: 2025/404'].id,
        user_id: userId,
        order_date: addDays(-1),
        deadline: addDays(5),
        status: 'pending',
        summary: 'Bail order reserved',
        action_required: 'Appear for pronouncement',
        file_name: 'bail_reserved.pdf',
        file_url: 'https://example.com/bail_reserved.pdf',
        file_type: 'application/pdf',
        thumbnail_url: null,
      },
      // For Civil normal - completed
      {
        case_id: byNumber['Civil: 2025/505'].id,
        user_id: userId,
        order_date: addDays(-7),
        deadline: null,
        status: 'completed',
        summary: 'Final judgment delivered',
        action_required: 'Archive and close',
        file_name: 'final_judgment.pdf',
        file_url: 'https://example.com/final_judgment.pdf',
        file_type: 'application/pdf',
        thumbnail_url: null,
      },
    ];

    const { error: ordersErr } = await supabaseAdmin.from('court_orders').insert(orders);
    if (ordersErr) throw ordersErr;

    console.log('Seeding completed.');
    return new Response(
      JSON.stringify({ success: true, email: testEmail, password: testPassword, cases: insertedCases?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-reset-and-seed:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});