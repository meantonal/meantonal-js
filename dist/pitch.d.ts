import { Interval } from "./interval";
import { TonalContext } from "./tonality";
/**
 * The Pitch class is the most fundamental type in Meantonal.
 * - Can be constructed from some number of whole steps and half steps from C-1
 *   (the lowest MIDI note).
 * - Can also be constructed using static methods like Pitch.fromSPN().
 */
export declare class Pitch {
    w: number;
    h: number;
    constructor(w: number, h: number);
    /**
     * Create a Pitch vector from a Scientific Pitch Notation string.
     */
    static fromSPN(spn: string): Pitch;
    /**
     * Create a Pitch vector from a chroma value (the signed distance of a note
     * name from "C" in perfect fifths), and an octave number (in SPN numbering).
     */
    static fromChroma(chroma: number, octave: number): Pitch;
    /**
     * Returns the standard MIDI number for a Pitch.
     * Throws if outside of the standard MIDI range 0 <= x <128
     */
    get midi(): number;
    /**
     * The signed distance of a Pitch from "C" in perfect 5ths.
     */
    get chroma(): number;
    /**
     * The 0-indexed 7-tone pitch class of a Pitch. Equivalent to a numerical
     * representation of its letter name. C is 0.
     */
    get pc7(): number;
    /**
     * The 12-tone pitch class of a Pitch. C is 0.
     */
    get pc12(): number;
    /**
     * The letter component of a Pitch as a string, e.g. Db4 -> "D".
     */
    get letter(): string;
    /**
     * The accidental component of a Pitch as a number:
     * - Natural notes return 0.
     * - Sharp notes return 1.
     * - Flat notes return -1.
     * - Double sharps and double flats return 2 and -2.
     * etc. for arbitrary accidentals.
     */
    get accidental(): number;
    /**
     * The octave number of a Pitch (in SPN numbering).
     */
    get octave(): number;
    /**
     * The SPN name of a Pitch.
     */
    get SPN(): string;
    /**
     * Returns true if two Pitch vectors are identical.
     * Note this will NOT return true for notes that are merely enharmonic in
     * 12TET (use the "isEnharmonic" method for that).
     */
    isEqual(p: Pitch): boolean;
    /**
     * Returns true if two notes are enharmonic in the specified EDO tuning.
     * If no tuning is specified, defaults to 12TET.
     * If you don't know what this means just leave the second argument blank.
     */
    isEnharmonic(p: Pitch, edo?: number): boolean;
    /**
     * Returns the interval from the current Pitch to another passed-in vector.
     */
    intervalTo(p: Pitch): Interval;
    /**
     * Transpose a Pitch vector by the passed in Interval vector.
     * Pitch.transposeReal returns the transposed Pitch as a new vector.
     * It does not modify the original Pitch.
     */
    transposeReal(m: Interval): Pitch;
    /**
     * Invert a Pitch vector about the passed in axis.
     * An Axis is created from two Pitches, either directly or via
     * Axis.fromSPN() using two SPN strings.
     * Pitch.invert returns the inverted Pitch as a new vector.
     * It does not modify the original Pitch.
     */
    invert(axis: Axis): Pitch;
    /**
     * Returns the scale degree number represented by a Pitch in the passed-in
     * TonalContext.
     * Note that this number is 0-indexed. 0 is the tonic of a key or mode.
     */
    degreeIn(context: TonalContext): number;
    /**
     * Returns the scale degree alteration represented by a Pitch in the
     * passed-in TonalContext, e.g. C# is a raised note in the key of C major.
     * 0 represents a diatonic Pitch in the TonalContext.
     * +1 / -1 represent a raised or lowered Pitch in the TonalContext.
     * +2 / -2 represent Pitches too remote to belong in a given TonalContext.
     */
    alterationIn(context: TonalContext): number;
    /**
     * Snaps a Pitch vector to the diatonic position for that letter-name in
     * the passed-in TonalContext.
     */
    snapTo(context: TonalContext): Pitch;
    /**
     * Transpose a Pitch vector by a generic interval specified as a simple
     * number, snapping to diatonic values.
     * - Measured in steps, such that 0 is a unison.
     */
    transposeDiatonic(steps: number, context: TonalContext): Pitch;
}
/**
 * The Axis class is used to invert pitches about a fixed point.
 * It can be defined by two Pitch vectors that will invert to each other.
 */
export declare class Axis {
    w: number;
    h: number;
    constructor(p: Pitch, q: Pitch);
    /**
     * Create an Axis from two SPN strings specifying notes.
     * e.g. Axis.fromSPN("C4", "G4");
     */
    static fromSPN(ps: string, qs: string): Axis;
}
