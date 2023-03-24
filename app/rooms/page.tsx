import { createClient } from '@/lib/supabase';
import CreateRoom from './create-room';
import Link from 'next/link';
import Container from '@/components/container';

async function getAllRooms() {
  const supabase = createClient();
  const { data, error } = await supabase.from('rooms').select(`
    *,
    messages(count)
  `);

  if (error) {
    return undefined;
  }

  return data;
}

export default async function RoomsIndexPage() {
  const rooms = await getAllRooms();

  return (
    <Container className="mt-6">
      <h1 className="text-3xl font-semibold mb-2">Rooms List</h1>
      <div className="mb-6">
        {!rooms ? (
          <>
            <p>No room found</p>
          </>
        ) : (
          <ul>
            {rooms.map((room) => (
              <li key={room.name}>
                <Link
                  className="underline decoration-slate-200 hover:decoration-indigo-800 text-indigo-700"
                  href={`/rooms/${room.id}`}
                >
                  {room.name}
                </Link>
                {room.messages &&
                  'count' in room.messages &&
                  (typeof room.messages.count === 'number' ||
                    typeof room.messages.count === 'string') && (
                    <p>{room.messages.count}</p>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2 className="text-xl font-medium mb-3">Add a new room</h2>
      <CreateRoom />
    </Container>
  );
}
