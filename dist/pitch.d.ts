import { Interval } from "./interval";
import { TonalContext } from "./tonality";
export declare class Pitch {
    w: number;
    h: number;
    constructor(w: number, h: number);
    static fromSPN(spn: string): Pitch;
    static fromChroma(chroma: number, octave: number): Pitch;
    get midi(): number;
    get chroma(): number;
    get pc7(): number;
    get pc12(): number;
    get letter(): string;
    get accidental(): number;
    get octave(): number;
    isEqual(p: Pitch): boolean;
    isEnharmonic(p: Pitch, edo?: number): boolean;
    transposeReal(m: Interval): Pitch;
    invert(axis: Axis): Pitch;
    degreeIn(context: TonalContext): number;
    alterationIn(context: TonalContext): number;
    snapTo(context: TonalContext): Pitch;
    transposeDiatonic(steps: number, context: TonalContext): Pitch;
}
export declare class Axis {
    w: number;
    h: number;
    constructor(p: Pitch, q: Pitch);
    static fromSPN(ps: string, qs: string): Axis;
}
