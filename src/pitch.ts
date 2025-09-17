import { Interval } from "./interval";
import { SPN } from "./parse/spn";
import { TonalContext } from "./tonality";

/**
 * The Pitch class is the most fundamental type in Meantonal.
 * - Can be constructed from some number of whole steps and half steps from C-1
 *   (the lowest MIDI note).
 * - Can also be constructed using static methods like Pitch.fromSPN().
 */
export class Pitch {
    w: number; // whole steps from C-1
    h: number; // half steps from C-1

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    /**
     * Create a Pitch vector from a chroma value (the signed distance of a note
     * name from "C" in perfect fifths), and an octave number (in SPN numbering).
     */
    static fromChroma(chroma: number, octave: number): Pitch {
        let [w, h] = [chroma * 3, chroma];
        ++octave;
        while ((w + h) / 7 > octave) {
            w -= 5;
            h -= 2;
        }
        while ((w + h) / 7 < octave) {
            w += 5;
            h += 2;
        }
        return new Pitch(w, h);
    }

    /**
     * Returns the standard MIDI number for a Pitch.
     * Throws if outside of the standard MIDI range 0 <= x <128
     */
    public get midi(): number {
        const midi = 2 * this.w + this.h;
        if (midi >= 0 && midi < 128) return midi;
        throw new Error(`Outside of standard MIDI range: ${midi}`);
    }

    /**
     * The signed distance of a Pitch from "C" in perfect 5ths.
     */
    public get chroma(): number {
        return this.w * 2 - this.h * 5;
    }

    /**
     * The 0-indexed 7-tone pitch class of a Pitch. Equivalent to a numerical
     * representation of its letter name. C is 0.
     */
    public get pc7(): number {
        return (((this.w + this.h) % 7) + 7) % 7;
    }

    /**
     * The 12-tone pitch class of a Pitch. C is 0.
     */
    public get pc12(): number {
        return ((this.midi % 12) + 12) % 12;
    }

    /**
     * The letter component of a Pitch as a string, e.g. Db4 -> "D".
     */
    public get letter(): string {
        return "CDEFGAB".charAt(this.pc7);
    }

    /**
     * The accidental component of a Pitch as a number:
     * - Natural notes return 0.
     * - Sharp notes return 1.
     * - Flat notes return -1.
     * - Double sharps and double flats return 2 and -2.
     * etc. for arbitrary accidentals.
     */
    public get accidental(): number {
        return Math.floor((this.chroma + 1) / 7);
    }

    /**
     * The octave number of a Pitch (in SPN numbering).
     */
    public get octave(): number {
        return Math.floor((this.w + this.h) / 7 - 1);
    }

    /**
     * Returns the signed number of diatonic steps to reach the passed-in
     * Pitch.
     */
    public stepsTo(p: Pitch) {
        return (p.w + p.h) - (this.w + this.h);
    }

    /**
     * Returns true if two Pitch vectors are identical.
     * Note this will NOT return true for notes that are merely enharmonic in
     * 12TET (use the "isEnharmonic" method for that).
     */
    public isEqual(p: Pitch) {
        return this.w === p.w && this.h === p.h;
    }

    /**
     * Returns true if two notes are enharmonic in the specified EDO tuning.
     * If no tuning is specified, defaults to 12TET.
     * If you don't know what this means just leave the second argument blank.
     */
    public isEnharmonic(p: Pitch, edo = 12) {
        return ((this.chroma % edo) + edo) % edo === ((p.chroma % edo) + edo) % edo;
    }

    /**
     * Returns the interval from the current Pitch to another passed-in vector.
     */
    public intervalTo(p: Pitch) {
        return Interval.between(this, p);
    }

    /**
     * Transpose a Pitch vector by the passed in Interval vector.
     * Pitch.transposeReal returns the transposed Pitch as a new vector.
     * It does not modify the original Pitch.
     */
    public transposeReal(m: Interval) {
        return new Pitch(this.w + m.w, this.h + m.h);
    }

    /**
     * Invert a Pitch vector about the passed in axis.
     * An Axis is created from two Pitches, either directly or via
     * Axis.fromSPN() using two SPN strings.
     * Pitch.invert returns the inverted Pitch as a new vector.
     * It does not modify the original Pitch.
     */
    public invert(axis: Axis) {
        return new Pitch(axis.w - this.w, axis.h - this.h);
    }

    /**
     * Returns the scale degree number represented by a Pitch in the passed-in
     * TonalContext.
     * Note that this number is 0-indexed. 0 is the tonic of a key or mode.
     */
    public degreeIn(context: TonalContext) {
        return context.degreeNumber(this);
    }

    /**
     * Returns the scale degree alteration represented by a Pitch in the
     * passed-in TonalContext, e.g. C# is a raised note in the key of C major.
     * 0 represents a diatonic Pitch in the TonalContext.
     * +1 / -1 represent a raised or lowered Pitch in the TonalContext.
     * +2 / -2 represent Pitches too remote to belong in a given TonalContext.
     */
    public alterationIn(context: TonalContext) {
        return context.degreeAlteration(this);
    }

    /**
     * Snaps a Pitch vector to the diatonic position for that letter-name in
     * the passed-in TonalContext.
     */
    public snapTo(context: TonalContext) {
        return context.snapDiatonic(this);
    }

    /**
     * Transpose a Pitch vector by a generic interval specified as a simple
     * number, snapping to diatonic values.
     * - Measured in steps, such that 0 is a unison.
     */
    public transposeDiatonic(steps: number, context: TonalContext) {
        return this.transposeReal(new Interval(steps, 0)).snapTo(context);
    }

    static range = {
        *diatonic(from: Pitch, to: Pitch, context: TonalContext) {
            let m = new Pitch(from.w, from.h);
            yield m.snapTo(context);
            while (m.stepsTo(to) > 0) {
                m = m.transposeDiatonic(1, context);
                yield m;
            }
        },
        *chromatic(from: Pitch, to: Pitch, context: TonalContext) {
            const nearestMiBelow = (p: Pitch) => {
                const chroma = p.chroma;
                const hardMi = 6 - context.chromaOffset;
                const naturalMi = 5 - context.chromaOffset;
                const distanceToHardMi = ((chroma - hardMi) * 3 % 7 - 7) % 7;
                const distanceToNaturalMi = ((chroma - naturalMi) * 3 % 7 - 7) % 7;
                let nearestMi = Math.max(distanceToHardMi, distanceToNaturalMi);
                return p.transposeDiatonic(nearestMi, context);
            }
            const nextMiAbove = (p: Pitch) => {
                const chroma = p.chroma;
                const hardMi = 6 - context.chromaOffset;
                const naturalMi = 5 - context.chromaOffset;
                const distanceToHardMi = ((chroma - hardMi) * 3 % 7 + 7) % 7;
                const distanceToNaturalMi = ((chroma - naturalMi) * 3 % 7 + 7) % 7;
                let nextMi = Math.max(distanceToHardMi, distanceToNaturalMi);
                return p.transposeDiatonic(nextMi, context);
            }
            let start = new Pitch(from.w, from.h);
            let miBelow = nearestMiBelow(start)
            let floor = miBelow.h;
            let middle = nextMiAbove(miBelow);
            const end = to;
            while (middle.stepsTo(end) > 0) {
                while (start.w <= middle.w - 1) {
                    while (start.h <= middle.h + 1) {
                        if (start.stepsTo(from) > 0) {
                            start.h++;
                            continue;
                        }
                        yield start;
                        start.h++;
                    }
                    start.h = floor;
                    start.w++;
                }
                floor = middle.h;
                middle = nextMiAbove(middle);
            }
            while (start.w <= end.w) {
                while (start.h <= middle.h + 1) {
                    if (start.stepsTo(end) < 0) return;
                    yield start;
                    start.h++;
                }
                start.h = floor;
                start.w++;
            }
        },
    }
}

/**
 * The Axis class is used to invert pitches about a fixed point.
 * It can be defined by two Pitch vectors that will invert to each other.
 */
export class Axis {
    w: number;
    h: number;

    constructor(p: Pitch, q: Pitch) {
        this.w = p.w + q.w;
        this.h = p.h + q.h;
    }

    static fromSPN(ps: string, qs: string) {
        return new Axis(
            SPN.toPitch(ps),
            SPN.toPitch(qs)
        )
    }
}
