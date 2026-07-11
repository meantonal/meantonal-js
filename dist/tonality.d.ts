import { Pitch } from "./pitch";
/**
 * The TonalContext class stores information about the currently governing
 * key or mode.
 * - It is used with various methods to query or transform the position of
 *   Pitch vectors within a key or mode.
 * - Created from the "chroma" of the tonic scale degree (it's signed distance
 *   from C in perfect fifths), and the mode, numbered in ascending 5ths from
 *   Lydian = 0.
 * - Can also be created from strings with TonalContext.fromStrings()
 */
export declare class TonalContext {
    tonic: {
        letter: string;
        accidental: number;
        chroma: number;
    };
    mode: number;
    private chromaOffset;
    constructor(chroma: number, mode: number);
    private static ACCIDENTAL_MAP;
    /**
     * Create a TonalContext using two strings for the tonic note name
     * and the mode.
     * - e.g. TonalContext.fromStrings("C#", "Dorian")
     */
    static fromStrings(tonic: string, mode: string): TonalContext;
    /**
     * Returns the scale degree (0-indexed) of the passed in Pitch vector in
     * the current context.
     */
    degreeNumber(p: Pitch): number;
    /**
     * Returns the scale degree alteration represented by a Pitch in the
     * current TonalContext, e.g. C# is a raised note in the key of C major.
     * 0 represents a diatonic Pitch.
     * +1 / -1 represent a Pitch raised/lowered with accidentals.
     * +2 / -2 represent Pitches too remote to belong in a given TonalContext.
     */
    degreeAlteration(p: Pitch): number;
    /**
     * Returns the chroma (signed distance in perfect 5ths from C) of the
     * diatonic variant of the passed in scale degree (0-indexed so the tonic
     * is 0).
     */
    degreeChroma(degree: number): number;
    /**
     * Snaps a Pitch vector to the diatonic position for that letter-name in
     * the current TonalContext.
     * - e.g. in D major, F4 would "snap" to F#4.
     */
    snapDiatonic(p: Pitch): Pitch;
}
