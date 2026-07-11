import { Pitch } from "../pitch";
/**
 * Helper class to parse LilyPond note names into Pitch vectors or vice versa
 */
export declare class LilyPond {
    /**
     * Create a Pitch vector from a LilyPond note name
     */
    static toPitch(str: string): Pitch;
    /**
     * Returns the (absolute) LilyPond name of a Pitch.
     * @throws if the Pitch's accidental goes beyond a double sharp/flat, or
     * its octave falls outside -3 to 11 (a healthy margin beyond the range
     * of human hearing). Neither is representable in real LilyPond input,
     * and both almost always indicate a logic error upstream.
     */
    static fromPitch(p: Pitch): string;
    static relative(start: Pitch): RelativeParser;
}
declare class RelativeParser {
    private previous;
    constructor(start: Pitch);
    toPitch(str: string): Pitch;
}
export {};
