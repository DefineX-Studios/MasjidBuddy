import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import secrets from 'secrets.json';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  secrets.supabase.url,
  secrets.supabase.key
);
