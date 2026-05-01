// src/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// definieer de configuratie
const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

// roep NextAuth() aan en exporteer de geretourneerde helpers
export const { auth, handlers, signIn, signOut } = NextAuth(config)
