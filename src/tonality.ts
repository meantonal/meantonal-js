import { Chroma } from "./chroma";
import { LETTER_COORDS, MODES } from "./constants";
import { Pitch } from "./pitch";

/**
 * The TonalContext class stores information about the currently governing
 * key or mode.
 * - It is used with various methods to query or transform the position of
 *   Pitch vectors within a key or mode.
 * - Created from the "chroma" of the tonic scale degree (it's signed distance
 *   from C in perfect fifths), and the mode, numbered in ascending 5ths from
 *   Lydian = 0.
 * - Can also be created from strings with TonalContext.fromStrings()
 */
export class TonalContext {
    tonic: {
        letter: string;
        accidental: number;
        chroma: number;
    };
    mode: number;
    private chromaOffset: number;

    constructor(chroma: number, mode: number) {
        this.tonic = {
            letter: Chroma.toLetter(chroma),
            accidental: Chroma.toAccidental(chroma),
            chroma: chroma,
        };
        this.mode = mode;
        this.chromaOffset = mode - chroma;
    }

    private static ACCIDENTAL_MAP: Record<string, number> = {
        "#": 1,
        x: 2,
        b: -1,
        w: -2,
    };

    /**
     * Create a TonalContext using two strings for the tonic note name
     * and the mode.
     * - e.g. TonalContext.fromStrings("C#", "Dorian")
     */
    static fromStrings(tonic: string, mode: string) {
        const regex = /^([A-Ga-g])([#bxw]+)?$/;
        const match = tonic.match(regex);
        if (!match) {
            throw new Error(`Invalid tonic string: ${tonic}`);
        }

        const modeNumber = MODES[mode.toUpperCase()];
        if (modeNumber === undefined) {
            throw new Error(`Invalid mode string: ${mode}`);
        }

        const [, letter, accidentalStr = ""] = match;
        let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];

        for (const char of accidentalStr) {
            w += TonalContext.ACCIDENTAL_MAP[char] ?? 0;
            h -= TonalContext.ACCIDENTAL_MAP[char] ?? 0;
        }
        const chroma = 2 * w - 5 * h;

        return new TonalContext(chroma, modeNumber);
    }

    /**
     * Returns the scale degree (0-indexed) of the passed in Pitch vector in
     * the current context.
     */
    public degreeNumber(p: Pitch): number {
        return (((p.w + p.h - "CDEFGAB".indexOf(this.tonic.letter)) % 7) + 7) % 7;
    }

    /**
     * Returns the scale degree alteration represented by a Pitch in the
     * current TonalContext, e.g. C# is a raised note in the key of C major.
     * 0 represents a diatonic Pitch.
     * +1 / -1 represent a Pitch raised/lowered with accidentals.
     * +2 / -2 represent Pitches too remote to belong in a given TonalContext.
     */
    public degreeAlteration(p: Pitch): number {
        let x = p.chroma + this.chromaOffset;
        if (0 <= x && x < 7) return 0;
        if (7 <= x && x < 12) return 1;
        if (-5 <= x && x < 0) return -1;
        if (x < -5) return -2;
        return 2;
    }

    /**
     * Returns the chroma (signed distance in perfect 5ths from C) of the
     * diatonic variant of the passed in scale degree (0-indexed so the tonic
     * is 0).
     */
    public degreeChroma(degree: number): number {
        return ((degree * 2 + this.mode) % 7) - this.chromaOffset;
    }

    /**
     * Snaps a Pitch vector to the diatonic position for that letter-name in
     * the current TonalContext.
     * - e.g. in D major, F4 would "snap" to F#4.
     */
    public snapDiatonic(p: Pitch): Pitch {
        let result = new Pitch(p.w, p.h);
        while (result.alterationIn(this) > 0) {
            result.w--;
            result.h++;
        }
        while (result.alterationIn(this) < 0) {
            result.w++;
            result.h--;
        }

        return result;
    }
}
