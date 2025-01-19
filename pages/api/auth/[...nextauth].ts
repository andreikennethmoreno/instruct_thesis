import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../lib/prisma"; // Adjust path if necessary
import bcrypt from "bcryptjs"; // Import bcrypt

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        // Check if user exists and compare hashed passwords
        if (user && credentials?.password && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.user_id.toString(), email: user.email, role: user.role };
        }

        return null; // Return null if authentication fails
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirect to the login page
  },
  session: {
    strategy: "jwt" as const, // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; // Store the user's role in the JWT
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role; // Attach the role to the session
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);