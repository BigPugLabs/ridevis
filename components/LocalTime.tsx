"use client"

import { Suspense, useEffect, useState } from "react"
// https://francoisbest.com/posts/2023/displaying-local-times-in-nextjs

function useHydration() {
    const [hydrated, setHydrated] = useState(false)
    useEffect(() => {
        setHydrated(true)
    }, [])
    return hydrated
}

export default function LocalTime({ date }: { date: Date | string | number | null }) {
    const hydrated = useHydration()
    date = date || Date.now()
    return (
        <Suspense key={hydrated ? "local" : "utc"}>
            <time dateTime={new Date(date).toISOString()}>
                {new Date(date).toLocaleString()}
                {hydrated ? "" : " (UTC)"}
            </time>
        </Suspense>
    )
}
