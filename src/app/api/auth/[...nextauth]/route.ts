import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from "crypto"

// Functie om wachtwoord te hashen (moet overeenkomen met hoe je het origineel deed)
function hashPassword(password: string): string {
	return crypto.createHash('sha256').update(password).digest('base64')
}

const handler = NextAuth({
	providers: [
		// Tijdelijk uitgeschakeld - Google OAuth werkt niet op localhost
		// GoogleProvider({
		// 	clientId: process.env.GOOGLE_CLIENT_ID!,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		// }),
		CredentialsProvider({
			name: "Admin Login",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					return null
				}

				const username = credentials.username as string
				const password = credentials.password as string

				// Check admin credentials
				if (
					username === process.env.ADMIN_USERNAME &&
					hashPassword(password) === process.env.HASHED_ADMIN_PASSWORD
				) {
					return {
						id: "admin",
						name: "Admin",
						email: "admin@webnews.local"
					}
				}

				return null
			}
		})
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/auth/signin', // Optioneel: custom login page
	}
})

export { handler as GET, handler as POST }