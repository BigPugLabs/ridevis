export interface SummaryActivity {
    id: string;
    external_id: string;
    upload_id: number;
    athlete: MetaAthlete;
    name: string;
    distance?: number;
    moving_time?: number;
    elapsed_time?: number;
    total_elevation_gain?: number;
    elev_high?: number;
    elev_low?: number;
    sport_type: string;
    start_date: string;
    start_date_local: string;
    timezone?: string;
    //utc_offset?: number;
    //location_city?: string;
    //location_state?: string;
    //location_country?: string;
    start_latlng: [number, number];
    end_latlng: [number, number];
    achievement_count?: number;
    kudos_count?: number;
    comment_count?: number;
    athlete_count?: number;
    photo_count?: number;
    total_photo_count?: number;
    map?: PolylineMap;
    trainer?: boolean;
    commute?: boolean;
    manual?: boolean;
    private?: boolean;
    flagged?: boolean;
    workout_type: number;
    upload_id_str: string;
    average_speed?: number;
    max_speed?: number;
    has_kudoed?: boolean;
    hide_from_home?: boolean;
    gear_id?: string;
    kilojoules: number;
    average_watts: number;
    device_watts: number;
    max_watts: number;
    weighted_average_watts: number;
    //description?: string;
    //calories?: number;
    //private_notes?: string;
}

export interface PolylineMap {
  id: string;
  polyline: string;
  summary_polyline: string;
}

export interface MetaAthlete {
    id: number;
    resource_state: number;
}
