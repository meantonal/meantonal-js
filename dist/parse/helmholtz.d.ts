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
     */
    static fromPitch(p: Pitch): string;
}
