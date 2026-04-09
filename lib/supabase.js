import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sdclvmbpjaphydclmzfv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY2x2bWJwamFwaHlkY2xtemZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODg3NDQsImV4cCI6MjA5MTE2NDc0NH0.AS3_AIxX7hl92lJiAdKQ0nBr4OziURWrfq9FPmPJsJg";

export const supabase = createClient(supabaseUrl, supabaseKey);