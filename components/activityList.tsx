import { fetchActivites } from "@/app/lib/data"
import Link from "next/link"
import LocalTime from "./LocalTime"

export async function ActivityList(props: { athleteId: string | null }) {
    const actList = props.athleteId ? await fetchActivites(props.athleteId) : []
    return (
        actList.length > 0 &&
        <ul>
            {actList.map(a => (
                <li key={a.id}>
                    <Link href={"../activity/" + a.id}>
                        <span>{a.name} - </span>
                        <LocalTime date={a.start_date} />
                    </Link>
                </li>
            ))}
        </ul>
    )
}
