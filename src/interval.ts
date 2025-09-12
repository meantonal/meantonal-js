import { SPN } from "./parse/spn";
import { Pitch } from "./pitch";

/**
 * An Interval is a distance between two Pitch vectors.
 * It can be constructed directly as some number of whole/half steps,
 * or via a standard interval name string: Interval.fromName("P5").
 * It is also frequently constructed from two Pitch vectors via
 * Interval.between(p, q) or p.intervalTo(q).
 */
export class Interval {
    w: number;
    h: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    static fromName(name: string) {
        const majorInts = [
            { w: 0, h: 0 },
            { w: 1, h: 0 },
            { w: 2, h: 0 },
            { w: 2, h: 1 },
            { w: 3, h: 1 },
            { w: 4, h: 1 },
            { w: 5, h: 1 },
        ];
        const sign = name[0] === "-" ? -1 : 1;

        const regex = /^-?([PpMmAaDd#b]+)?(\d+)$/;
        const match = name.match(regex);
        if (!match) {
            throw new Error(`Invalid interval name: ${name}`);
        }

        const [, accidentalStr = "", sizeStr] = match;

        const genericSize = parseInt(sizeStr, 10);

        const simple = (genericSize - 1) % 7;
        let { w, h } = majorInts[simple];

        const octave = Math.floor((genericSize - 1) / 7);
        w += 5 * octave;
        h += 2 * octave;

        let qualityAdjustment = 0;
        let splitStr = accidentalStr.split("");

        qualityAdjustment += splitStr.filter(
            (x) => x === "A" || x === "a" || x === "#",
        ).length;
        qualityAdjustment -= splitStr.filter((x) => x === "m" || x === "b").length;
        const dims = splitStr.filter((x) => x === "D" || x === "d").length;
        qualityAdjustment -= dims;
        if (dims !== 0 && simple !== 0 && simple !== 3 && simple !== 4)
            qualityAdjustment--;

        w += qualityAdjustment;
        h -= qualityAdjustment;

        return new Interval(sign * w, sign * h);
    }

    /**
     * Create an Interval from two pitch names as SPN strings.
     * - e.g. SPN.toPitch("C4", "E4"); // produces a major 3rd.
     */
    static fromSPN(ps: string, qs: string) {
        return Interval.between(SPN.toPitch(ps), SPN.toPitch(qs));
    }

    /**
     * Create an Interval from two passed-in Pitch vectors.
     */
    static between(p: Pitch, q: Pitch) {
        return new Interval(q.w - p.w, q.h - p.h);
    }

    /**
     * The "chroma" of an Interval is its signed distance from the unison
     * in perfect 5ths.
     */
    public get chroma() {
        return this.w * 2 - this.h * 5;
    }

    /**
     * The quality of an Interval as a signed number:
     * - 0 is perfect.
     * - +1 / -1 are major and minor respectively.
     * - +2 / -2 are augmented and diminished respectively.
     * etc. for arbitrarily remote Interval qualities.
     */
    public get quality() {
        if (Math.abs(this.chroma) <= 1) return 0;
        if (this.chroma > 0 && this.chroma <= 5)
            return Math.floor((this.chroma + 5) / 7);
        if (this.chroma < 0 && this.chroma >= -5)
            return Math.ceil((this.chroma - 5) / 7);
        if (this.chroma > 5) return Math.floor((this.chroma + 8) / 7);
        return Math.floor((this.chroma - 2) / 7);
    }

    /**
     * The "stepspan" of an Interval: the number of diatonic steps it contains,
     * where 0 is the unison, 1 is a generic second and so on.
     */
    public get stepspan(): number {
        return this.w + this.h;
    }

    /**
     * The 0-indexed 7-tone pitch class of an Interval. Essentially its size
     * in steps, modulo 7.
     */
    public get pc7(): number {
        return ((this.stepspan % 7) + 7) % 7;
    }

    /**
     * The 12-tone pitch class of an Interval familiar to post-tonal theory.
     */
    public get pc12(): number {
        return (((this.w * 2 + this.h) % 12) + 12) % 12;
    }

    /**
     * The standard name for an interval.
     */
    public get name() {
        let result = "";
        const quality = this.quality;
        if (quality > 1) result += "A".repeat(quality - 1);
        if (quality === 1) result += "M";
        if (quality === 0) result += "P";
        if (quality === -1) result += "m";
        if (quality < -1) result += "d".repeat(-quality - 1);
        result += (this.stepspan + 1).toString();
        return result;
    }

    /**
     * Returns true if two Interval vectors are identical.
     * Note this will NOT return true for notes that are merely enharmonic in
     * 12TET (use the "isEnharmonic" method for that).
     */
    public isEqual(m: Interval) {
        return this.w === m.w && this.h === m.h;
    }

    /**
     * Returns true if two Intervals are enharmonic in the specified EDO tuning.
     * If no tuning is specified, defaults to 12TET.
     * If you don't know what this means just leave the second argument blank.
     */
    public isEnharmonic(m: Interval, edo = 12) {
        return ((this.chroma % edo) + edo) % edo === ((m.chroma % edo) + edo) % edo;
    }

    /**
     * The flipped version of an interval.
     * An ascending major 3rd will become a descending major 3rd.
     * Or for vertical intervals, voices will exchange places.
     */
    public get negative() {
        return new Interval(-this.w, -this.h);
    }

    /*
     * Adds an Interval to the current vector.
     * Returns a new Interval vector without modifying the original.
     * */
    public add(m: Interval) {
        return new Interval(this.w + m.w, this.h + m.h);
    }

    /*
     * Subtracts an Interval from the current vector.
     * Returns a new Interval vector without modifying the original.
     * */
    public subtract(m: Interval) {
        return new Interval(this.w - m.w, this.h - m.h);
    }

    /**
     * The simple (i.e. non-compound / smaller than an octave) version of
     * an Interval vector. For simple intervals this will simply be the
     * same vector.
     */
    public get simple() {
        const octave = Math.trunc((this.w + this.h) / 7);
        return new Interval(this.w - octave * 5, this.h - octave * 2);
    }
}
