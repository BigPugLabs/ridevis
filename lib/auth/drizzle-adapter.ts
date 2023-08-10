import { accounts, sessions, users, verificationTokens } from '@/db/schema'
import type { Adapter } from '@auth/core/adapters'
import { createId } from '@paralleldrive/cuid2'
import { and, eq } from 'drizzle-orm'
import type { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless'

export default function DrizzleAdaptor(db: PlanetScaleDatabase): Adapter {
    return {
        async createUser(userData) {
            await db.insert(users).values({
                id: createId(),
                email: userData.email,
                emailVerified: userData.emailVerified,
                name: userData.name,
                image: userData.image,
            })
            const rows = await db.select().from(users).where(eq(users.email, userData.email)).limit(1)
            const row = rows[0]
            if (!row) throw new Error("User not found")
            return row
        },
        async getUser(id) {
            const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
            return rows[0] ?? null
        },
        async getUserByEmail(email) {
            const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
            return rows[0] ?? null
        },
        async getUserByAccount({ providerAccountId, provider }) {
            const rows = await db.select()
                .from(users)
                .innerJoin(accounts, eq(users.id, accounts.userId))
                .where(and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider)))
                .limit(1)
            return rows[0].users ?? null
        },
        async updateUser({ id, ...userData }) {
            if (!id) throw new Error("User not found")
            await db.update(users).set(userData).where(eq(users.id, id))
            const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
            if (!rows[0]) throw new Error("User not found")
            return rows[0]
        },
        async deleteUser(userId) {
            await db.delete(users).where(eq(users.id, userId))
        },
        async linkAccount(account) {
            await db.insert(accounts).values({
                id: createId(),
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                userId: account.userId,
                access_token: account.access_token,
                expires_in: account.expires_in,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                // no longer required, but causes type errors! bug or depracated? 
                refresh_token_expires_in: account.refresh_token_expires_in as number,
                scope: account.scope,
                token_type: account.token_type
            })
        },
        async unlinkAccount({ providerAccountId, provider }) {
            await db.delete(accounts).where(and(eq(accounts.provider, provider), eq(accounts.providerAccountId, providerAccountId)))
        },
        async createSession({ sessionToken, userId, expires }) {
            await db.insert(sessions).values({
                id: createId(),
                expires: expires,
                sessionToken: sessionToken,
                userId: userId
            })
            const rows = await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken)).limit(1)
            if (!rows[0]) throw new Error("User session not created")
            return rows[0]
        },
        async getSessionAndUser(sessionToken) {
            const rows = await db.select({
                user: users,
                session: {
                    id: sessions.id,
                    userId: sessions.userId,
                    sessionToken: sessions.sessionToken,
                    expires: sessions.expires
                }
            }).from(sessions)
                .innerJoin(users, eq(users.id, sessions.userId))
                .where(eq(sessions.sessionToken, sessionToken))
                .limit(1)

            if (!rows[0]) return null
            const { user, session } = rows[0]
            return {
                user,
                session: {
                    id: session.id,
                    userId: session.userId,
                    sessionToken: session.sessionToken,
                    expires: session.expires
                }
            }
        },

        async updateSession(session) {
            db.update(sessions).set(session).where(eq(sessions.sessionToken, session.sessionToken))
            const rows = await db.select().from(sessions).where(eq(sessions.sessionToken, session.sessionToken)).limit(1)
            if (!rows[0]) throw new Error("Updating session failed")
            return rows[0]
        },
        async deleteSession(sessionToken) {
            await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
        },
        async createVerificationToken({ identifier, expires, token }) {
            await db.insert(verificationTokens).values({ expires, identifier, token })
            const rows = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token)).limit(1)
            if (!rows[0]) throw new Error("Unable to create verification token")
            return rows[0]
        },
        async useVerificationToken({ identifier, token }) {
            const rows = await db.select().from(verificationTokens)
                .where(and(eq(verificationTokens.token, token),
                    eq(verificationTokens.identifier, identifier)))
            if (!rows[0]) return null
            await db.delete(verificationTokens).where(and(eq(verificationTokens.token, token),
                eq(verificationTokens.identifier, identifier)))
            return rows[0]
        },
    }
}

