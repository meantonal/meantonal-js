/**
 * The Chroma class contains some static helper methods for extracting
 * information from "chroma", the signed distance of a Pitch from C or
 * an interval from the unison in perfect 5ths.
 */
export declare class Chroma {
    /**
     * Returns the letter component of the pitch class name represented
     * by a given Pitch chroma.
     */
    static toLetter(chroma: number): string;
    /**
     * Returns the accidental component of the pitch class name represented
     * by a given Pitch chroma.
     * - 0 is natural.
     * - +1 / -1 is sharp/flat.
     * - +2 / -2 is double sharp/double flat.
     * etc. for arbitrarily remote accidentals.
     */
    static toAccidental(chroma: number): number;
}
