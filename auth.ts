import { DrizzleAdapter } from '@/lib/auth/drizzle-adapter'
import { db } from '@/db'
import NextAuth, { DefaultSession } from "next-auth";
import Strava from 'next-auth/providers/strava'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
        } & DefaultSession['user']
    }
}

export const { handlers: { GET, POST }, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [Strava({
        clientId: process.env.STRAVA_ID as string,
        clientSecret: process.env.STRAVA_SECRET as string
    })],
    session: {
        strategy: "database"
    }
})

// import { auth } from this file for a useful function
