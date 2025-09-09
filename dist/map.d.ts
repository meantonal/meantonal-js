import { Interval } from "./interval";
import { Pitch } from "./pitch";
/**
 * An indeterminate vector type to be used with the Map1d and Map2d classes.
 * Can be converted to Pitch or Interval vectors as needed using its methods.
 */
export declare class MapVec {
    w: number;
    h: number;
    constructor(w: number, h: number);
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
export declare class Map1d {
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
export declare class Map2d {
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
