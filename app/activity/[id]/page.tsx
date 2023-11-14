import LocalTime from "@/components/LocalTime"
import { db } from "@/db"
import { accounts, activities, users } from "@/db/schema"
import { eq, getTableColumns } from "drizzle-orm"
import { Suspense } from "react"

async function Details({ id }: { id: string }) {

    const activityWithUser = await db
        .select({ ...getTableColumns(activities), userName: users.name })
        .from(activities).where(eq(activities.id, Number(id))).limit(1)
        .leftJoin(accounts, eq(activities.athlete, accounts.providerAccountId))
        .leftJoin(users, eq(users.id, accounts.userId))

    if (activityWithUser.length == 0) {
        return <div>Activity not found</div>
    }
    const detail = activityWithUser[0]

    return (
        <>
            <div className="pb-4 flex justify-between">
                <h2 className="">{detail.name}</h2>
                <div>{detail.userName}</div>
            </div>
            <div className="py-4 flex justify-between">
                <div>Date: <LocalTime date={detail.start_date} /></div>
                <div>Avg speed: {((detail.average_speed || 0) * 3.6).toFixed(1)} km/h</div>
                <div>Distance: {((detail.distance || 0) / 1000).toFixed(2)} km</div>
            </div>
            <div>Map id {detail.map_id}</div>
            <ul>
                {[...Object.entries(detail)].map(([key, val]) => {
                    return <li key={key}>{key} : {(val || "").toString()}</li>
                })}
            </ul>
        </>
    )
}


export default function Page({ params }: { params: { id: string } }) {
    return (
        <div className="p-4">
            <Suspense fallback={<div>loading...</div>}>
                <Details id={params.id} />
            </Suspense>
        </div>
    )
}
