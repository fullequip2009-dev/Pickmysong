import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectParam = searchParams.get('redirect') || '/discover';
  // Only allow internal relative redirects to avoid open-redirect issues.
  const safeRedirect = redirectParam.startsWith('/') ? redirectParam : '/discover';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeRedirect}`);
    }
  }

  // On error or missing code, send the user back to the auth page.
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
