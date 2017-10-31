import {baseModel} from './base';

export class Source extends baseModel {
    url: string;
    seed: number;
    peer: number;
    size: number;
    filesize: string;
    provider: string;
    quality: string;
}

