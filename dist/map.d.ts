import { Interval } from "./interval";
import { Pitch } from "./pitch";
export declare class MapVec {
    w: number;
    h: number;
    constructor(w: number, h: number);
    toPitch(): Pitch;
    toInterval(): Interval;
}
export declare class Map1d {
    private m0;
    private m1;
    constructor(m0: number, m1: number);
    map(v: MapVec | Pitch | Interval): number;
}
export declare class Map2d {
    private m00;
    private m01;
    private m10;
    private m11;
    constructor(m00: number, m01: number, m10: number, m11: number);
    map(v: MapVec | Pitch | Interval): MapVec;
}
