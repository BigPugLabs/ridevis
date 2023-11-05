import { fetchActivites } from "@/app/lib/data"

export async function ActivityList(props: { athleteId: string | null}) {
    const actList = props.athleteId ? await fetchActivites(props.athleteId) : []
    return (
        actList.length > 0 &&
        <ul>
            {actList.map(a => (
                <li key={a.id}>{a.name}</li>
            ))}
        </ul>
    )
}
