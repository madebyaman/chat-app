'use client';

import { useSupabase } from '@/components/supabase-provider';

export default function LoginWithGoogle() {
  const { supabase } = useSupabase();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    // Then redirect to rooms page
  };

  return (
    <button
      className="px-6 py-3 bg-indigo-700 text-white hover:bg-indigo-500 rounded shadow-sm"
      type="button"
      onClick={handleGoogleLogin}
    >
      Login with Google
    </button>
  );
}
