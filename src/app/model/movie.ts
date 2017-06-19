export class Movie {
    constructor (
        public imdb_id: string,
        public title: string,
        public year: string,
        public images?: Object,
        public synopsis?: string,
        public runtime?: string,
        public  released?: number,
        public trailer?: string,
        public certification?: string,
        public torrents?: Object,
        public genres?: Array<any>,
        public rating?: Rating
        ) {}
}
export interface Rating {
     percentage: number,
     stars?: number
}