import { LETTER_COORDS } from "./constants";
import { Interval } from "./interval";
import { TonalContext } from "./tonality";

export class Pitch {
    w: number;
    h: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    static fromSPN(spn: string): Pitch {
        const regex = /^([A-Ga-g])([#bxw]+)?(-?\d+)$/;
        const match = spn.match(regex);
        if (!match) {
            throw new Error(`Invalid SPN: ${spn}`);
        }

        const [, letter, accidentalStr = "", octaveStr] = match;
        const octave = parseInt(octaveStr, 10) + 1;

        let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter)];

        let accidental = 0;
        const accidentalArray = accidentalStr.split("");
        accidental += accidentalArray.filter((x) => x === "#").length;
        accidental += 2 * accidentalArray.filter((x) => x === "x").length;
        accidental -= accidentalArray.filter((x) => x === "b").length;
        accidental -= 2 * accidentalArray.filter((x) => x === "w").length;

        w += accidental;
        h -= accidental;
        w += 5 * octave;
        h += 2 * octave;

        return new Pitch(w, h);
    }

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

    public get midi(): number {
        return 2 * this.w + this.h;
    }

    public get chroma(): number {
        return this.w * 2 - this.h * 5;
    }

    public get pc7(): number {
        return (((this.w + this.h) % 7) + 7) % 7;
    }

    public get pc12(): number {
        return ((this.midi % 12) + 12) % 12;
    }

    public get letter(): string {
        return "CDEFGAB".charAt(this.pc7);
    }

    public get accidental(): number {
        return Math.floor((this.chroma + 1) / 7);
    }

    public get octave(): number {
        return Math.floor((this.w + this.h) / 7 - 1);
    }

    public isEqual(p: Pitch) {
        return this.w === p.w && this.h === p.h;
    }

    public isEnharmonic(p: Pitch, edo = 12) {
        return ((this.chroma % edo) + edo) % edo === ((p.chroma % edo) + edo) % edo;
    }

    public transposeReal(m: Interval) {
        return new Pitch(this.w + m.w, this.h + m.h);
    }

    public invert(axis: Axis) {
        return new Pitch(axis.w - this.w, axis.h - this.h);
    }

    public degreeIn(context: TonalContext) {
        return context.degreeNumber(this);
    }

    public alterationIn(context: TonalContext) {
        return context.degreeAlteration(this);
    }

    public snapTo(context: TonalContext) {
        return context.snapDiatonic(this);
    }

    public transposeDiatonic(steps: number, context: TonalContext) {
        return this.transposeReal(new Interval(steps, 0)).snapTo(context);
    }
}

export class Axis {
    w: number;
    h: number;

    constructor(p: Pitch, q: Pitch) {
        this.w = p.w + q.w;
        this.h = p.h + q.h;
    }

    static fromSPN(ps: string, qs: string) {
        return new Axis(Pitch.fromSPN(ps), Pitch.fromSPN(qs));
    }
}
