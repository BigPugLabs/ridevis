import { db } from "@/db"
import { users } from "@/db/schema"

export default async function Login() {
    const data = await db.query.users.findMany()
    console.log(data)
    return (
        <>
            <h1>Login</h1>
            <ul>
                {data.map(e => {
                    return <li>{e}</li>
                })}
            </ul>
        </>
    )
}
