import { InferModel, sql } from 'drizzle-orm'
import { bigint, boolean, datetime, double, float, index, int, mysqlTableCreator, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

const mysqlTable = mysqlTableCreator((name) => `rideviz_${name}`)

export const users = mysqlTable('users', {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }),
    email: varchar('email', { length: 191 }).notNull(),
    emailVerified: timestamp('emailVerified'),
    image: varchar('image', { length: 191 }),
    created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow()
},
    user => ({ emailIndex: uniqueIndex('users__email__idx').on(user.email) })
)

export const accounts = mysqlTable('accounts', {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    userId: varchar('userId', { length: 191 }).notNull(),
    type: varchar('type', { length: 191 }).notNull(),
    provider: varchar('provider', { length: 191 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 191 }).notNull(),
    access_token: text('access_token').notNull(),
    expires_in: int('expires_in'),
    id_token: text('id_token'),
    refresh_token: text('refresh_token').notNull(),
    refresh_token_expires_in: int('refresh_token_expires_in'),
    scope: varchar('scope', { length: 191 }),
    token_type: varchar('token_type', { length: 191 }),
    created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow()
},
    account => ({
        providerProviderAccountIdIndex: uniqueIndex('accounts__provider__providerAccountId__idx').on(account.provider, account.providerAccountId),
        userIdIndex: index('accounts__userId__idx').on(account.userId)
    })
)

export const sessions = mysqlTable('sessions', {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar('sessionToken', { length: 191 }).notNull(),
    userId: varchar('userId', { length: 191 }).notNull(),
    expires: datetime('expires').notNull(),
    created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow()
},
    session => ({
        sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(session.sessionToken),
        userIdIndex: index('sessions__userId__idx').on(session.userId)
    })
)

export const verificationTokens = mysqlTable('verification_tokens', {
    identifier: varchar('identifier', { length: 191 }).primaryKey().notNull(),
    token: varchar('token', { length: 191 }).notNull(),
    expires: datetime('expires').notNull(),
    created_at: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow()
},
    verificationToken => ({
        tokenIndex: uniqueIndex('verification_tokens__token__idx').on(verificationToken.token)
    })
)

export const activities = mysqlTable('activities', {
    id: bigint('id', { mode: "number" }).primaryKey().notNull(),
    external_id: varchar('external_id', { length: 191 }),
    upload_id: bigint('upload_id', { mode: "number" }).notNull(),
    athlete: varchar('athlete', { length: 191 }).notNull(),
    name: varchar('name', { length: 191 }),
    distance: float('distance'),
    moving_time: int('moving_time'),
    elapsed_time: int('elapsed_time'),
    total_elevation_gain: float('total_elevation_gain'),
    elev_high: float('elev_high'),
    elev_low: float('elev_low'),
    sport_type: varchar('sport_type', { length: 191 }),
    start_date: datetime('start_date'),
    start_date_local: datetime('start_date_local'),
    timezone: varchar('timezone', { length: 191 }),
    start_lat: float('start_lat'),
    start_lng: float('start_lng'),
    end_lat: float('end_lat'),
    end_lng: float('end_lng'),
    achievement_count: int('achievement_count'),
    kudos_count: int('kudos_count'),
    comment_count: int('comment_count'),
    athlete_count: int('athlete_count'),
    photo_count: int('photo_count'),
    total_photo_count: int('total_photo_count'),
    map_id: varchar('map_id', { length: 191 }),
    trainer: boolean('trainer'),
    commute: boolean('commute'),
    manual: boolean('manual'),
    private: boolean('private'),
    flagged: boolean('flagged'),
    workout_type: int('workout_type'),
    upload_id_str: varchar('upload_id_str', { length: 191 }),
    average_speed: float('average_speed'),
    max_speed: float('max_speed'),
    kilojoules: float('kilojoules'),
    average_watts: float('average_watts'),
    description: text('description'),
    calories: float('calories'),
    embed_token: varchar('embed_token', { length: 191 })
},
    activity => ({
        athleteIdIndex: index('activity__athleteId__idx').on(activity.athlete)
    })
)


export const activityStats = mysqlTable('activity_stats', {
    athlete: varchar('athlete', { length: 191 }).primaryKey().notNull(),
    biggest_ride_distance: double('biggest_ride_distance'),
    biggest_climb_elevation_gain: double('biggest_climb_elevation_gain'),
    recent_ride_count: int('recent_ride_count'),
    recent_ride_distance: float('recent_ride_distance'),
    recent_ride_moving_time: int('recent_ride_moving_time'),
    recent_ride_elapsed_time: int('recent_ride_elapsed_time'),
    recent_ride_elevation_gain: float('recent_ride_elevation_gain'),
    recent_ride_achievement_count: int('recent_ride_achievement_count'),
    recent_run_count: int('recent_run_count'),
    recent_run_distance: float('recent_run_distance'),
    recent_run_moving_time: int('recent_run_moving_time'),
    recent_run_elapsed_time: int('recent_run_elapsed_time'),
    recent_run_elevation_gain: float('recent_run_elevation_gain'),
    recent_run_achievement_count: int('recent_run_achievement_count'),
    recent_swim_count: int('recent_swim_count'),
    recent_swim_distance: float('recent_swim_distance'),
    recent_swim_moving_time: int('recent_swim_moving_time'),
    recent_swim_elapsed_time: int('recent_swim_elapsed_time'),
    recent_swim_elevation_gain: float('recent_swim_elevation_gain'),
    recent_swim_achievement_count: int('recent_swim_achievement_count'),
    ytd_ride_count: int('ytd_ride_count'),
    ytd_ride_distance: float('ytd_ride_distance'),
    ytd_ride_moving_time: int('ytd_ride_moving_time'),
    ytd_ride_elapsed_time: int('ytd_ride_elapsed_time'),
    ytd_ride_elevation_gain: float('ytd_ride_elevation_gain'),
    ytd_ride_achievement_count: int('ytd_ride_achievement_count'),
    ytd_run_count: int('ytd_run_count'),
    ytd_run_distance: float('ytd_run_distance'),
    ytd_run_moving_time: int('ytd_run_moving_time'),
    ytd_run_elapsed_time: int('ytd_run_elapsed_time'),
    ytd_run_elevation_gain: float('ytd_run_elevation_gain'),
    ytd_run_achievement_count: int('ytd_run_achievement_count'),
    ytd_swim_count: int('ytd_swim_count'),
    ytd_swim_distance: float('ytd_swim_distance'),
    ytd_swim_moving_time: int('ytd_swim_moving_time'),
    ytd_swim_elapsed_time: int('ytd_swim_elapsed_time'),
    ytd_swim_elevation_gain: float('ytd_swim_elevation_gain'),
    ytd_swim_achievement_count: int('ytd_swim_achievement_count'),
    all_ride_count: int('all_ride_count'),
    all_ride_distance: float('all_ride_distance'),
    all_ride_moving_time: int('all_ride_moving_time'),
    all_ride_elapsed_time: int('all_ride_elapsed_time'),
    all_ride_elevation_gain: float('all_ride_elevation_gain'),
    all_ride_achievement_count: int('all_ride_achievement_count'),
    all_run_count: int('all_run_count'),
    all_run_distance: float('all_run_distance'),
    all_run_moving_time: int('all_run_moving_time'),
    all_run_elapsed_time: int('all_run_elapsed_time'),
    all_run_elevation_gain: float('all_run_elevation_gain'),
    all_run_achievement_count: int('all_run_achievement_count'),
    all_swim_count: int('all_swim_count'),
    all_swim_distance: float('all_swim_distance'),
    all_swim_moving_time: int('all_swim_moving_time'),
    all_swim_elapsed_time: int('all_swim_elapsed_time'),
    all_swim_elevation_gain: float('all_swim_elevation_gain'),
    all_swim_achievement_count: int('all_swim_achievement_count'),
},
    activityStats => ({
        athleteIdIndex: index('activity_stats__athleteId__idx').on(activityStats.athlete)
    })
)

export type Account = InferModel<typeof accounts>
export type Sessions = InferModel<typeof sessions>
export type User = InferModel<typeof users>
export type VerificationToken = InferModel<typeof verificationTokens>
export type Activity = InferModel<typeof activities>
export type ActivityStats = InferModel<typeof activityStats>

