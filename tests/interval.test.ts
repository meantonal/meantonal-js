import { Interval, SPN } from "../src";

test("Interval.fromName creates correct Interval vector", () => {
    let m = Interval.fromName("P5");
    expect(m.w).toEqual(3);
    expect(m.h).toEqual(1);
    m = Interval.fromName("5");
    expect(m.w).toEqual(3);
    expect(m.h).toEqual(1);
    m = Interval.fromName("d5");
    expect(m.w).toEqual(2);
    expect(m.h).toEqual(2);
    m = Interval.fromName("b5");
    expect(m.w).toEqual(2);
    expect(m.h).toEqual(2);
    m = Interval.fromName("A5");
    expect(m.w).toEqual(4);
    expect(m.h).toEqual(0);
    m = Interval.fromName("#5");
    expect(m.w).toEqual(4);
    expect(m.h).toEqual(0);
    m = Interval.fromName("M3");
    expect(m.w).toEqual(2);
    expect(m.h).toEqual(0);
    m = Interval.fromName("3");
    expect(m.w).toEqual(2);
    expect(m.h).toEqual(0);
    m = Interval.fromName("m3");
    expect(m.w).toEqual(1);
    expect(m.h).toEqual(1);
    m = Interval.fromName("b3");
    expect(m.w).toEqual(1);
    expect(m.h).toEqual(1);
});

test("Interval.fromSPN creates correct Interval vector", () => {
    let m = Interval.fromName("M3");
    let n = Interval.fromSPN("C4", "E4");
    expect(m.w).toEqual(n.w);
    expect(m.h).toEqual(n.h);
});

test("Interval.between creates correct Interval vector", () => {
    let p = SPN.toPitch("C4");
    let q = SPN.toPitch("E4");
    expect(Interval.between(p, q)).toEqual(Interval.fromName("M3"));
});

test("Interval.chroma produces correct result", () => {
    let m = Interval.fromName("M3");
    expect(m.chroma).toEqual(4);
    m = Interval.fromName("m3");
    expect(m.chroma).toEqual(-3);
    m = Interval.fromName("A6");
    expect(m.chroma).toEqual(10);
});

test("Interval.isDiatonic produces correct result", () => {
    let m = Interval.fromName("P1");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("m2");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("M2");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("m3");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("M3");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("P4");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("A4");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("d5");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("P5");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("m6");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("M6");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("m7");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("M7");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("P8");
    expect(m.isDiatonic).toBeTruthy();
    m = Interval.fromName("d3");
    expect(m.isDiatonic).toBeFalsy();
    m = Interval.fromName("A6");
    expect(m.isDiatonic).toBeFalsy();
    m = Interval.fromName("A5");
    expect(m.isDiatonic).toBeFalsy();
});

test("Interval.quality produces correct result", () => {
    let m = Interval.fromName("P1");
    expect(m.quality).toEqual(0);
    m = Interval.fromName("P1");
    expect(m.quality).toEqual(0);
    m = Interval.fromName("P8");
    expect(m.quality).toEqual(0);
    m = Interval.fromName("P5");
    expect(m.quality).toEqual(0);
    m = Interval.fromName("P4");
    expect(m.quality).toEqual(0);

    m = Interval.fromName("M2");
    expect(m.quality).toEqual(1);
    m = Interval.fromName("M6");
    expect(m.quality).toEqual(1);
    m = Interval.fromName("M3");
    expect(m.quality).toEqual(1);
    m = Interval.fromName("M7");
    expect(m.quality).toEqual(1);

    m = Interval.fromName("m7");
    expect(m.quality).toEqual(-1);
    m = Interval.fromName("m3");
    expect(m.quality).toEqual(-1);
    m = Interval.fromName("m6");
    expect(m.quality).toEqual(-1);
    m = Interval.fromName("m2");
    expect(m.quality).toEqual(-1);

    m = Interval.fromName("A4");
    expect(m.quality).toEqual(2);
    m = Interval.fromName("A1");
    expect(m.quality).toEqual(2);
    m = Interval.fromName("A5");
    expect(m.quality).toEqual(2);
    m = Interval.fromName("A2");
    expect(m.quality).toEqual(2);
    m = Interval.fromName("A6");
    expect(m.quality).toEqual(2);
    m = Interval.fromName("A3");
    expect(m.quality).toEqual(2);
    m = Interval.fromName("A7");
    expect(m.quality).toEqual(2);

    m = Interval.fromName("d4");
    expect(m.quality).toEqual(-2);
    m = Interval.fromName("d1");
    expect(m.quality).toEqual(-2);
    m = Interval.fromName("d5");
    expect(m.quality).toEqual(-2);
    m = Interval.fromName("d2");
    expect(m.quality).toEqual(-2);
    m = Interval.fromName("d6");
    expect(m.quality).toEqual(-2);
    m = Interval.fromName("d3");
    expect(m.quality).toEqual(-2);
    m = Interval.fromName("d7");
    expect(m.quality).toEqual(-2);

    m = Interval.fromName("AA4");
    expect(m.quality).toEqual(3);
    m = Interval.fromName("dd4");
    expect(m.quality).toEqual(-3);
    m = Interval.fromName("dd6");
    expect(m.quality).toEqual(-3);
});

test("Interval.stepspan produces correct result", () => {
    let m = Interval.fromName("A6");
    expect(m.stepspan).toEqual(5);
    m = Interval.fromName("M6");
    expect(m.stepspan).toEqual(5);
    m = Interval.fromName("m6");
    expect(m.stepspan).toEqual(5);
    m = Interval.fromName("d6");
    expect(m.stepspan).toEqual(5);
    m = Interval.fromName("m13");
    expect(m.stepspan).toEqual(12);
});

test("Interval.pc7 produces correct result", () => {
    let m = Interval.fromName("M6");
    expect(m.pc7).toEqual(5);
    m = Interval.fromName("m13");
    expect(m.pc7).toEqual(5);
    m = Interval.fromName("P8");
    expect(m.pc7).toEqual(0);
});

test("Interval.pc12 produces correct result", () => {
    let m = Interval.fromName("M3");
    expect(m.pc12).toEqual(4);
    m = Interval.fromName("A4");
    expect(m.pc12).toEqual(6);
    m = Interval.fromName("M7");
    expect(m.pc12).toEqual(11);
    m = Interval.fromName("M9");
    expect(m.pc12).toEqual(2);
    m = Interval.fromName("P8");
    expect(m.pc12).toEqual(0);
});

test("Interval.name produces correct result", () => {
    let name = "AA5";
    let m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "A5";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "P5";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "d5";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "dd5";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "A6";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "M6";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "m6";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "d6";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
    name = "dd6";
    m = Interval.fromName(name);
    expect(m.name).toEqual(name);
});

test("Interval.isEqual produces correct result", () => {
    let m = new Interval(2, 0);
    let n = new Interval(1, 1);
    expect(m.isEqual(n)).toBeFalsy();
    n = new Interval(2, 0);
    expect(m.isEqual(n)).toBeTruthy();
});

test("Interval.isEnharmonic produces correct result", () => {
    let m = Interval.fromName("m7");
    let n = Interval.fromName("A6");
    expect(m.isEnharmonic(n)).toBeTruthy();
    expect(m.isEnharmonic(n, 31)).toBeFalsy();
    m = Interval.fromName("P8");
    n = Interval.fromName("AAAA6");
    expect(m.isEnharmonic(n, 31)).toBeTruthy();
    expect(m.isEnharmonic(n)).toBeFalsy();
});

test("Interval.negate produces correct result", () => {
    let m = new Interval(3, 4);
    let n = new Interval(-3, -4);
    expect(m.negative.isEqual(n)).toBeTruthy();
});

test("Interval.add produces correct result", () => {
    let m = Interval.fromName("M3");
    let n = Interval.fromName("m3");
    let sum = Interval.fromName("P5");
    expect(m.add(n).isEqual(sum)).toBeTruthy();
});

test("Interval.subtract produces correct result", () => {
    let m = Interval.fromName("P5");
    let n = Interval.fromName("m3");
    let difference = Interval.fromName("M3");
    expect(m.subtract(n).isEqual(difference)).toBeTruthy();
});

test("Interval.simple produces correct result", () => {
    let m = Interval.fromName("M17");
    let n = Interval.fromName("M3");
    expect(m.simple.isEqual(n)).toBeTruthy();
    expect(m.negative.simple.isEqual(n.negative)).toBeTruthy();
});
