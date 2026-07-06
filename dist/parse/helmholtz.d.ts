import { Pitch } from "../pitch";
/**
 * Helper class to parse Helmholtz pitch names into Pitch vectors or vice
 * versa.
 */
export declare class Helmholtz {
    /**
     * Create a Pitch vector from a Helmholtz note name.
     */
    static toPitch(str: string): Pitch;
    /**
     * Returns the Helmholtz note name of a Pitch.
     * @throws if the Pitch's accidental is more than 8 sharps/flats away
     * from a natural, or its octave falls outside -3 to 11 (a healthy
     * margin beyond the range of human hearing). Both almost always
     * indicate a logic error upstream.
     */
    static fromPitch(p: Pitch): string;
}
