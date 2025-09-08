import { Chroma } from "./chroma";
import { LETTER_COORDS, MODES } from "./constants";
import { Pitch } from "./pitch";

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

    public degreeNumber(p: Pitch): number {
        return (((p.w + p.h - "CDEFGAB".indexOf(this.tonic.letter)) % 7) + 7) % 7;
    }

    public degreeAlteration(p: Pitch): number {
        let x = p.chroma + this.chromaOffset;
        if (0 <= x && x < 7) return 0;
        if (7 <= x && x < 12) return 1;
        if (-5 <= x && x < 0) return -1;
        if (x < -5) return -2;
        return 2;
    }

    public degreeChroma(degree: number): number {
        return ((degree * 2 + this.mode) % 7) - this.chromaOffset;
    }

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
