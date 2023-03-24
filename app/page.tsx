import Container from '@/components/container';
import Link from 'next/link';
import Logout from './logout';
import LoginWithGithub from './login-with-github';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) return notFound();

  return (
    <Container className="grid place-items-center mt-6 gap-2">
      {data.session ? (
        <>
          <Logout />
          <Link href="/rooms">Rooms</Link>
        </>
      ) : (
        <LoginWithGithub />
      )}
    </Container>
  );
}
