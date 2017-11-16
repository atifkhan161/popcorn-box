export class baseModel {
    fillFromJSON(jsonObj: any) {
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName]
        }
    }
}

export interface Ids {
    trakt: number;
    slug: string;
    imdb?: string;
    tmdb?: number; 
    tvrage?: number;
}

export interface Airs {
    day: string;
    time: string;
    timezone: string;
}
export interface Seasonposter {
    id: string;
    url: string;
    lang: string;
    likes: string;
    season: string;
}

export interface Hdtvlogo {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Characterart {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Seasonthumb {
    id: string;
    url: string;
    lang: string;
    likes: string;
    season: string;
}

export interface Clearlogo {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Hdclearart {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Tvposter {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Showbackground {
    id: string;
    url: string;
    lang: string;
    likes: string;
    season: string;
}

export interface Tvthumb {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Clearart {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Tvbanner {
    id: string;
    url: string;
    lang: string;
    likes: string;
}

export interface Seasonbanner {
    id: string;
    url: string;
    lang: string;
    likes: string;
    season: string;
}
export interface Episode {
    season: number;
    number: number;
    title: string;
    ids: Ids;
}

export interface Season {
    number: number;
    ids: Ids;
    episodes: Episode[];
}