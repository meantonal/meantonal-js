import { Pitch } from "../src";

test("Pitch.fronSPN creates correct Pitch vector", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.w).toBe(25);
    expect(p.h).toBe(10);
    p = Pitch.fromSPN("C-1");
    expect(p.w).toBe(0);
    expect(p.h).toBe(0);
    p = Pitch.fromSPN("F##4");
    expect(p.w).toBe(29);
    expect(p.h).toBe(9);
    p = Pitch.fromSPN("Fx4");
    expect(p.w).toBe(29);
    expect(p.h).toBe(9);
    p = Pitch.fromSPN("Eb4");
    expect(p.w).toBe(26);
    expect(p.h).toBe(11);
    p = Pitch.fromSPN("Ew4");
    expect(p.w).toBe(25);
    expect(p.h).toBe(12);
});

test("Pitch.fromChroma produces correct Pitch vector", () => {
    let p = Pitch.fromChroma(0, 4);
    expect(p.w).toBe(25);
    expect(p.h).toBe(10);
    p = Pitch.fromChroma(6, 4);
    expect(p.w).toBe(28);
    expect(p.h).toBe(10);
});

test("Pitch.chroma produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.chroma).toBe(0);
    p = Pitch.fromSPN("Eb4");
    expect(p.chroma).toBe(-3);
    p = Pitch.fromSPN("F#4");
    expect(p.chroma).toBe(6);
});

test("Pitch.letter produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.letter).toBe("C");
    p = Pitch.fromSPN("F#4");
    expect(p.letter).toBe("F");
});

test("Pitch.accidental produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.accidental).toBe(0);
    p = Pitch.fromSPN("F#4");
    expect(p.accidental).toBe(1);
    p = Pitch.fromSPN("E#4");
    expect(p.accidental).toBe(1);
    p = Pitch.fromSPN("F4");
    expect(p.accidental).toBe(0);
    p = Pitch.fromSPN("B4");
    expect(p.accidental).toBe(0);
    p = Pitch.fromSPN("Bb4");
    expect(p.accidental).toBe(-1);
    p = Pitch.fromSPN("Fb4");
    expect(p.accidental).toBe(-1);
    p = Pitch.fromSPN("Fx4");
    expect(p.accidental).toBe(2);
});

test("Pitch.octave produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.octave).toBe(4);
    p = Pitch.fromSPN("B4");
    expect(p.octave).toBe(4);
    p = Pitch.fromSPN("C3");
    expect(p.octave).toBe(3);
    p = Pitch.fromSPN("B3");
    expect(p.octave).toBe(3);
    p = Pitch.fromSPN("C-1");
    expect(p.octave).toBe(-1);
    p = Pitch.fromSPN("B-1");
    expect(p.octave).toBe(-1);
});

test("Pitch.midi produces correct result", () => {
    let p = Pitch.fromSPN("C-1");
    expect(p.midi).toBe(0);
    p = Pitch.fromSPN("C4");
    expect(p.midi).toBe(60);
    p = Pitch.fromSPN("A4");
    expect(p.midi).toBe(69);
});
