import { Interval } from "./interval";
import { Pitch } from "./pitch";

export class MapVec {
    w: number;
    h: number;
    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    public toPitch() {
        return new Pitch(this.w, this.h);
    }

    public toInterval() {
        return new Interval(this.w, this.h);
    }
}

export class Map1d {
    private m0: number;
    private m1: number;

    constructor(m0: number, m1: number) {
        this.m0 = m0;
        this.m1 = m1;
    }

    public map(v: MapVec | Pitch | Interval): number {
        return this.m0 * v.w + this.m1 * v.h;
    }
}

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

    public map(v: MapVec | Pitch | Interval): MapVec {
        return new MapVec(
            this.m00 * v.w + this.m01 * v.h,
            this.m10 * v.w + this.m11 * v.h,
        );
    }
}
