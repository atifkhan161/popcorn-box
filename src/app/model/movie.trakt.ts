import {baseModel, Ids} from './base';

export class Movie {
    title: string;
    year: number;
    ids: Ids;
    tagline: string;
    overview: string;
    released: string;
    runtime: number;
    trailer: string;
    homepage: string;
    rating: number;
    votes: number;
    updated_at: Date;
    language: string;
    available_translations: string[];
    genres: string[];
    certification: string;
}