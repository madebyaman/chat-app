import { createClient } from '@/lib/supabase';
import ChangeUsername from './change-username';
import Container from '@/components/container';

async function getUsername() {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.data.session?.user.id)
    .single();

  return data?.username;
}

export default async function CreateUpdateUsername() {
  const username = await getUsername();

  return (
    <div className="mt-6 ml-6">
      <Container>
        <h1 className="text-3xl font-bold">Change your profile settings</h1>
        <div className="border border-slate-200 shadow-lg rounded-md p-4 mt-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Update your username
          </h2>
          {!username && (
            <span className="block font-bold text-sm text-red-700">
              To enter a room, you must create a unique username
            </span>
          )}
          <ChangeUsername username={username || ''} />
        </div>
      </Container>
    </div>
  );
}
