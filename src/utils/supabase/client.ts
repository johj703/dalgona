import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true, // 세션 지속
      detectSessionInUrl: true // URL에서 세션을 감지
    }
  });

const browserClient = createClient();

export default browserClient;
