import { createClient } from '@supabase/supabase-js'

// Willow (Prod). This previously pointed at project ref `xdfaikvksifsszlbskxy`,
// which no longer exists — its hostname stopped resolving, so every write from
// this client failed and the newsletter form silently dropped its subscribers.
//
// Publishable key, not the legacy anon JWT: it is safe in the browser and can
// be rotated on its own. It can INSERT into form_submissions (there is an
// "Allow public insert" policy) but cannot read the table back, which is
// deliberate — marketing leads must not be readable from the client. That also
// means no .select()/`return=representation` on these inserts: asking for the
// inserted row back requires a SELECT policy and would fail with a 401.
const supabaseUrl = 'https://ojnlnhcbhkrymdsifpps.supabase.co'
const supabasePublishableKey = 'sb_publishable_q1yr1ESRHcJjXbC0Qoq7hA_G1NoAKrR'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
