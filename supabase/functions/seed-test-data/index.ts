import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log('Starting database seed...');

    const testEmail = 'testuser@courtmonitor.in';
    const testPassword = 'Test1234!';

    // 1. Delete existing test data
    console.log('Cleaning up existing data...');
    
    // Find existing test user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === testEmail);

    if (existingUser) {
      // Delete orders and cases for this user
      await supabaseAdmin.from('court_orders').delete().eq('user_id', existingUser.id);
      await supabaseAdmin.from('court_cases').delete().eq('user_id', existingUser.id);
      await supabaseAdmin.from('profiles').delete().eq('user_id', existingUser.id);
      
      // Delete auth user
      await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      console.log('Existing test user and data deleted');
    }

    // 2. Create new test user
    console.log('Creating test user...');
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test Officer',
        department: 'Land Revenue',
        accessLevel: 'Tehsil',
      },
    });

    if (createError) throw createError;
    const userId = createData.user!.id;
    console.log('Test user created:', userId);

    // 3. Create profile
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      user_id: userId,
      full_name: 'Test Officer',
      email: testEmail,
    });

    if (profileError) throw profileError;
    console.log('Profile created');

    // 4. Create 5 court cases
    console.log('Creating court cases...');
    
    const cases = [
      {
        user_id: userId,
        case_number: 'PIL/2243/2025',
        petitioner: 'Arvind Kumar',
        respondent: 'State of U.P. and Others',
        court_name: 'High Court of Allahabad',
        filing_date: '2025-07-25',
        next_hearing_date: '2025-08-19',
        urgency: 'urgent' as const,
        case_type: 'PIL',
        case_summary: 'Petitioner seeks action on land demarcation in Rampur Ganj village',
        latest_order_date: '2025-08-12',
      },
      {
        user_id: userId,
        case_number: 'PIL/2208/2025',
        petitioner: 'Ramesh Sharma',
        respondent: 'District Collector and Others',
        court_name: 'High Court of Allahabad',
        filing_date: '2025-06-15',
        next_hearing_date: '2025-09-10',
        urgency: 'normal' as const,
        case_type: 'PIL',
        case_summary: 'Public interest litigation regarding land rights',
        latest_order_date: '2025-07-20',
      },
      {
        user_id: userId,
        case_number: 'WP/1170/2025',
        petitioner: 'Sita Devi',
        respondent: 'Tehsildar and Others',
        court_name: 'High Court of Allahabad',
        filing_date: '2025-05-10',
        next_hearing_date: '2025-08-25',
        urgency: 'warning' as const,
        case_type: 'WP',
        case_summary: 'Writ petition for land mutation and ownership rights',
        latest_order_date: '2025-08-05',
      },
      {
        user_id: userId,
        case_number: 'PIL/2210/2025',
        petitioner: 'Mukesh Yadav',
        respondent: 'State of U.P.',
        court_name: 'High Court of Allahabad',
        filing_date: '2025-07-01',
        next_hearing_date: '2025-08-30',
        urgency: 'urgent' as const,
        case_type: 'PIL',
        case_summary: 'Land acquisition compensation dispute',
        latest_order_date: '2025-07-28',
      },
      {
        user_id: userId,
        case_number: 'WP/1102/2024',
        petitioner: 'Rajesh Kumar',
        respondent: 'Revenue Department',
        court_name: 'High Court of Allahabad',
        filing_date: '2024-12-15',
        next_hearing_date: null,
        urgency: 'normal' as const,
        case_type: 'WP',
        case_summary: 'Disposed case - Land record correction completed',
        latest_order_date: '2025-01-20',
      },
    ];

    const { data: insertedCases, error: casesError } = await supabaseAdmin
      .from('court_cases')
      .insert(cases)
      .select();

    if (casesError) throw casesError;
    console.log(`Created ${insertedCases.length} court cases`);

    // 5. Create court orders for each case
    console.log('Creating court orders...');
    
    const orders = [
      // Case 1: PIL/2243/2025
      {
        user_id: userId,
        case_id: insertedCases[0].id,
        order_date: '2025-07-25',
        file_name: 'PIL_2243_status.pdf',
        file_url: '/docs/PIL_2243_status.pdf',
        file_type: 'application/pdf',
        summary: 'Petitioner seeks action on land demarcation. Case admitted for hearing.',
        action_required: 'File counter affidavit',
        deadline: '2025-08-15',
        status: 'pending' as const,
      },
      {
        user_id: userId,
        case_id: insertedCases[0].id,
        order_date: '2025-08-12',
        file_name: 'PIL_2243_order.pdf',
        file_url: '/docs/PIL_2243_order.pdf',
        file_type: 'application/pdf',
        summary: 'Collector directed to file detailed map and demarcation report within 3 days',
        action_required: 'Submit demarcation map',
        deadline: '2025-08-15',
        status: 'in-progress' as const,
      },
      // Case 2: PIL/2208/2025
      {
        user_id: userId,
        case_id: insertedCases[1].id,
        order_date: '2025-07-20',
        file_name: 'PIL_2208_status.pdf',
        file_url: '/docs/PIL_2208_status.pdf',
        file_type: 'application/pdf',
        summary: 'Reply filed by District Collector. Matter adjourned for final hearing.',
        action_required: 'None',
        status: 'completed' as const,
        completion_date: '2025-07-20',
      },
      // Case 3: WP/1170/2025
      {
        user_id: userId,
        case_id: insertedCases[2].id,
        order_date: '2025-08-05',
        file_name: 'WP_1170_order.pdf',
        file_url: '/docs/WP_1170_order.pdf',
        file_type: 'application/pdf',
        summary: 'Tehsildar ordered to verify land records and submit report',
        action_required: 'Land record verification report',
        deadline: '2025-08-20',
        status: 'in-progress' as const,
      },
      // Case 4: PIL/2210/2025
      {
        user_id: userId,
        case_id: insertedCases[3].id,
        order_date: '2025-07-28',
        file_name: 'PIL_2210_order.pdf',
        file_url: '/docs/PIL_2210_order.pdf',
        file_type: 'application/pdf',
        summary: 'State directed to file compensation calculation within 2 days',
        action_required: 'Submit compensation calculation',
        deadline: '2025-08-18',
        status: 'pending' as const,
      },
      // Case 5: WP/1102/2024 (Disposed)
      {
        user_id: userId,
        case_id: insertedCases[4].id,
        order_date: '2025-01-20',
        file_name: 'WP_1102_final_order.pdf',
        file_url: '/docs/WP_1102_final_order.pdf',
        file_type: 'application/pdf',
        summary: 'Case disposed. Land record correction ordered and completed.',
        action_required: 'None',
        status: 'completed' as const,
        completion_date: '2025-01-20',
      },
    ];

    const { data: insertedOrders, error: ordersError } = await supabaseAdmin
      .from('court_orders')
      .insert(orders)
      .select();

    if (ordersError) throw ordersError;
    console.log(`Created ${insertedOrders.length} court orders`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database seeded successfully',
        testUser: {
          email: testEmail,
          password: testPassword,
        },
        stats: {
          cases: insertedCases.length,
          orders: insertedOrders.length,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
