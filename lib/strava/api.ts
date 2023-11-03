import type { SummaryActivity } from "./interfaces"
import { db } from "@/db";
import { accounts, activities } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function countActivities(id: string) {
    const numActivities = await db.select({ count: sql<number>`count(*)` })
        .from(activities)
        .where(eq(activities.athlete, id))

    return numActivities[0].count
}

async function refreshToken(id: string, refreshToken: string) {

    const newTokenPayload = await fetch("https://www.strava.com/api/v3/oauth/token", {
        body: `client_id=${process.env.STRAVA_ID}&client_secret=${process.env.STRAVA_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
    const newTokens = await newTokenPayload.json()

    if (!newTokens?.access_token) {
        //throw new Error("Unable to refresh token")
        console.log("Unable to refresh token")
    }
    // [potential race condition] should this be awaited?
    // a second api call might happen before this completes
    await db.update(accounts)
        .set({ access_token: newTokens.access_token })
        .where(eq(accounts.userId, id))

    return newTokens.access_Token
}

export async function checkSyncNeeded(id: string) {

    // select access_token from accounts
    // and most recent start date from activities
    const latestActivity = await db.select().from(activities)
}

export async function listActivities(id: string) {
    const tokenResult = await db
        .select({
            accessToken: accounts.access_token,
            refreshToken: accounts.refresh_token
        })
        .from(accounts)
        .where(eq(accounts.userId, id))
    if (tokenResult.length < 1) {
        throw new Error("No tokens")
    }
    let accessToken = tokenResult[0].accessToken

    let payload = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30",
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken
            }
        })
    let response = await payload.json()

    if (response.errors) {
        // refresh token and try again
        accessToken = await refreshToken(id, tokenResult[0].refreshToken)

        payload = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30",
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            })
        response = await payload.json()
    }

    const values = response.map((a: SummaryActivity) => ({
        id: a.id,
        external_id: a.external_id,
        upload_id: a.upload_id,
        athlete: a.athlete.id,
        name: a.name,
        distance: a.distance,
        moving_time: a.moving_time,
        elapsed_time: a.elapsed_time,
        total_elevation_gain: a.total_elevation_gain,
        elev_high: a.elev_high,
        elev_low: a.elev_low,
        sport_type: a.sport_type,
        start_date: a.start_date.slice(0,-1),
        start_date_local: a.start_date_local.slice(0,-1),
        timezone: a.timezone,
        start_lat: a.start_latlng[0],
        start_lng: a.start_latlng[1],
        end_lat: a.end_latlng[0],
        end_lng: a.end_latlng[1],
        achievement_count: a.achievement_count,
        kudos_count: a.kudos_count,
        comment_count: a.comment_count,
        athlete_count: a.athlete_count,
        photo_count: a.photo_count,
        total_photo_count: a.total_photo_count,
        map_id: a.map?.id,
        trainer: a.trainer,
        commute: a.commute,
        manual: a.manual,
        private: a.private,
        flagged: a.flagged,
        workout_type: a.workout_type,
        upload_id_str: a.upload_id_str,
        average_speed: a.average_speed,
        max_speed: a.max_speed,
        kilojoules: a.kilojoules,
        average_watts: a.average_watts,
        description: "",
        calories: 0.0,
        embed_token: "",
    }))

    await db.insert(activities).values(values)
}
