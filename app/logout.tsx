'use client';

import { useSupabase } from '@/components/supabase-provider';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { HTMLAttributes } from 'react';

interface LogoutProps extends HTMLAttributes<HTMLButtonElement> {}

export default function Logout({ className, ...props }: LogoutProps) {
  const { supabase } = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <button
      className={clsx(
        'px-6 py-3 text-slate-700 border border-slate-300 shadow-sm rounded hover:bg-slate-100 inline-flex gap-2 items-center',
        className
      )}
      type="button"
      onClick={handleLogout}
      {...props}
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      Logout
    </button>
  );
}
