'use client';

import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';

export default function LoginWithGithub() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    // Then redirect to rooms page
    router.push('/rooms');
  };

  return (
    <button
      className="px-6 py-3 text-slate-700 border border-slate-100 hover:bg-slate-100"
      type="button"
      onClick={handleGitHubLogin}
    >
      Login with Github
    </button>
  );
}
