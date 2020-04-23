export interface Tags{
    [key:string]: string;
}
export type TimeLabel = [number,number,number];
export type LyricLine = {
    time: TimeLabel;
    text: string;
}

/**
 * Represents the lyric object.
 */
export interface LyricObject{
    tags: Tags;
    lyrics: LyricLine[];
}