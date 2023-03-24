import Container from '@/components/container';
import Link from 'next/link';
import LoginWithGithub from './login-with-github';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import LoginWithGoogle from './login-with-google';

async function getUsername() {
  const supabase = createClient();
  const session = await supabase.auth.getSession();
  if (!session.data.session) return undefined;

  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.data.session.user.id)
    .single();
  return data?.username || '';
}

export default async function Home() {
  const username = await getUsername();

  return (
    <Container className="grid place-items-center mt-6 gap-2">
      <h1 className="text-3xl font-bold text-slate-800 mt-4 mb-2">
        Welcome {username ? username : 'to Supabase powered chat app'}
      </h1>
      {typeof username !== 'undefined' ? (
        <>
          <Link
            href="/rooms"
            className="text-indigo-700 underline underline-offset-4 decoration-slate-200 hover:decoration-indigo-800"
          >
            Go to Rooms
          </Link>
        </>
      ) : (
        <>
          <p className="font-medium text-sm text-slate-700">
            To start using the app you need to login
          </p>
          <LoginWithGithub />
          <LoginWithGoogle />
        </>
      )}
    </Container>
  );
}
