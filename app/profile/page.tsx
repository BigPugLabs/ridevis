import { auth } from "@/auth"
import { countActivities, listActivities } from "@/lib/strava/api"
import { Suspense } from "react"

import { ActivityList } from "@/components/activityList"
import { revalidatePath } from "next/cache"
import { accounts, users } from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"

async function Stats(props: { athleteId: string | null }) {
    if (props.athleteId) {
        const numActivities = await countActivities(props.athleteId)
        return <div>{numActivities}</div>
    }
    return <div>Unknown</div>
}

async function updateActivities(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    if (id) {
        await listActivities(id)
        revalidatePath("/profile")
    }
}

export default async function Profile() {

    const session = await auth()

    if (session?.user?.email) {
        const athleteAccountId = await db
            .select({ athlete: accounts.providerAccountId })
            .from(accounts)
            .where(eq(accounts.userId, users.id))
            .innerJoin(users, eq(users.email, session.user.email))

        const athlete = athleteAccountId[0].athlete || null

        return (
            <>
                <div>Profile for {session.user.name}</div>
                <Suspense fallback={<div>loading...</div>}>
                    <Stats athleteId={athlete} />
                </Suspense>
                <form action={updateActivities}>
                    <input type="hidden" name="id" value={session.user.id} />
                    <button type="submit">Refresh activities</button>
                </form>
                <Suspense fallback={<div>loading...</div>}>
                    <ActivityList athleteId={athlete} />
                </Suspense>
            </>
        )
    } else {
        return <div>Login first</div>
    }
}
