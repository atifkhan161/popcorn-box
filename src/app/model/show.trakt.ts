import {baseModel, Ids, Airs} from './base';

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
}