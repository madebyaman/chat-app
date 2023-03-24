'use client';

import { useSupabase } from '@/components/supabase-provider';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function CreateRoom() {
  const [name, setname] = useState('');
  const { supabase } = useSupabase();
  const router = useRouter();

  const [status, setStatus] = useState<
    | 'INIT'
    | 'ROOM_CHECKING'
    | 'ROOM_VALID'
    | 'ROOM_INVALID'
    | 'SUBMITTING'
    | 'FORM_ERROR'
    | 'FORM_SUCCESS'
  >('INIT');

  async function checkRoom() {
    // query for username. if length > 0 then return false. Else true
    if (!name) return;
    setStatus('ROOM_CHECKING');

    const { data, error } = await supabase
      .from('rooms')
      .select()
      .eq('name', name);

    if (error || data.length > 0) {
      setStatus('ROOM_INVALID');
      return false;
    }

    setStatus('ROOM_VALID');
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
        name: name,
        user_id: userId,
      };

      let { error } = await supabase.from('rooms').insert(updates);
      setStatus('FORM_SUCCESS');
      setname('');
      router.refresh();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      setStatus('FORM_ERROR');
    }
  }

  return (
    <form
      onSubmit={submitForm}
      className="border border-slate-200 p-4 rounded shadow-lg"
    >
      <label
        htmlFor="username"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Room Name
      </label>
      <input
        id="username"
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
        className="mt-2 block max-w-sm w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        onBlur={checkRoom}
      />
      <p className="text-sm font-medium">
        {status === 'ROOM_INVALID' && '❌ Room name not valid'}
        {status === 'ROOM_CHECKING' && '🌀 Checking room name availability'}
        {status === 'ROOM_VALID' && '✅ Room name valid'}
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
        {status === 'SUBMITTING' ? 'Adding' : 'Add'} Room
      </button>
      <p className="text-sm font-medium">
        {status === 'FORM_ERROR' && '❌ Error adding'}
        {status === 'FORM_SUCCESS' && '✅ Form submitted successfully'}
      </p>
    </form>
  );
}
