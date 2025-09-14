import { GENERATORS_TO } from "./constants";
import { Interval } from "./interval";
import { SPN } from "./parse/spn";
import { Pitch } from "./pitch";

/**
 * An indeterminate vector type to be used with the Map1D and Map2D classes.
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
export class Map1D {
    m0: number;
    m1: number;

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

    public compose(map: Map2D): Map1D {
        return new Map1D(
            this.m0 * map.m00 + this.m1 * map.m10,
            this.m0 * map.m01 + this.m1 * map.m11
        );
    }
}

/**
 * Represents a 2x2 matrix. Used to effect an arbitrary basis change from one
 * coordinates system to another.
 */
export class Map2D {
    m00: number;
    m01: number;
    m10: number;
    m11: number;

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

    public compose(map: Map2D): Map2D {
        return new Map2D(
            this.m00 * map.m00 + this.m01 * map.m10,
            this.m00 * map.m01 + this.m01 * map.m11,
            this.m10 * map.m00 + this.m11 * map.m10,
            this.m10 * map.m01 + this.m11 * map.m11
        );
    }
}

/**
 * Represents a map onto a given tuning system. Specified in terms of the width
 * of its fifth, and the name and frequency of a reference pitch in Hz
 * (e.g. A = 440).
 * - Reference pitch is optional, defaults to C4 = 261.6255653Hz.
 */
export class TuningMap {
    private referencePitch: Pitch;
    private referenceFreq: number;
    private centMap: Map1D;

    constructor(
        fifth: number,
        referencePitch: string = "C4",
        referenceFreq: number = 261.6255653,
    ) {
        this.referencePitch = SPN.toPitch(referencePitch);
        this.referenceFreq = referenceFreq;

        this.centMap = new Map1D(fifth, 1200);
    }

    /**
     * Initialises an EDO tuning map by specifying the number of parts to
     * divide the octave into rather than the width of the fifth in cents.
     */
    static fromEDO(
        edo: number,
        referencePitch: string = "C4",
        referenceFreq: number = 261.6255653,
    ) {
        const fifthSteps = Math.round(Math.log2(1.5) * edo);
        const fifth = (fifthSteps * 1200) / edo;
        return new TuningMap(fifth, referencePitch, referenceFreq);
    }

    /**
     * Renders the width of an Interval in cents.
     */
    toCents(m: Interval) {
        return this.centMap.map(GENERATORS_TO.map(m));
    }

    /**
     * Renders the ratio of an Interval vector as a decimal number.
     */
    toRatio(m: Interval) {
        return 2 ** (this.toCents(m) / 1200);
    }

    /**
     * Renders the frequency of a Pitch vector in Hertz.
     */
    toHz(p: Pitch) {
        return this.referenceFreq * this.toRatio(this.referencePitch.intervalTo(p));
    }
}
