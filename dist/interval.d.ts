import { Pitch } from "./pitch";
/**
 * An Interval is a distance between two Pitch vectors.
 * It can be constructed directly as some number of whole/half steps,
 * or via a standard interval name string: Interval.fromName("P5").
 * It is also frequently constructed from two Pitch vectors via
 * Interval.between(p, q) or p.intervalTo(q).
 */
export declare class Interval {
    w: number;
    h: number;
    constructor(w: number, h: number);
    static fromName(name: string): Interval;
    /**
     * Create an Interval from two pitch names as SPN strings.
     * - e.g. Pitch.fromSPN("C4", "E4"); // produces a major 3rd.
     */
    static fromSPN(ps: string, qs: string): Interval;
    /**
     * Create an Interval from two passed-in Pitch vectors.
     */
    static between(p: Pitch, q: Pitch): Interval;
    /**
     * The "chroma" of an Interval is its signed distance from the unison
     * in perfect 5ths.
     */
    get chroma(): number;
    /**
     * The quality of an Interval as a signed number:
     * - 0 is perfect.
     * - +1 / -1 are major and minor respectively.
     * - +2 / -2 are augmented and diminished respectively.
     * etc. for arbitrarily remote Interval qualities.
     */
    get quality(): number;
    /**
     * The "stepspan" of an Interval: the number of diatonic steps it contains,
     * where 0 is the unison, 1 is a generic second and so on.
     */
    get stepspan(): number;
    /**
     * The 0-indexed 7-tone pitch class of an Interval. Essentially its size
     * in steps, modulo 7.
     */
    get pc7(): number;
    /**
     * The 12-tone pitch class of an Interval familiar to post-tonal theory.
     */
    get pc12(): number;
    /**
     * The standard name for an interval.
     */
    get name(): string;
    /**
     * Returns true if two Interval vectors are identical.
     * Note this will NOT return true for notes that are merely enharmonic in
     * 12TET (use the "isEnharmonic" method for that).
     */
    isEqual(m: Interval): boolean;
    /**
     * Returns true if two Intervals are enharmonic in the specified EDO tuning.
     * If no tuning is specified, defaults to 12TET.
     * If you don't know what this means just leave the second argument blank.
     */
    isEnharmonic(m: Interval, edo?: number): boolean;
    /**
     * The flipped version of an interval.
     * An ascending major 3rd will become a descending major 3rd.
     * Or for vertical intervals, voices will exchange places.
     */
    get negative(): Interval;
    add(m: Interval): Interval;
    subtract(m: Interval): Interval;
    /**
     * The simple (i.e. non-compound / smaller than an octave) version of
     * an Interval vector. For simple intervals this will simply be the
     * same vector.
     */
    get simple(): Interval;
}
