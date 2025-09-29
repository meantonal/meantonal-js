// src/pitch.ts
var _Pitch = class _Pitch {
  // half steps from C-1
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  /**
   * Create a Pitch vector from a chroma value (the signed distance of a note
   * name from "C" in perfect fifths), and an octave number (in SPN numbering).
   */
  static fromChroma(chroma, octave) {
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
    return new _Pitch(w, h);
  }
  /**
   * Returns the standard MIDI number for a Pitch.
   * Throws if outside of the standard MIDI range 0 <= x <128
   */
  get midi() {
    const midi = 2 * this.w + this.h;
    if (midi >= 0 && midi < 128) return midi;
    throw new Error(`Outside of standard MIDI range: ${midi}`);
  }
  /**
   * The signed distance of a Pitch from "C" in perfect 5ths.
   */
  get chroma() {
    return this.w * 2 - this.h * 5;
  }
  /**
   * The 0-indexed 7-tone pitch class of a Pitch. Equivalent to a numerical
   * representation of its letter name. C is 0.
   */
  get pc7() {
    return ((this.w + this.h) % 7 + 7) % 7;
  }
  /**
   * The 12-tone pitch class of a Pitch. C is 0.
   */
  get pc12() {
    return (this.midi % 12 + 12) % 12;
  }
  /**
   * The letter component of a Pitch as a string, e.g. Db4 -> "D".
   */
  get letter() {
    return "CDEFGAB".charAt(this.pc7);
  }
  /**
   * The accidental component of a Pitch as a number:
   * - Natural notes return 0.
   * - Sharp notes return 1.
   * - Flat notes return -1.
   * - Double sharps and double flats return 2 and -2.
   * etc. for arbitrary accidentals.
   */
  get accidental() {
    return Math.floor((this.chroma + 1) / 7);
  }
  /**
   * The octave number of a Pitch (in SPN numbering).
   */
  get octave() {
    return Math.floor((this.w + this.h) / 7 - 1);
  }
  /**
   * Returns the signed number of diatonic steps to reach the passed-in
   * Pitch.
   */
  stepsTo(p) {
    return p.w + p.h - (this.w + this.h);
  }
  /**
   * Returns true if two Pitch vectors are identical.
   * Note this will NOT return true for notes that are merely enharmonic in
   * 12TET (use the "isEnharmonic" method for that).
   */
  isEqual(p) {
    return this.w === p.w && this.h === p.h;
  }
  /**
   * Returns true if two notes are enharmonic in the specified EDO tuning.
   * If no tuning is specified, defaults to 12TET.
   * If you don't know what this means just leave the second argument blank.
   */
  isEnharmonic(p, edo = 12) {
    return (this.chroma % edo + edo) % edo === (p.chroma % edo + edo) % edo;
  }
  /**
   * Returns the interval from the current Pitch to another passed-in vector.
   */
  intervalTo(p) {
    return Interval.between(this, p);
  }
  /**
   * Transpose a Pitch vector by the passed in Interval vector.
   * Pitch.transposeReal returns the transposed Pitch as a new vector.
   * It does not modify the original Pitch.
   */
  transposeReal(m) {
    return new _Pitch(this.w + m.w, this.h + m.h);
  }
  /**
   * Invert a Pitch vector about the passed in axis.
   * A MirrorAxis is created from two Pitches, either directly or via
   * MirrorAxis.fromSPN() using two SPN strings.
   * Pitch.invert returns the inverted Pitch as a new vector.
   * It does not modify the original Pitch.
   */
  invert(axis) {
    return new _Pitch(axis.w - this.w, axis.h - this.h);
  }
  /**
   * Returns the scale degree number represented by a Pitch in the passed-in
   * TonalContext.
   * Note that this number is 0-indexed. 0 is the tonic of a key or mode.
   */
  degreeIn(context) {
    return context.degreeNumber(this);
  }
  /**
   * Returns the scale degree alteration represented by a Pitch in the
   * passed-in TonalContext, e.g. C# is a raised note in the key of C major.
   * 0 represents a diatonic Pitch in the TonalContext.
   * +1 / -1 represent a raised or lowered Pitch in the TonalContext.
   * +2 / -2 represent Pitches too remote to belong in a given TonalContext.
   */
  alterationIn(context) {
    return context.degreeAlteration(this);
  }
  /**
   * Snaps a Pitch vector to the diatonic position for that letter-name in
   * the passed-in TonalContext.
   */
  snapTo(context) {
    return context.snapDiatonic(this);
  }
  /**
   * Transpose a Pitch vector by a generic interval specified as a simple
   * number, snapping to diatonic values.
   * - Measured in steps, such that 0 is a unison.
   */
  transposeDiatonic(steps, context) {
    return this.transposeReal(new Interval(steps, 0)).snapTo(context);
  }
  /**
   * Returns the highest Pitch in a passed-in Pitch[] array.
   * Uses optional passed-in TuningMap to decide whether one Pitch is higher
   * than another, defaults to 12TET.
   */
  static highest(arr, T = TuningMap.fromEDO(12)) {
    return arr.reduce((a, c) => {
      if (T.toHz(a) > T.toHz(c))
        return a;
      if (T.toHz(a) < T.toHz(c))
        return c;
      if (a.stepsTo(c) < 0)
        return a;
      return c;
    });
  }
  /**
   * Returns the lowest Pitch in a passed-in Pitch[] array.
   * Uses optional passed-in TuningMap to decide whether one Pitch is lower
   * than another, defaults to 12TET.
   */
  static lowest(arr, T = TuningMap.fromEDO(12)) {
    return arr.reduce((a, c) => {
      if (T.toHz(a) < T.toHz(c))
        return a;
      if (T.toHz(a) > T.toHz(c))
        return c;
      if (a.stepsTo(c) > 0)
        return a;
      return c;
    });
  }
  /**
   * Returns the Pitch in a Pitch[] array closest to the calling Pitch.
   * Uses optional passed-in TuningMap to decide whether one Pitch is closer
   * than another, defaults to 12TET.
   */
  nearest(arr, T = TuningMap.fromEDO(12)) {
    function orientedRatioBetween(p, q) {
      return Math.max(T.toRatio(p.intervalTo(q)), T.toRatio(q.intervalTo(p)));
    }
    const nearestByRatio = arr.sort((p, q) => {
      return orientedRatioBetween(this, p) - orientedRatioBetween(this, q);
    })[0];
    const filteredByHz = arr.filter((p) => {
      return orientedRatioBetween(this, p) === orientedRatioBetween(this, nearestByRatio);
    });
    return filteredByHz.sort((p, q) => {
      return this.stepsTo(p) - this.stepsTo(q);
    })[0];
  }
};
_Pitch.range = {
  /**
   *  Create a diatonic range of Pitch vectors between two specified
   *  pitches in a given TonalContext.
   */
  *diatonic(from, to, context) {
    let m = new _Pitch(from.w, from.h);
    yield m.snapTo(context);
    while (m.stepsTo(to) > 0) {
      m = m.transposeDiatonic(1, context);
      yield new _Pitch(m.w, m.h);
    }
  },
  /**
   *  Create a full chromatic range of Pitch vectors between two specified
   *  pitches in a given TonalContext.
   *  Only pitches which could represent either diatonic or altered degrees
   *  in the passed-in context will be included.
   */
  *chromatic(from, to, context) {
    let current = new _Pitch(from.w, from.h);
    let miBelow = context.nearestMiBelow(current);
    let floor = miBelow.h;
    let middle = context.nextMiAbove(miBelow);
    const end = to;
    while (middle.stepsTo(end) > 0) {
      while (current.w <= middle.w - 1) {
        while (current.h <= middle.h + 1) {
          if (current.stepsTo(from) > 0) {
            current.h++;
            continue;
          }
          yield new _Pitch(current.w, current.h);
          current.h++;
        }
        current.h = floor;
        current.w++;
      }
      floor = middle.h;
      middle = context.nextMiAbove(middle);
    }
    while (current.w <= end.w) {
      while (current.h <= middle.h + 1) {
        if (current.stepsTo(end) < 0) return;
        yield new _Pitch(current.w, current.h);
        current.h++;
      }
      current.h = floor;
      current.w++;
    }
  }
};
var Pitch = _Pitch;
var MirrorAxis = class _MirrorAxis {
  constructor(p, q) {
    this.w = p.w + q.w;
    this.h = p.h + q.h;
  }
  static fromSPN(ps, qs) {
    return new _MirrorAxis(
      SPN.toPitch(ps),
      SPN.toPitch(qs)
    );
  }
};

// src/parse/spn.ts
var SPN = class {
  /**
   * Create a Pitch vector from a Scientific Pitch Notation string.
   */
  static toPitch(spn) {
    const regex = /^([A-Ga-g])([#bxw]+)?(-?\d+)$/;
    const match = spn.match(regex);
    if (!match) {
      throw new Error(`Invalid SPN: ${spn}`);
    }
    const [, letter, accidentalStr = "", octaveStr] = match;
    const octave = parseInt(octaveStr, 10) + 1;
    let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];
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
  /**
   * Returns the SPN name of a Pitch.
   */
  static fromPitch(p) {
    let result = p.letter;
    const accidental = p.accidental;
    if (accidental == 2) result += "x";
    else if (accidental > 0) result += "#".repeat(accidental);
    if (accidental < 0) result += "b".repeat(-accidental);
    result += p.octave.toString();
    return result;
  }
};

// src/interval.ts
var _Interval = class _Interval {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  static fromName(name) {
    const majorInts = [
      { w: 0, h: 0 },
      { w: 1, h: 0 },
      { w: 2, h: 0 },
      { w: 2, h: 1 },
      { w: 3, h: 1 },
      { w: 4, h: 1 },
      { w: 5, h: 1 }
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
      (x) => x === "A" || x === "a" || x === "#"
    ).length;
    qualityAdjustment -= splitStr.filter((x) => x === "m" || x === "b").length;
    const dims = splitStr.filter((x) => x === "D" || x === "d").length;
    qualityAdjustment -= dims;
    if (dims !== 0 && simple !== 0 && simple !== 3 && simple !== 4)
      qualityAdjustment--;
    w += qualityAdjustment;
    h -= qualityAdjustment;
    return new _Interval(sign * w, sign * h);
  }
  /**
   * Create an Interval from two pitch names as SPN strings.
   * - e.g. SPN.toPitch("C4", "E4"); // produces a major 3rd.
   */
  static fromSPN(ps, qs) {
    return _Interval.between(SPN.toPitch(ps), SPN.toPitch(qs));
  }
  /**
   * Create an Interval from two passed-in Pitch vectors.
   */
  static between(p, q) {
    return new _Interval(q.w - p.w, q.h - p.h);
  }
  /**
   * The "chroma" of an Interval is its signed distance from the unison
   * in perfect 5ths.
   */
  get chroma() {
    return this.w * 2 - this.h * 5;
  }
  get isDiatonic() {
    return Math.abs(this.chroma) < 7;
  }
  /**
   * The quality of an Interval as a signed number:
   * - 0 is perfect.
   * - +1 / -1 are major and minor respectively.
   * - +2 / -2 are augmented and diminished respectively.
   * etc. for arbitrarily remote Interval qualities.
   */
  get quality() {
    const sign = this.stepspan < 0 ? -1 : 1;
    const chroma = this.chroma;
    if (Math.abs(chroma) <= 1) return 0;
    if (chroma > 0 && chroma <= 5)
      return sign * Math.floor((chroma + 5) / 7);
    if (chroma < 0 && chroma >= -5)
      return sign * Math.ceil((chroma - 5) / 7);
    if (chroma > 5) return sign * Math.floor((chroma + 8) / 7);
    return sign * Math.floor((chroma - 2) / 7);
  }
  /**
   * The "stepspan" of an Interval: the number of diatonic steps it contains,
   * where 0 is the unison, 1 is a generic second and so on.
   */
  get stepspan() {
    return this.w + this.h;
  }
  /**
   * The 0-indexed 7-tone pitch class of an Interval. Essentially its size
   * in steps, modulo 7.
   */
  get pc7() {
    return (this.stepspan % 7 + 7) % 7;
  }
  /**
   * The 12-tone pitch class of an Interval familiar to post-tonal theory.
   */
  get pc12() {
    return ((this.w * 2 + this.h) % 12 + 12) % 12;
  }
  /**
   * The standard name for an interval.
   */
  get name() {
    let result = "";
    const stepspan = this.stepspan;
    if (this.stepspan < 0) result += "-";
    const quality = this.quality;
    if (quality > 1) result += "A".repeat(quality - 1);
    if (quality === 1) result += "M";
    if (quality === 0) result += "P";
    if (quality === -1) result += "m";
    if (quality < -1) result += "d".repeat(-quality - 1);
    result += (Math.abs(stepspan) + 1).toString();
    return result;
  }
  /**
   * Returns true if two Interval vectors are identical.
   * Note this will NOT return true for notes that are merely enharmonic in
   * 12TET (use the "isEnharmonic" method for that).
   */
  isEqual(m) {
    return this.w === m.w && this.h === m.h;
  }
  /**
   * Returns true if two Intervals are enharmonic in the specified EDO tuning.
   * If no tuning is specified, defaults to 12TET.
   * If you don't know what this means just leave the second argument blank.
   */
  isEnharmonic(m, edo = 12) {
    return (this.chroma % edo + edo) % edo === (m.chroma % edo + edo) % edo;
  }
  /**
   * The flipped version of an interval.
   * An ascending major 3rd will become a descending major 3rd.
   * Or for vertical intervals, voices will exchange places.
   */
  get negative() {
    return new _Interval(-this.w, -this.h);
  }
  /*
   * Adds an Interval to the current vector.
   * Returns a new Interval vector without modifying the original.
   * */
  add(m) {
    return new _Interval(this.w + m.w, this.h + m.h);
  }
  /*
   * Subtracts an Interval from the current vector.
   * Returns a new Interval vector without modifying the original.
   * */
  subtract(m) {
    return new _Interval(this.w - m.w, this.h - m.h);
  }
  /**
   * The simple (i.e. non-compound / smaller than an octave) version of
   * an Interval vector. For simple intervals this will simply be the
   * same vector.
   */
  get simple() {
    const octave = Math.trunc((this.w + this.h) / 7);
    return new _Interval(this.w - octave * 5, this.h - octave * 2);
  }
};
_Interval.range = {
  *diatonic(from = new _Interval(0, 0), to = new _Interval(5, 2)) {
    const octave = new _Interval(5, 2);
    let current = new _Interval(from.w, from.h);
    let middle = current.add(octave);
    const offset = current.quality < 0 ? -1 : 0;
    let floor = current.h + offset;
    const end = to;
    while (end.subtract(middle).stepspan > 0) {
      while (current.w <= middle.w) {
        current.h = floor;
        while (current.h <= middle.h + 1) {
          if (current.isDiatonic) yield new _Interval(current.w, current.h);
          current.h++;
        }
        current.w++;
      }
      middle = middle.add(octave);
      floor = current.h + offset;
    }
    while (current.w <= middle.w) {
      current.h = floor;
      while (current.h <= middle.h + 1) {
        if (end.subtract(current).stepspan < 0) current.h++;
        if (current.w === end.w && current.h > end.h) return;
        if (current.isDiatonic) yield new _Interval(current.w, current.h);
        current.h++;
      }
      current.w++;
    }
  },
  *melodic() {
    let m = new _Interval(0, 0);
    while (m.w <= 5) {
      while (m.h <= 2) {
        if (Math.abs(m.chroma) < 6 && m.stepspan !== 6) yield new _Interval(m.w, m.h);
        m.h++;
      }
      m.h = 0;
      m.w++;
    }
  }
};
var Interval = _Interval;

// src/map.ts
var MapVec = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Converts a MapVec into a Pitch vector.
   * Returns a new vector. Does not modify the MapVec.
   */
  toPitch() {
    return new Pitch(this.x, this.y);
  }
  /**
   * Converts a MapVec into an Interval vector.
   * Returns a new vector. Does not modify the MapVec.
   */
  toInterval() {
    return new Interval(this.x, this.y);
  }
};
var Map1D = class _Map1D {
  constructor(m0, m1) {
    this.m0 = m0;
    this.m1 = m1;
  }
  /**
   * Multiplies the matrix with the passed in vector.
   * Returns a number.
   */
  map(v) {
    if (v instanceof MapVec) return this.m0 * v.x + this.m1 * v.y;
    return this.m0 * v.w + this.m1 * v.h;
  }
  compose(map) {
    return new _Map1D(
      this.m0 * map.m00 + this.m1 * map.m10,
      this.m0 * map.m01 + this.m1 * map.m11
    );
  }
};
var Map2D = class _Map2D {
  constructor(m00, m01, m10, m11) {
    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
  }
  /**
   * Multiplies the matrix with the passed in vector.
   * Returns a MapVec.
   */
  map(v) {
    if (v instanceof MapVec)
      return new MapVec(
        this.m00 * v.x + this.m01 * v.y,
        this.m10 * v.x + this.m11 * v.y
      );
    return new MapVec(
      this.m00 * v.w + this.m01 * v.h,
      this.m10 * v.w + this.m11 * v.h
    );
  }
  compose(map) {
    return new _Map2D(
      this.m00 * map.m00 + this.m01 * map.m10,
      this.m00 * map.m01 + this.m01 * map.m11,
      this.m10 * map.m00 + this.m11 * map.m10,
      this.m10 * map.m01 + this.m11 * map.m11
    );
  }
};
var TuningMap = class _TuningMap {
  constructor(fifth, referencePitch = "C4", referenceFreq = 261.6255653, midiMap) {
    this.referencePitch = SPN.toPitch(referencePitch);
    this.referenceFreq = referenceFreq;
    this.centMap = new Map1D(fifth, 1200);
    if (midiMap !== void 0) {
      this.midiMap = midiMap;
    }
  }
  /**
   * Initialises an EDO tuning map by specifying the number of parts to
   * divide the octave into rather than the width of the fifth in cents.
   */
  static fromEDO(edo, referencePitch = "C4", referenceFreq = 261.6255653) {
    const fifthSteps = Math.round(Math.log2(1.5) * edo);
    const fifth = fifthSteps * 1200 / edo;
    const whole = (fifthSteps * 2 % edo + edo) % edo;
    const half = (fifthSteps * -5 % edo + edo) % edo;
    const midiMap = new Map1D(whole, half);
    return new _TuningMap(fifth, referencePitch, referenceFreq, midiMap);
  }
  /**
   * Renders the width of an Interval in cents.
   */
  toCents(m) {
    return this.centMap.map(GENERATORS_TO.map(m));
  }
  /**
   * Renders the ratio of an Interval vector as a decimal number.
   */
  toRatio(m) {
    return 2 ** (this.toCents(m) / 1200);
  }
  /**
   * Renders the frequency of a Pitch vector in Hertz.
   */
  toHz(p) {
    return this.referenceFreq * this.toRatio(this.referencePitch.intervalTo(p));
  }
  toMidi(p) {
    if (this.midiMap === void 0)
      throw new Error("Pitch.toMidi can only be called from an EDO TuningMap.");
    return this.midiMap.map(p);
  }
};

// src/constants.ts
var MODES = {
  LYDIAN: 0,
  IONIAN: 1,
  MIXOLYDIAN: 2,
  DORIAN: 3,
  AEOLIAN: 4,
  PHRYGIAN: 5,
  LOCRIAN: 6,
  MAJOR: 1,
  MINOR: 4
};
var LETTER_COORDS = [
  { w: 0, h: 0 },
  // C
  { w: 1, h: 0 },
  // D
  { w: 2, h: 0 },
  // E
  { w: 2, h: 1 },
  // F
  { w: 3, h: 1 },
  // G
  { w: 4, h: 1 },
  // A
  { w: 5, h: 1 }
  // B
];
var EDO7 = new Map1D(1, 1);
var EDO12 = new Map1D(2, 1);
var EDO17 = new Map1D(3, 1);
var EDO19 = new Map1D(3, 2);
var EDO22 = new Map1D(4, 1);
var EDO31 = new Map1D(5, 3);
var EDO50 = new Map1D(8, 5);
var EDO53 = new Map1D(9, 4);
var EDO55 = new Map1D(9, 5);
var EDO81 = new Map1D(13, 8);
var WICKI_TO = new Map2D(1, -3, 0, 1);
var WICKI_FROM = new Map2D(1, 3, 0, 1);
var GENERATORS_TO = new Map2D(2, -5, -1, 3);
var GENERATORS_FROM = new Map2D(3, 5, 1, 2);

// src/chroma.ts
var Chroma = class {
  /**
   * Returns the letter component of the pitch class name represented
   * by a given Pitch chroma.
   */
  static toLetter(chroma) {
    return "CDEFGAB"[(chroma * 4 % 7 + 7) % 7];
  }
  /**
   * Returns the accidental component of the pitch class name represented
   * by a given Pitch chroma.
   * - 0 is natural.
   * - +1 / -1 is sharp/flat.
   * - +2 / -2 is double sharp/double flat.
   * etc. for arbitrarily remote accidentals.
   */
  static toAccidental(chroma) {
    return Math.floor((chroma + 1) / 7);
  }
};

// src/parse/lily.ts
var LilyPond = class {
  /**
   * Create a Pitch vector from a LilyPond note name
   */
  static toPitch(str) {
    const regex = /^([a-g])((?:is|es)*)((?:'|,)*)$/;
    const match = str.match(regex);
    if (!match) {
      throw new Error(`Invalid LilyPond note name: ${str}`);
    }
    const [, letter, accidentalStr, octaveStr] = match;
    let accidental = accidentalStr.split("s").reduce((a, c) => {
      if (c === "i") return a + 1;
      if (c === "e") return a - 1;
      return a;
    }, 0);
    const octave = 4 + octaveStr.split("").reduce((a, c) => {
      if (c === "'") return a + 1;
      if (c === ",") return a - 1;
      return a;
    }, 0);
    let { w, h } = LETTER_COORDS["cdefgab".indexOf(letter)];
    w += accidental;
    h -= accidental;
    w += 5 * octave;
    h += 2 * octave;
    return new Pitch(w, h);
  }
  /**
   * Returns the (absolute) LilyPond name of a Pitch.
   */
  static fromPitch(p) {
    let result = p.letter.toLowerCase();
    const accidental = p.accidental;
    if (accidental > 0) result += "is".repeat(accidental);
    if (accidental < 0) result += "es".repeat(-accidental);
    const octave = p.octave - 3;
    if (octave > 0) result += "'".repeat(octave);
    if (octave < 0) result += ",".repeat(-octave);
    return result;
  }
};

// src/parse/helmholtz.ts
var Helmholtz = class {
  /**
   * Create a Pitch vector from a Helmholtz note name.
   */
  static toPitch(str) {
    const regex = /^([A-Ga-g])([#bxw]+)?((?:'|,)*)$/;
    const match = str.match(regex);
    if (!match) {
      throw new Error(`Invalid Helmholtz string: ${str}`);
    }
    const [, letter, accidentalStr = "", octaveStr] = match;
    let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];
    let accidental = 0;
    const accidentalArray = accidentalStr.split("");
    accidental += accidentalArray.filter((x) => x === "#").length;
    accidental += 2 * accidentalArray.filter((x) => x === "x").length;
    accidental -= accidentalArray.filter((x) => x === "b").length;
    accidental -= 2 * accidentalArray.filter((x) => x === "w").length;
    w += accidental;
    h -= accidental;
    let octave = 0;
    if (letter.match(/[A-G]/))
      octave = 3 - octaveStr.split("").filter((x) => x === ",").length;
    if (letter.match(/[a-g]/))
      octave = 4 + octaveStr.split("").filter((x) => x === "'").length;
    w += 5 * octave;
    h += 2 * octave;
    return new Pitch(w, h);
  }
  /**
   * Returns the Helmholtz note name of a Pitch.
   */
  static fromPitch(p) {
    let result;
    const accNumber = p.accidental;
    let accidental = "";
    if (accNumber == 2) accidental += "x";
    else if (accNumber > 0) accidental += "#".repeat(accNumber);
    if (accNumber < 0) accidental += "b".repeat(-accNumber);
    let octave = p.octave;
    if (octave > 2)
      result = p.letter.toLowerCase() + accidental + "'".repeat(octave - 3);
    else result = p.letter + accidental + ",".repeat(2 - octave);
    return result;
  }
};

// src/parse/abc.ts
var ABC = class {
  /**
   * Create a Pitch vector from an ABC note name.
   */
  static toPitch(str) {
    const regex = /^([_=^]+)?([A-Ga-g])((?:'|,)*)$/;
    const match = str.match(regex);
    if (!match) {
      throw new Error(`Invalid Helmholtz string: ${str}`);
    }
    const [, accidentalStr = "", letter, octaveStr] = match;
    let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];
    let accidental = 0;
    const accidentalArray = accidentalStr.split("");
    accidental += accidentalArray.filter((x) => x === "^").length;
    accidental -= accidentalArray.filter((x) => x === "_").length;
    w += accidental;
    h -= accidental;
    let octave = 0;
    if (letter.match(/[A-G]/))
      octave = 5 - octaveStr.split("").filter((x) => x === ",").length;
    if (letter.match(/[a-g]/))
      octave = 6 + octaveStr.split("").filter((x) => x === "'").length;
    w += 5 * octave;
    h += 2 * octave;
    return new Pitch(w, h);
  }
  /**
   * Returns the ABC note name of a Pitch vector.
   */
  static fromPitch(p) {
    let result;
    const accNumber = p.accidental;
    let accidental = "";
    if (accNumber > 0) accidental += "^".repeat(accNumber);
    if (accNumber < 0) accidental += "_".repeat(-accNumber);
    let octave = p.octave;
    if (octave > 4)
      result = accidental + p.letter.toLowerCase() + "'".repeat(octave - 5);
    else result = accidental + p.letter.toUpperCase() + ",".repeat(4 - octave);
    return result;
  }
};

// src/tonality.ts
var _TonalContext = class _TonalContext {
  constructor(chroma, mode) {
    this.tonic = {
      letter: Chroma.toLetter(chroma),
      accidental: Chroma.toAccidental(chroma),
      chroma
    };
    this.mode = mode;
    this.chromaOffset = mode - chroma;
  }
  /**
   * Create a TonalContext using two strings for the tonic note name
   * and the mode.
   * - e.g. TonalContext.fromStrings("C#", "Dorian")
   */
  static fromStrings(tonic, mode) {
    const regex = /^([A-Ga-g])([#bxw]+)?$/;
    const match = tonic.match(regex);
    if (!match) {
      throw new Error(`Invalid tonic string: ${tonic}`);
    }
    const modeNumber = MODES[mode.toUpperCase()];
    if (modeNumber === void 0) {
      throw new Error(`Invalid mode string: ${mode}`);
    }
    const [, letter, accidentalStr = ""] = match;
    let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];
    for (const char of accidentalStr) {
      w += _TonalContext.ACCIDENTAL_MAP[char] ?? 0;
      h -= _TonalContext.ACCIDENTAL_MAP[char] ?? 0;
    }
    const chroma = 2 * w - 5 * h;
    return new _TonalContext(chroma, modeNumber);
  }
  /**
   * Returns the scale degree (0-indexed) of the passed in Pitch vector in
   * the current context.
   */
  degreeNumber(p) {
    return ((p.w + p.h - "CDEFGAB".indexOf(this.tonic.letter)) % 7 + 7) % 7;
  }
  /**
   * Returns the scale degree alteration represented by a Pitch in the
   * current TonalContext, e.g. C# is a raised note in the key of C major.
   * 0 represents a diatonic Pitch.
   * +1 / -1 represent a Pitch raised/lowered with accidentals.
   * +2 / -2 represent Pitches too remote to belong in a given TonalContext.
   */
  degreeAlteration(p) {
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
  degreeChroma(degree) {
    return (degree * 2 + this.mode) % 7 - this.chromaOffset;
  }
  /**
   * Snaps a Pitch vector to the diatonic position for that letter-name in
   * the current TonalContext.
   * - e.g. in D major, F4 would "snap" to F#4.
   */
  snapDiatonic(p) {
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
  nearestMiBelow(p) {
    const chroma = p.chroma;
    const hardMi = 6 - this.chromaOffset;
    const naturalMi = hardMi - 1;
    const distanceToHardMi = ((chroma - hardMi) * 3 % 7 - 7) % 7;
    const distanceToNaturalMi = ((chroma - naturalMi) * 3 % 7 - 7) % 7;
    let nearestMi = Math.max(distanceToHardMi, distanceToNaturalMi);
    return p.transposeDiatonic(nearestMi, this);
  }
  nextMiAbove(p) {
    const chroma = p.chroma;
    const hardMi = 6 - this.chromaOffset;
    const naturalMi = hardMi - 1;
    const distanceToHardMi = ((chroma - hardMi) * 3 % 7 + 7) % 7;
    const distanceToNaturalMi = ((chroma - naturalMi) * 3 % 7 + 7) % 7;
    let nextMi = Math.max(distanceToHardMi, distanceToNaturalMi);
    return p.transposeDiatonic(nextMi, this);
  }
};
_TonalContext.ACCIDENTAL_MAP = {
  "#": 1,
  x: 2,
  b: -1,
  w: -2
};
var TonalContext = _TonalContext;
export {
  ABC,
  Chroma,
  EDO12,
  EDO17,
  EDO19,
  EDO22,
  EDO31,
  EDO50,
  EDO53,
  EDO55,
  EDO7,
  EDO81,
  GENERATORS_FROM,
  GENERATORS_TO,
  Helmholtz,
  Interval,
  LETTER_COORDS,
  LilyPond,
  MODES,
  Map1D,
  Map2D,
  MapVec,
  MirrorAxis,
  Pitch,
  SPN,
  TonalContext,
  TuningMap,
  WICKI_FROM,
  WICKI_TO
};
