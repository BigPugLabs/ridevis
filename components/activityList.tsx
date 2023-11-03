import { fetchActivites } from "@/app/lib/data"

export async function ActivityList(props: { id: string | null}) {
    const actList = props.id ? await fetchActivites(props.id) : []
    return (
        actList.length > 0 &&
        <ul>
            {actList.map(a => (
                <li key={a.id}>{a.name}</li>
            ))}
        </ul>
    )
}
