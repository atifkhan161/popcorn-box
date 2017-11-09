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
    imdb: string;
    tmdb: number;
}

export interface Airs {
    day: string;
    time: string;
    timezone: string;
}