import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from './types/supabase'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && (req.nextUrl.pathname.startsWith('/rooms') || req.nextUrl.pathname.startsWith('/username'))) {
    // Auth condition not met, redirect to home page.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && req.nextUrl.pathname.startsWith('/rooms')) {
    const { data, error } = await supabase.from('profiles').select('username').eq('id', session.user.id).single();
    let username = data?.username;

    if (!username) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/username';
      redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res
}
