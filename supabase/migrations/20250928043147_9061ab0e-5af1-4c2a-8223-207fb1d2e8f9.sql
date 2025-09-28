-- Upsert identity for email provider (no insert into generated columns)
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT gen_random_uuid(), u.id,
       jsonb_build_object('sub', u.id::text, 'email', u.email),
       'email', u.email, NOW(), NOW(), NOW()
FROM auth.users u
WHERE u.email = 'test@courtdashboard.com'
ON CONFLICT (provider, provider_id) DO UPDATE
SET user_id = EXCLUDED.user_id,
    identity_data = EXCLUDED.identity_data,
    updated_at = NOW();