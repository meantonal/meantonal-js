import { Pitch } from "./pitch";

export class Interval {
    w: number;
    h: number;
    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    static fromSPN(ps: string, qs: string) {
        return Interval.between(Pitch.fromSPN(ps), Pitch.fromSPN(qs));
    }

    static between(p: Pitch, q: Pitch) {
        return new Interval(q.w - p.w, q.h - p.h);
    }

    public get chroma() {
        return this.w * 2 - this.h * 5;
    }

    public get quality() {
        if (this.chroma === 0) return 0;
        if (this.chroma > 0 && this.chroma <= 5)
            return Math.floor((this.chroma + 5) / 7);
        if (this.chroma < 0 && this.chroma >= -5)
            return Math.floor((this.chroma - 5) / 7);
        if (this.chroma > 5) return Math.floor((this.chroma + 8) / 7);
        return Math.floor((this.chroma - 8) / 7);
    }

    public get stepspan(): number {
        return (((this.w + this.h) % 7) + 7) % 7;
    }

    public get pc12(): number {
        return (((this.w * 2 + this.h) % 12) + 12) % 12;
    }

    public equal(m: Interval) {
        return this.w === m.w && this.h === m.h;
    }

    public enharmonic(m: Interval, edo = 12) {
        return ((this.chroma % edo) + edo) % edo === ((m.chroma % edo) + edo) % edo;
    }

    public negate() {
        return new Interval(-this.w, -this.h);
    }

    public add(m: Interval) {
        return new Interval(this.w + m.w, this.h + m.h);
    }

    public subtract(m: Interval) {
        return new Interval(this.w - m.w, this.h - m.h);
    }

    public simple() {
        const octave = Math.floor(this.w + this.h);
        return new Interval(this.w - octave * 5, this.h - octave * 2);
    }
}
