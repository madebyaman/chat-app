'use client';

import { FormEvent, HTMLAttributes, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useSupabase } from '@/components/supabase-provider';

interface SendMessageProps extends HTMLAttributes<HTMLFormElement> {
  roomId: string;
  userId: string;
}

export default function SendMessage({
  className,
  roomId,
  userId,
}: SendMessageProps) {
  const [message, setMessage] = useState('');
  const { supabase } = useSupabase();
  const [status, setStatus] = useState<
    'INIT' | 'SENDING' | 'ERROR' | 'SUCCESS'
  >('INIT');

  async function addMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('SENDING');

    try {
      const { error } = await supabase
        .from('messages')
        .insert({ text: message, room_id: Number(roomId), user_id: userId });
      setMessage('');
      setStatus('SUCCESS');
    } catch (error) {
      setStatus('ERROR');
    }
  }

  return (
    <form
      className={clsx('flex flex-col gap-4 w-full', className)}
      onSubmit={addMessage}
    >
      <textarea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border border-slate-300 rounded-lg p-3 shadow"
        placeholder="Message"
      />
      <button
        disabled={status === 'SENDING'}
        className={clsx(
          'bg-indigo-700 text-sm self-end text-white p-3 rounded shadow-sm inline-flex gap-2 items-center max-w-max',
          status === 'SENDING'
            ? 'cursor-not-allowed opacity-40'
            : 'hover:bg-indigo-500'
        )}
      >
        <PaperAirplaneIcon className="h-5 w-5" />
        Send
      </button>
      <p className="text-sm font-medium">
        {status === 'ERROR' && '❌ Error sending message'}
      </p>
    </form>
  );
}
