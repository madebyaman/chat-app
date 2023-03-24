import { createClient } from '@/lib/supabase';
import ChangeUsername from './change-username';

async function getUsername() {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.data.session?.user.id);

  if (error || data.length > 1) {
    return undefined;
  }
  let username: string | null = '';

  data.forEach((user) => {
    username = user.username || '';
  });
  return username;
}

export default async function CreateUpdateUsername() {
  const username = await getUsername();

  return (
    <div className="mt-6 ml-6">
      <h1 className="text-3xl font-bold">Create or Update username</h1>
      <ChangeUsername username={username || ''} />
    </div>
  );
}
