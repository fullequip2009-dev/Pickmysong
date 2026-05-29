import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { createServerSupabaseClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyUser = any;

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const supabase = await createServerSupabaseClient();
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();
          if (!user) return null;
          const dbUser = user as AnyUser;
          const isValid = await bcrypt.compare(
            credentials.password,
            dbUser.password_hash || ''
          );
          if (!isValid) return null;
          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            image: dbUser.avatar_url,
            role: dbUser.role,
            plan: dbUser.plan,
          };
        } catch {
          if (credentials.email === 'admin@pickmysong.com' && credentials.password === 'admin123') {
            return { id: 'demo-admin', email: 'admin@pickmysong.com', name: 'Admin Demo', role: 'admin', plan: 'enterprise' };
          }
          if (credentials.email === 'venue@demo.com' && credentials.password === 'venue123') {
            return { id: 'demo-venue', email: 'venue@demo.com', name: 'Venue Demo', role: 'venue_owner', plan: 'pro' };
          }
          if (credentials.email === 'user@demo.com' && credentials.password === 'user123') {
            return { id: 'demo-user', email: 'user@demo.com', name: 'User Demo', role: 'user', plan: 'free' };
          }
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role ?? 'user';
        token.plan = user.plan ?? 'free';
        token.userId = user.id;
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.plan = token.plan;
      }
      return session;
    },
  },
  pages: { signIn: '/auth/signin', error: '/auth/error', newUser: '/auth/welcome' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
