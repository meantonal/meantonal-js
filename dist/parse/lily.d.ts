import { Pitch } from "../pitch";
export declare class LilyPond {
    /**
     * Create a Pitch vector from a LilyPond note name
     */
    static toPitch(str: string): Pitch;
    /**
     * The LilyPond name of a Pitch.
     */
    static fromPitch(p: Pitch): string;
}
