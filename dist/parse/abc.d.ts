import { Pitch } from "../pitch";
/**
 * Helper class to parse ABC notation into Pitch vectors or vice versa.
 */
export declare class ABC {
    /**
     * Create a Pitch vector from an ABC note name.
     */
    static toPitch(str: string): Pitch;
    /**
     * Returns the ABC note name of a Pitch vector.
     * @throws if the Pitch's accidental goes beyond a double sharp/flat, or
     * its octave falls outside -3 to 11 (a healthy margin beyond the range
     * of human hearing). ABC notation has no provision for anything beyond
     * a double sharp/flat, and both almost always indicate a logic error
     * upstream.
     */
    static fromPitch(p: Pitch): string;
}
