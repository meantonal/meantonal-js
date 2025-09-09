import { Map1d, Map2d } from "./map";
/**
 * Used to map modes to numbers in certain methods.
 */
export declare const MODES: Record<string, number>;
/**
 * Used in the construction of Pitch and Interval vectors by certain mehtods.
 */
export declare const LETTER_COORDS: {
    w: number;
    h: number;
}[];
export declare const ET7: Map1d;
export declare const ET12: Map1d;
export declare const ET19: Map1d;
export declare const ET31: Map1d;
export declare const ET50: Map1d;
export declare const ET55: Map1d;
export declare const WICKI_TO: Map2d;
export declare const WICKI_FROM: Map2d;
export declare const GENERATORS_TO: Map2d;
export declare const GENERATORS_FROM: Map2d;
