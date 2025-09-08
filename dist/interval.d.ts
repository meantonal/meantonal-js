import { Pitch } from "./pitch";
export declare class Interval {
    w: number;
    h: number;
    constructor(w: number, h: number);
    static fromName(name: string): Interval;
    static fromSPN(ps: string, qs: string): Interval;
    static between(p: Pitch, q: Pitch): Interval;
    get chroma(): number;
    get quality(): number;
    get stepspan(): number;
    get pc7(): number;
    get pc12(): number;
    equal(m: Interval): boolean;
    enharmonic(m: Interval, edo?: number): boolean;
    get negative(): Interval;
    add(m: Interval): Interval;
    subtract(m: Interval): Interval;
    get simple(): Interval;
}
