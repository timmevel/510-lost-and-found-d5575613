// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ibsolosdgsfyfunxqfoe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlic29sb3NkZ3NmeWZ1bnhxZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0ODUzODEsImV4cCI6MjA0ODA2MTM4MX0.AvKJRuvHWQF5_szbt6NUwF6mkJx6f8sOrFjRvF0YvW4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);