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

    const testEmail = 'test@courtdashboard.com';

    // Ensure user exists
    const { data: users, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) throw listErr;
    let user = users.users.find((u) => (u.email || '').toLowerCase() === testEmail) || null;

    if (!user) {
      // Do not attempt to create the auth user here to avoid 500s from Auth.
      // Inform caller to run the full reset & seed which handles user creation.
      return new Response(
        JSON.stringify({ success: false, error: 'Test user not found. Run Full reset & seed first.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    // Check if profile exists
    const { data: existingProfiles, error: profSelErr } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    if (profSelErr) throw profSelErr;

    if (!existingProfiles || existingProfiles.length === 0) {
      const { error: insertErr } = await supabaseAdmin.from('profiles').insert({
        user_id: userId,
        full_name: user.user_metadata?.full_name || 'Test User',
        email: user.email,
      });
      if (insertErr) throw insertErr;
    } else {
      const { error: updateErr } = await supabaseAdmin
        .from('profiles')
        .update({ full_name: 'Test User', email: testEmail })
        .eq('user_id', userId);
      if (updateErr) throw updateErr;
    }

    return new Response(JSON.stringify({ success: true, user_id: userId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('admin-create-test-profile error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});