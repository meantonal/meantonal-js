import { SPN, TonalContext } from "../src";

test("TonalContext.fromStrings creates the correct TonalContext", () => {
    let context = TonalContext.fromStrings("Eb", "Phrygian");
    expect(context.mode).toEqual(5);
    expect(context.tonic.letter).toEqual("E");
    expect(context.tonic.accidental).toEqual(-1);
    expect(context.tonic.chroma).toEqual(-3);
});

test("TonalContext.degreeNumber produces correct result", () => {
    let context = new TonalContext(0, 1);
    let p = SPN.toPitch("C4");
    expect(p.degreeIn(context)).toEqual(0);
    p = SPN.toPitch("D4");
    expect(p.degreeIn(context)).toEqual(1);
    p = SPN.toPitch("E4");
    expect(p.degreeIn(context)).toEqual(2);
    p = SPN.toPitch("F4");
    expect(p.degreeIn(context)).toEqual(3);
    p = SPN.toPitch("G4");
    expect(p.degreeIn(context)).toEqual(4);
    p = SPN.toPitch("A4");
    expect(p.degreeIn(context)).toEqual(5);
    p = SPN.toPitch("B4");
    expect(p.degreeIn(context)).toEqual(6);
    p = SPN.toPitch("C#4");
    expect(p.degreeIn(context)).toEqual(0);
    p = SPN.toPitch("Db4");
    expect(p.degreeIn(context)).toEqual(1);
    context = new TonalContext(0, 5);
    expect(p.degreeIn(context)).toEqual(1);
});

test("TonalContext.degreeAlteration produces correct result", () => {
    let context = new TonalContext(0, 1);
    let p = SPN.toPitch("C4");
    expect(p.alterationIn(context)).toEqual(0);
    p = SPN.toPitch("C#4");
    expect(p.alterationIn(context)).toEqual(1);
    p = SPN.toPitch("Cb4");
    expect(p.alterationIn(context)).toEqual(-2);
    p = SPN.toPitch("Db4");
    expect(p.alterationIn(context)).toEqual(-1);
    p = SPN.toPitch("E#4");
    expect(p.alterationIn(context)).toEqual(2);
    context = new TonalContext(0, 4);
    p = SPN.toPitch("Cb4");
    expect(p.alterationIn(context)).toEqual(-1);
    p = SPN.toPitch("A#4");
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
    let p = SPN.toPitch("Eb4");
    let q = SPN.toPitch("E4");
    expect(p.snapTo(context).isEqual(q)).toBeTruthy();
    p = SPN.toPitch("E#4");
    expect(p.snapTo(context).isEqual(q)).toBeTruthy();
    p = SPN.toPitch("Bb4");
    q = SPN.toPitch("B4");
    expect(p.snapTo(context).isEqual(q)).toBeTruthy();
});

test("Pitch.transposeDiatonic produces correct result", () => {
    let context = new TonalContext(2, 1);
    let p = SPN.toPitch("D4");
    let q = SPN.toPitch("E4");
    expect(p.transposeDiatonic(1, context).isEqual(q)).toBeTruthy();
    p = SPN.toPitch("D#4");
    expect(p.transposeDiatonic(1, context).isEqual(q)).toBeTruthy();
    q = SPN.toPitch("A3");
    expect(p.transposeDiatonic(-3, context).isEqual(q)).toBeTruthy();
});
