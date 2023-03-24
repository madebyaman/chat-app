import Container from '@/components/container';
import clsx from 'clsx';
import SendMessage from './send-message';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Messages from './messages';

export const revalidate = 0;

async function getMessages(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rooms')
    .select(
      `
      *,
      messages (*,
        profiles(
          username
        )
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

const messages = [
  {
    time: '2021-09-01 10:30:00',
    username: 'John',
    message: 'Good morning, how are you doing today?',
  },
  {
    time: '2021-09-02 15:45:00',
    username: 'Jane',
    message: "Hey John, I'm good thanks. How about you?",
  },
  {
    time: '2021-09-03 08:20:00',
    username: 'John',
    message:
      "I'm good too, thanks for asking. Did you hear about the new project we're working on?",
  },
  {
    time: '2021-09-03 09:15:00',
    username: 'Jane',
    message: 'No, what is it about?',
  },
  {
    time: '2021-09-03 09:30:00',
    username: 'John',
    message:
      "It's a mobile app that we'll be developing for our client. It's going to be a challenging one but exciting at the same time.",
  },
  {
    time: '2021-09-03 10:00:00',
    username: 'Jane',
    message: 'Wow, that sounds interesting! How can I help?',
  },
];

export default async function IndividualRoomPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const userId = await supabase.auth
    .getSession()
    .then((res) => res.data.session?.user.id);
  if (!userId) return 'User not found. Try refreshing';

  const messageData = await getMessages(params.id);
  if (!messageData || !messageData.user_id) return notFound();

  const { messages } = messageData;

  return (
    <Container className="my-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        {messageData.name}
      </h1>
      <div className="flex flex-col gap-8">
        {!messages || !Array.isArray(messages) ? (
          <p className="text-center block">No messages found</p>
        ) : (
          <Messages
            serverMessages={messages}
            user_id={userId}
            roomId={params.id}
          />
        )}
        <div
          className={clsx(
            'w-2/3',
            'flex flex-col items-end self-end min-h-full'
          )}
        >
          <SendMessage roomId={params.id} userId={userId} />
        </div>
      </div>
    </Container>
  );
}
