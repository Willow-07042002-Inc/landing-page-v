import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xdfaikvksifsszlbskxy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZmFpa3Zrc2lmc3N6bGJza3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTc4MzMsImV4cCI6MjA4NzUzMzgzM30.0geBO1lpwHzHgVi2WQ60w3ajNdCEWkMIUmzNtz7vXcc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
