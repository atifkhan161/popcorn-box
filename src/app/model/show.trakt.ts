import {baseModel, Ids, Airs, 
        Seasonposter, Hdtvlogo, Characterart, Seasonthumb, 
        Clearlogo, Hdclearart, Tvposter, Showbackground, 
        Tvthumb, Clearart, Tvbanner, Seasonbanner, Season} from './base';

export class Show {
    title: string;
    year: number;
    ids: Ids;
    overview: string;
    first_aired: Date;
    airs: Airs;
    runtime: number;
    certification: string;
    network: string;
    country: string;
    trailer: string;
    homepage: string;
    status: string;
    rating: number;
    votes: number;
    updated_at: Date;
    language: string;
    available_translations: string[];
    genres: string[];
    aired_episodes: number;
    name: string;
    thetvdb_id: string;
    seasonposter: Seasonposter[];
    hdtvlogo: Hdtvlogo[];
    characterart: Characterart[];
    seasonthumb: Seasonthumb[];
    clearlogo: Clearlogo[];
    hdclearart: Hdclearart[];
    tvposter: Tvposter[];
    showbackground: Showbackground[];
    tvthumb: Tvthumb[];
    clearart: Clearart[];
    tvbanner: Tvbanner[];
    seasonbanner: Seasonbanner[];
    seasons?: Season[];
    season?:number;
    episode?:number;
}