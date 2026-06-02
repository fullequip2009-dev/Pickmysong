// @ts-nocheck
// @deprecated — usar Supabase Auth. NextAuth se mantiene temporalmente; migrar y eliminar.
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
            name: dbUser.name || dbUser.email,
            image: dbUser.avatar,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.image,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'pickmysong-secret-key',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
