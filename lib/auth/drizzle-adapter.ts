import { accounts, users } from '@/db/schema'
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
                //refresh_token_expires_in: account.refresh_token_expires_in,
                scope: account.scope,
                token_type: account.token_type
            })
        },
        async unlinkAccount({ providerAccountId, provider }) {
            return
        },
        async createSession({ sessionToken, userId, expires }) {
            return
        },
        async getSessionAndUser(sessionToken) {
            return
        },
        async updateSession({ sessionToken }) {
            return
        },
        async deleteSession(sessionToken) {
            return
        },
        async createVerificationToken({ identifier, expires, token }) {
            return
        },
        async useVerificationToken({ identifier, token }) {
            return
        },
    }
}


