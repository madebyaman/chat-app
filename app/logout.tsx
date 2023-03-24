'use client';

import { useSupabase } from '@/components/supabase-provider';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Logout() {
  const { supabase } = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <button
      className="px-6 py-3 text-slate-700 border border-slate-300 shadow-sm rounded hover:bg-slate-100 inline-flex gap-2 items-center"
      type="button"
      onClick={handleLogout}
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      Logout
    </button>
  );
}
