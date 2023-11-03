import { db } from '@/db'
import { activities } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function fetchActivites(athlete: string, limit = 20, offset = 0) {
    try {
        const data = await db.select()
            .from(activities)
            .where(eq(activities.athlete, athlete))
            .limit(limit)
            .offset(offset)
        return data
    } catch (error) {
        console.log(error)
    }
    return []
}
