import { Pitch } from "../pitch";
export declare class Helmholtz {
    /**
     * Create a Pitch vector from a Helmholtz note name.
     */
    static toPitch(str: string): Pitch;
    /**
     * The Helmholtz name of a Pitch.
     */
    static fromPitch(p: Pitch): string;
}
