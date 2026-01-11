
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://potfcocdcpbunwmfqjkv.supabase.co';
const supabaseKey = 'sb_publishable_FmLe_Hh4km_LF1ZgSfnGvg_Qxq3HHO9';

export const supabase = createClient(supabaseUrl, supabaseKey);
