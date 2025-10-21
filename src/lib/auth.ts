import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise, { getDatabase } from "./mongodb";
import bcrypt from "bcryptjs";

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET is required in production");
}

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "development"
      ? "development-secret-key"
      : undefined),
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        emailAsOtherUser: { label: "Email as Other User", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await getDatabase();
        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if this is an impersonation request
        const emailAsOtherUser = credentials.emailAsOtherUser;
        if (emailAsOtherUser && user.role === "customer_success") {
          const targetUser = await db.collection("users").findOne({
            email: emailAsOtherUser,
          });

          if (targetUser) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              impersonatedUserId: targetUser._id.toString(),
              isImpersonating: true,
            };
          }
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.impersonatedUserId = user.impersonatedUserId;
        token.isImpersonating = user.isImpersonating;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.impersonatedUserId = token.impersonatedUserId as string;
        session.user.isImpersonating = token.isImpersonating as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
