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
    console.log('Starting admin reset for test user...');
    
    // Initialize admin client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const testEmail = 'test@courtdashboard.com';
    const testPassword = 'Password123!';
    
    console.log(`Attempting to reset user: ${testEmail}`);

    // First, try to list existing users to see if user exists
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      throw listError;
    }

    const existingUser = users.users.find(user => user.email === testEmail);
    
    if (existingUser) {
      console.log(`User exists with ID: ${existingUser.id}, updating password...`);
      
      // Update existing user
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password: testPassword,
          email_confirm: true,
          user_metadata: { full_name: 'Test User' }
        }
      );
      
      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }
      
      console.log('User updated successfully:', updateData.user?.email);
      
      return new Response(JSON.stringify({ 
        success: true, 
        action: 'updated',
        user: updateData.user?.email,
        message: 'Test user password updated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } else {
      console.log('User does not exist, creating new user...');
      
      // Create new user
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Test User' }
      });
      
      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }
      
      console.log('User created successfully:', createData.user?.email);
      
      return new Response(JSON.stringify({ 
        success: true, 
        action: 'created',
        user: createData.user?.email,
        message: 'Test user created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
  } catch (error) {
    console.error('Error in admin-reset-test-user function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});