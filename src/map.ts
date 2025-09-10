import { Interval } from "./interval";
import { Pitch } from "./pitch";

/**
 * An indeterminate vector type to be used with the Map1d and Map2d classes.
 * Can be converted to Pitch or Interval vectors as needed using its methods.
 */
export class MapVec {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Converts a MapVec into a Pitch vector.
     * Returns a new vector. Does not modify the MapVec.
     */
    public toPitch() {
        return new Pitch(this.x, this.y);
    }

    /**
     * Converts a MapVec into an Interval vector.
     * Returns a new vector. Does not modify the MapVec.
     */
    public toInterval() {
        return new Interval(this.x, this.y);
    }
}

/**
 * Represents a 1x2 matrix. Used to effect an arbitrary linear map from
 * 2d vectors down to 1d numbers.
 */
export class Map1d {
    private m0: number;
    private m1: number;

    constructor(m0: number, m1: number) {
        this.m0 = m0;
        this.m1 = m1;
    }

    /**
     * Multiplies the matrix with the passed in vector.
     * Returns a number.
     */
    public map(v: MapVec | Pitch | Interval): number {
        if (v instanceof MapVec) return this.m0 * v.x + this.m1 * v.y;
        return this.m0 * v.w + this.m1 * v.h;
    }
}

/**
 * Represents a 2x2 matrix. Used to effect an arbitrary basis change from one
 * coordinates system to another.
 */
export class Map2d {
    private m00: number;
    private m01: number;
    private m10: number;
    private m11: number;

    constructor(m00: number, m01: number, m10: number, m11: number) {
        this.m00 = m00;
        this.m01 = m01;
        this.m10 = m10;
        this.m11 = m11;
    }

    /**
     * Multiplies the matrix with the passed in vector.
     * Returns a MapVec.
     */
    public map(v: MapVec | Pitch | Interval): MapVec {
        if (v instanceof MapVec)
            return new MapVec(
                this.m00 * v.x + this.m01 * v.y,
                this.m10 * v.x + this.m11 * v.y,
            );

        return new MapVec(
            this.m00 * v.w + this.m01 * v.h,
            this.m10 * v.w + this.m11 * v.h,
        );
    }
}
