import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  'https://vziknzssjfrtsruixryg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aWtuenNzamZydHNydWl4cnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDczMDIsImV4cCI6MjA5MDg4MzMwMn0.sQyvl36Lnc44hX7HH3zmjhkbVscO66W7NyTFhfKrxsQ',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
