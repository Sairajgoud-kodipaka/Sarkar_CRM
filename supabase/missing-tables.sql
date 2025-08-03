-- =============================================
-- MISSING TABLES FOR NEXTAUTH.JS INTEGRATION
-- =============================================

-- Create accounts table for NextAuth.js
CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type character varying NOT NULL,
  provider character varying NOT NULL,
  provider_account_id character varying NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type character varying,
  scope character varying,
  id_token text,
  session_state character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_provider_provider_account_id_key UNIQUE (provider, provider_account_id)
);

-- Create sessions table for NextAuth.js (if not exists)
-- Note: sessions table already exists, but let's ensure it has the right structure
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Create verification_tokens table for NextAuth.js (if not exists)
-- Note: verification_tokens table already exists, but let's ensure it has the right structure
ALTER TABLE public.verification_tokens 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Add foreign key constraints
ALTER TABLE public.accounts 
ADD CONSTRAINT accounts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.sessions 
ADD CONSTRAINT sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON public.accounts(provider);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON public.verification_tokens(token);

-- Enable RLS for new tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Enable real-time for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.verification_tokens;

-- Create triggers for updated_at
CREATE TRIGGER update_accounts_updated_at 
  BEFORE UPDATE ON public.accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
  BEFORE UPDATE ON public.sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_tokens_updated_at 
  BEFORE UPDATE ON public.verification_tokens 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 