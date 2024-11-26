//supabase/client.js

import { createBrowserClient } from '@supabase/ssr';
import dotenv from 'dotenv';

dotenv.config();

export function createClient() {
  return createBrowserClient(
    process.env.NODE_SUPABASE_URL,
    process.env.NODE_SUPABASE_ANON_KEY
  );
}