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
      className="px-6 py-3 bg-indigo-700 text-white hover:bg-indigo-500 rounded shadow-sm"
      type="button"
      onClick={handleGitHubLogin}
    >
      Login with Github
    </button>
  );
}
