import { SPN, EDOMap, TuningMap } from "../src";

test("EDOMap produces correct number", () => {
    let p = SPN.toPitch("C4");
    let T = new EDOMap(12);
    expect(T.toNumber(p)).toEqual(60);
    T = new EDOMap(31);
    expect(T.toNumber(p)).toEqual(155);
});

test("EDOMap compares pitches correctly", () => {
    let p = SPN.toPitch("C#4");
    let q = SPN.toPitch("Db4");
    let T = new EDOMap(12);
    expect(T.compare(p, q)).toEqual(0);
    T = new EDOMap(31);
    expect(T.compare(p, q)).toBeLessThan(0);
    T = new EDOMap(53);
    expect(T.compare(p, q)).toBeGreaterThan(0);
})

test("TuningMap constructor throws for a fifth outside ~685.7¢-720¢", () => {
    expect(() => new TuningMap(700)).not.toThrow();
    // Boundaries are inclusive.
    expect(() => new TuningMap((1200 * 4) / 7)).not.toThrow();
    expect(() => new TuningMap((1200 * 3) / 5)).not.toThrow();
    // 600¢ (4-EDO's fifth): too narrow for a diatonic.
    expect(() => new TuningMap(600)).toThrow();
    // 800¢ (3-EDO's fifth): too wide for a diatonic.
    expect(() => new TuningMap(800)).toThrow();
});

test("TuningMap.fromEDO throws for EDOs that don't support a diatonic scale", () => {
    expect(() => TuningMap.fromEDO(12)).not.toThrow();
    expect(() => TuningMap.fromEDO(19)).not.toThrow();
    expect(() => TuningMap.fromEDO(31)).not.toThrow();
    // 5-EDO (720¢) and 7-EDO (~685.7¢) sit exactly on the boundaries.
    expect(() => TuningMap.fromEDO(5)).not.toThrow();
    expect(() => TuningMap.fromEDO(7)).not.toThrow();
    // 3-EDO (800¢) and 4-EDO (600¢) fall outside the range.
    expect(() => TuningMap.fromEDO(3)).toThrow();
    expect(() => TuningMap.fromEDO(4)).toThrow();
});

test("EDOMap constructor throws for EDOs that don't support a diatonic scale", () => {
    expect(() => new EDOMap(12)).not.toThrow();
    expect(() => new EDOMap(31)).not.toThrow();
    expect(() => new EDOMap(5)).not.toThrow();
    expect(() => new EDOMap(7)).not.toThrow();
    expect(() => new EDOMap(3)).toThrow();
    expect(() => new EDOMap(4)).toThrow();
});
