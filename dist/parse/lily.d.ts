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
     */
    static fromPitch(p: Pitch): string;
}
