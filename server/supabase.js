import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cxupprsmketfnkokyepp.supabase.co',
  'sb_publishable_w-xupkVKocA9t_DHcKFcVg_ipm34Laf'
);

export default supabase;