import { Pitch, TonalContext } from "../src";

test("TonalContext.fromStrings creates the correct TonalContext", () => {
    let context = TonalContext.fromStrings("Eb", "Phrygian");
    expect(context.mode).toEqual(5);
    expect(context.tonic.letter).toEqual("E");
    expect(context.tonic.accidental).toEqual(-1);
    expect(context.tonic.chroma).toEqual(-3);
});

test("TonalContext.degreeNumber produces correct result", () => {
    let context = new TonalContext(0, 1);
    let p = Pitch.fromSPN("C4");
    expect(p.degreeIn(context)).toEqual(0);
    p = Pitch.fromSPN("D4");
    expect(p.degreeIn(context)).toEqual(1);
    p = Pitch.fromSPN("E4");
    expect(p.degreeIn(context)).toEqual(2);
    p = Pitch.fromSPN("F4");
    expect(p.degreeIn(context)).toEqual(3);
    p = Pitch.fromSPN("G4");
    expect(p.degreeIn(context)).toEqual(4);
    p = Pitch.fromSPN("A4");
    expect(p.degreeIn(context)).toEqual(5);
    p = Pitch.fromSPN("B4");
    expect(p.degreeIn(context)).toEqual(6);
    p = Pitch.fromSPN("C#4");
    expect(p.degreeIn(context)).toEqual(0);
    p = Pitch.fromSPN("Db4");
    expect(p.degreeIn(context)).toEqual(1);
    context = new TonalContext(0, 5);
    expect(p.degreeIn(context)).toEqual(1);
});

test("TonalContext.degreeAlteration produces correct result", () => {
    let context = new TonalContext(0, 1);
    let p = Pitch.fromSPN("C4");
    expect(p.alterationIn(context)).toEqual(0);
    p = Pitch.fromSPN("C#4");
    expect(p.alterationIn(context)).toEqual(1);
    p = Pitch.fromSPN("Cb4");
    expect(p.alterationIn(context)).toEqual(-2);
    p = Pitch.fromSPN("Db4");
    expect(p.alterationIn(context)).toEqual(-1);
    p = Pitch.fromSPN("E#4");
    expect(p.alterationIn(context)).toEqual(2);
    context = new TonalContext(0, 4);
    p = Pitch.fromSPN("Cb4");
    expect(p.alterationIn(context)).toEqual(-1);
    p = Pitch.fromSPN("A#4");
    expect(p.alterationIn(context)).toEqual(2);
});

test("TonalContext.degreeChroma produces correct result", () => {
    let context = new TonalContext(1, 4);
    expect(context.degreeChroma(0)).toEqual(1);
    expect(context.degreeChroma(1)).toEqual(3);
    expect(context.degreeChroma(2)).toEqual(-2);
    expect(context.degreeChroma(3)).toEqual(0);
    expect(context.degreeChroma(4)).toEqual(2);
    expect(context.degreeChroma(5)).toEqual(-3);
    expect(context.degreeChroma(6)).toEqual(-1);
});

test("TonalContext.snapDiatonic produces correct result", () => {
    let context = new TonalContext(2, 1);
    let p = Pitch.fromSPN("Eb4");
    let q = Pitch.fromSPN("E4");
    expect(p.snapTo(context).isEqual(q)).toBeTruthy();
    p = Pitch.fromSPN("E#4");
    expect(p.snapTo(context).isEqual(q)).toBeTruthy();
    p = Pitch.fromSPN("Bb4");
    q = Pitch.fromSPN("B4");
    expect(p.snapTo(context).isEqual(q)).toBeTruthy();
});

test("Pitch.transposeDiatonic produces correct result", () => {
    let context = new TonalContext(2, 1);
    let p = Pitch.fromSPN("D4");
    let q = Pitch.fromSPN("E4");
    expect(p.transposeDiatonic(1, context).isEqual(q)).toBeTruthy();
    p = Pitch.fromSPN("D#4");
    expect(p.transposeDiatonic(1, context).isEqual(q)).toBeTruthy();
    q = Pitch.fromSPN("A3");
    expect(p.transposeDiatonic(-3, context).isEqual(q)).toBeTruthy();
});
