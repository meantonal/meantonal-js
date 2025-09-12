import { Interval } from "./interval";
import { Pitch } from "./pitch";
/**
 * An indeterminate vector type to be used with the Map1D and Map2D classes.
 * Can be converted to Pitch or Interval vectors as needed using its methods.
 */
export declare class MapVec {
    x: number;
    y: number;
    constructor(x: number, y: number);
    /**
     * Converts a MapVec into a Pitch vector.
     * Returns a new vector. Does not modify the MapVec.
     */
    toPitch(): Pitch;
    /**
     * Converts a MapVec into an Interval vector.
     * Returns a new vector. Does not modify the MapVec.
     */
    toInterval(): Interval;
}
/**
 * Represents a 1x2 matrix. Used to effect an arbitrary linear map from
 * 2d vectors down to 1d numbers.
 */
export declare class Map1D {
    private m0;
    private m1;
    constructor(m0: number, m1: number);
    /**
     * Multiplies the matrix with the passed in vector.
     * Returns a number.
     */
    map(v: MapVec | Pitch | Interval): number;
}
/**
 * Represents a 2x2 matrix. Used to effect an arbitrary basis change from one
 * coordinates system to another.
 */
export declare class Map2D {
    private m00;
    private m01;
    private m10;
    private m11;
    constructor(m00: number, m01: number, m10: number, m11: number);
    /**
     * Multiplies the matrix with the passed in vector.
     * Returns a MapVec.
     */
    map(v: MapVec | Pitch | Interval): MapVec;
}
/**
 * Represents a map onto a given tuning system. Specified in terms of the width
 * of its fifth, and the name and frequency of a reference pitch in Hz
 * (e.g. A = 440).
 * - Reference pitch is optional, defaults to C4 = 261.6255653Hz.
 */
export declare class TuningMap {
    private referencePitch;
    private referenceFreq;
    private centMap;
    constructor(fifth: number, referencePitch?: string, referenceFreq?: number);
    /**
     * Initialises an EDO tuning map by specifying the number of parts to
     * divide the octave into rather than the width of the fifth in cents.
     */
    static fromEDO(edo: number, referencePitch?: string, referenceFreq?: number): TuningMap;
    /**
     * Renders the width of an Interval in cents.
     */
    toCents(m: Interval): number;
    /**
     * Renders the ratio of an Interval vector as a decimal number.
     */
    toRatio(m: Interval): number;
    /**
     * Renders the frequency of a Pitch vector in Hertz.
     */
    toHz(p: Pitch): number;
}
