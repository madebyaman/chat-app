'use client';

import { useSupabase } from '@/components/supabase-provider';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ChangeUsername({ username }: { username?: string }) {
  const [name, setname] = useState(username || '');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { supabase } = useSupabase();

  const [status, setStatus] = useState<
    | 'INIT'
    | 'USERNAME_CHECKING'
    | 'USERNAME_VALID'
    | 'USERNAME_INVALID'
    | 'SUBMITTING'
    | 'FORM_ERROR'
    | 'FORM_SUCCESS'
  >('INIT');

  async function checkUsername() {
    if (!name) return;
    // query for username. if length > 0 then return false. Else true
    setStatus('USERNAME_CHECKING');

    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('username', name);

    if (error || data.length > 0) {
      setStatus('USERNAME_INVALID');
      return false;
    }

    setStatus('USERNAME_VALID');
    return true;
  }

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    setStatus('SUBMITTING');

    // First get current user
    try {
      const userId = await supabase.auth
        .getSession()
        .then((data) => data.data.session?.user.id);

      if (!userId) return;

      const updates = {
        id: userId,
        username: name,
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      setStatus('FORM_SUCCESS');
      setname('');
      const redirecteTo = searchParams.get('redirectedFrom');
      if (redirecteTo) router.push(redirecteTo);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      setStatus('FORM_ERROR');
    }
  }

  return (
    <form onSubmit={submitForm} className="mt-8">
      <label
        htmlFor="username"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Username
      </label>
      <input
        id="username"
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
        className="mt-2 block max-w-sm w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        onBlur={checkUsername}
      />
      <p className="text-sm font-medium">
        {status === 'USERNAME_INVALID' && '❌ Username not valid'}
        {status === 'USERNAME_CHECKING' && '🌀 Checking username availability'}
        {status === 'USERNAME_VALID' && '✅ Username valid'}
      </p>
      <button
        disabled={[
          'USERNAME_CHECKING',
          'USERNAME_INVALID',
          'SUBMITTING',
        ].includes(status)}
        className={clsx(
          'mt-6 inline-flex justify-center rounded-md bg-indigo-500 py-2 px-3 text-base font-semibold text-white shadow-sm',
          ['USERNAME_CHECKING', 'USERNAME_INVALID', 'SUBMITTING'].includes(
            status
          )
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
        )}
      >
        {status === 'SUBMITTING' ? 'Updating' : 'Update'} username
      </button>
      <p className="text-sm font-medium">
        {status === 'FORM_ERROR' && '❌ Error updating'}
        {status === 'FORM_SUCCESS' && '✅ Successfully updated username'}
      </p>
    </form>
  );
}
