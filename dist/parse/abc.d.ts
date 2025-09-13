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
     */
    static fromPitch(p: Pitch): string;
}
