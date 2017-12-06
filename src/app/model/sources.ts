import {baseModel} from './base';

export class Source extends baseModel {
    url: string;
    hash: string;
    quality: string;
    seeds: number;
    peers: number;
    size: string;
    size_bytes: number;
    date_uploaded: string;
    date_uploaded_unix: number;
}

