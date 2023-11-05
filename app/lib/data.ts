import { db } from '@/db'
import { activities } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function fetchActivites(athlete: string, limit = 20, offset = 0) {
    try {
        const data = await db.select()
            .from(activities)
            .where(eq(activities.athlete, athlete))
            .orderBy(desc(activities.start_date))
            .limit(limit)
            .offset(offset)
        return data
    } catch (error) {
        console.log(error)
    }
    return []
}
