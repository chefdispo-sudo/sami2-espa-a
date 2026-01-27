
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://potfcocdcpbunwmfqjkv.supabase.co';
const supabaseKey = 'sb_publishable_FmLe_Hh4km_LF1ZgSfnGvg_Qxq3HHO9';

let client: any = {
  from: () => ({
    insert: async () => ({ error: null }),
    select: async () => ({ data: [], error: null })
  })
};

try {
  client = createClient(supabaseUrl, supabaseKey);
} catch (e) {
  console.warn("Supabase initialization failed, using mock client.");
}

export const supabase = client;
