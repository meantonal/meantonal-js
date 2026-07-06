import { Pitch } from "../pitch";
/**
 * Helper class to parse Scientific Pitch Notation to Pitch vectors or vice
 * versa.
 */
export declare class SPN {
    /**
     * Create a Pitch vector from a Scientific Pitch Notation string.
     */
    static toPitch(spn: string): Pitch;
    /**
     * Returns the SPN name of a Pitch.
     * @throws if the Pitch's accidental is altered by more than 8 sharps/flats,
     * which is chosen as an arbitrary limit simply to avoid handling strings of
     * unbounded size, and because it almost always indicates a logic error upstream.
     */
    static fromPitch(p: Pitch): string;
}
