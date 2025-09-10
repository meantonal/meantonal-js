import { Map1d, Map2d } from "./map";

/**
 * Used to map modes to numbers in certain methods.
 */
export const MODES: Record<string, number> = {
    LYDIAN: 0,
    IONIAN: 1,
    MIXOLYDIAN: 2,
    DORIAN: 3,
    AEOLIAN: 4,
    PHRYGIAN: 5,
    LOCRIAN: 6,

    MAJOR: 1,
    MINOR: 4,
};

/**
 * Used in the construction of Pitch and Interval vectors by certain mehtods.
 */
export const LETTER_COORDS = [
    { w: 0, h: 0 }, // C
    { w: 1, h: 0 }, // D
    { w: 2, h: 0 }, // E
    { w: 2, h: 1 }, // F
    { w: 3, h: 1 }, // G
    { w: 4, h: 1 }, // A
    { w: 5, h: 1 }, // B
];

export const EDO7 = new Map1d(1, 1);
export const EDO12 = new Map1d(2, 1);
export const EDO17 = new Map1d(3, 1);
export const EDO19 = new Map1d(3, 2);
export const EDO22 = new Map1d(4, 1);
export const EDO31 = new Map1d(5, 3);
export const EDO50 = new Map1d(8, 5);
export const EDO53 = new Map1d(9, 4);
export const EDO55 = new Map1d(9, 5);
export const EDO81 = new Map1d(13, 8);

export const WICKI_TO = new Map2d(1, -3, 0, 1);
export const WICKI_FROM = new Map2d(1, 3, 0, 1);
export const GENERATORS_TO = new Map2d(2, -5, -1, 3);
export const GENERATORS_FROM = new Map2d(3, 5, 1, 2);
