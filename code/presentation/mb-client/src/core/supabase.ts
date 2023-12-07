import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  //todo wip/auth dont commit these stuff
  '',
  ''
);
