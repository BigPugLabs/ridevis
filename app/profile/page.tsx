import { auth } from "@/auth"
import { countActivities, listActivities } from "@/lib/strava/api"
import { Suspense } from "react"

import { ActivityList } from "@/components/activityList"
import { revalidatePath } from "next/cache"
import { accounts } from "@/db/schema"
import { db } from "@/db"
import { eq } from "drizzle-orm"

async function Stats(props: { id: string | null}) {
    if (props.id) {
        const numActivities = await countActivities(props.id)
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

    const athleteAccountId = await db
        .select({ athlete: accounts.providerAccountId })
        .from(accounts)
        .where(eq(accounts.userId, session.user.id))

    const athlete = athleteAccountId[0].athlete || null
    //    TODO
    //    listActivities(session.user.id)

    if (session) {
        return (
            <>
                <div>Profile for {session.user.name}</div>
                <Suspense fallback={<div>loading...</div>}>
                    <Stats id={athlete} />
                </Suspense>
                <form action={updateActivities}>
                    <input type="hidden" name="id" value={session.user.id} />
                    <button type="submit">Refresh activities</button>
                </form>
                <ActivityList id={athlete} />
            </>
        )
    } else {
        return <div>Login first</div>
    }
}
