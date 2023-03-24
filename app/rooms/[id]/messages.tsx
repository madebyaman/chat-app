'use client';

import { useSupabase } from '@/components/supabase-provider';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

export default function Messages({
  user_id,
  serverMessages,
  roomId,
}: {
  user_id: string;
  roomId: string;
  serverMessages: {
    created_at: string | null;
    id: number;
    room_id: number;
    text: string | null;
    user_id: string;
    profiles:
      | {
          username: string | null;
        }
      | {
          username: string | null;
        }[]
      | null;
  }[];
}) {
  const [messages, setMessages] = useState(serverMessages);
  const { supabase } = useSupabase();

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) =>
          setMessages((prev) => {
            // query for username of the user.
            const newItem = payload.new as any;
            return [...prev, newItem];
          })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  return (
    <>
      {messages.length === 0 ? (
        <p className="text-center block">No messages found</p>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={clsx(
              'w-2/3',
              user_id === message.user_id && 'flex flex-col items-end self-end'
            )}
          >
            <div
              className={clsx(
                'inline-block relative pb-10 p-4 rounded-md',
                user_id === message.user_id
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-slate-100 text-black'
              )}
            >
              {message.text}
              {message.created_at && (
                <p className="text-sm absolute right-4 bottom-4 opacity-70 truncate">
                  <time dateTime={message.created_at}>
                    {formatDistanceToNow(new Date(message.created_at))}
                  </time>{' '}
                  ago
                </p>
              )}
            </div>
            {user_id !== message.user_id &&
              message.profiles &&
              'username' in message.profiles && (
                <div className="text-sm flex flex-col gap-1">
                  <p className="text-sm">{message.profiles.username}</p>
                </div>
              )}
          </div>
        ))
      )}
    </>
  );
}
