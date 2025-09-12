import { Pitch } from "../pitch";
export declare class SPN {
    /**
     * Create a Pitch vector from a Scientific Pitch Notation string.
     */
    static toPitch(spn: string): Pitch;
    /**
     * Returns the SPN name of a Pitch.
     */
    static fromPitch(p: Pitch): string;
}
