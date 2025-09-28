UPDATE auth.users 
SET encrypted_password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'test@courtdashboard.com';