import NextAuth, { type Session, type User } from "next-auth";
import Google from "next-auth/providers/google";
import supabase from "./supabase";

// ===========================================
// User helpers (Supabase)
// TODO: Update table/column names to match your Supabase schema
// ===========================================

async function getUser(email: string) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

async function createUser(newUser: Record<string, unknown>) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("users").insert([newUser]);
  if (error) throw new Error("User could not be created");
  return data;
}

// ===========================================
// NextAuth Configuration
// TODO: Add more providers as needed (GitHub, Discord, etc.)
// Docs: https://authjs.dev/getting-started/providers
// ===========================================

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // TODO: Add more providers here
    // GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET }),
  ],
  callbacks: {
    authorized({ auth }: { auth: Session | null }) {
      return !!auth?.user;
    },

    async signIn({ user }: { user: User }) {
      try {
        if (!user.email) return false;

        const existingUser = await getUser(user.email);

        if (!existingUser) {
          await createUser({
            email: user.email,
            full_name: user.name,
          });
        }

        return true;
      } catch {
        return false;
      }
    },

    async session({ session }: { session: Session }) {
      if (!session.user?.email) return session;

      const dbUser = await getUser(session.user.email);
      if (dbUser) {
        session.user.id = dbUser.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
