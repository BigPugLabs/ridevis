import { auth } from "@/auth"
import { SignIn, SignOut } from "@/components/auth"

export default async function Login() {
    const session = await auth()
    if (session) {
        return (
            <>
                <pre>{JSON.stringify(session, null, 2)}</pre>
                <SignOut>Sign out</SignOut>
            </>
        )
    } else {
        return <SignIn provider="strava">Sign in with Strava</SignIn>
    }
}
