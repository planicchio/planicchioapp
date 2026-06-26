// Bolt Supabase Client - Credenciais configuradas
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Credenciais do projeto Bolt Supabase (hardcoded para funcionar sem config no Vercel)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vziknzssjfrtsruixryg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aWtuenNzamZydHNydWl4cnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDczMDIsImV4cCI6MjA5MDg4MzMwMn0.sQyvl36Lnc44hX7HH3zmjhkbVscO66W7NyTFhfKrxsQ';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});