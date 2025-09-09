// src/pitch.ts
var Pitch = class _Pitch {
  // half steps from C-1
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  /**
   * Create a Pitch vector from a Scientific Pitch Notation string.
   */
  static fromSPN(spn) {
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
    return new _Pitch(w, h);
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
   * The octave number of a note (in SPN numbering).
   */
  get octave() {
    return Math.floor((this.w + this.h) / 7 - 1);
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
   * An Axis is created from two Pitches, either directly or via
   * Axis.fromSPN() using two SPN strings.
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
};
var Axis = class _Axis {
  constructor(p, q) {
    this.w = p.w + q.w;
    this.h = p.h + q.h;
  }
  /**
   * Create an Axis from two SPN strings specifying notes.
   * e.g. Axis.fromSPN("C4", "G4");
   */
  static fromSPN(ps, qs) {
    return new _Axis(Pitch.fromSPN(ps), Pitch.fromSPN(qs));
  }
};

// src/interval.ts
var Interval = class _Interval {
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
    accidentalStr.split("").forEach((x) => {
      switch (x) {
        case "A":
        case "a":
        case "#":
          qualityAdjustment++;
          break;
        case "m":
        case "b":
          qualityAdjustment--;
          break;
        case "D":
        case "d":
          if (simple === 0 || simple === 3 || simple === 4) qualityAdjustment--;
          else qualityAdjustment -= 2;
          break;
      }
    });
    w += qualityAdjustment;
    h -= qualityAdjustment;
    return new _Interval(sign * w, sign * h);
  }
  /**
   * Create an Interval from two pitch names as SPN strings.
   * - e.g. Pitch.fromSPN("C4", "E4"); // produces a major 3rd.
   */
  static fromSPN(ps, qs) {
    return _Interval.between(Pitch.fromSPN(ps), Pitch.fromSPN(qs));
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
  /**
   * The quality of an Interval as a signed number:
   * - 0 is perfect.
   * - +1 / -1 are major and minor respectively.
   * - +2 / -2 are augmented and diminished respectively.
   * etc. for arbitrarily remote Interval qualities.
   */
  get quality() {
    if (Math.abs(this.chroma) <= 1) return 0;
    if (this.chroma > 0 && this.chroma <= 5)
      return Math.floor((this.chroma + 5) / 7);
    if (this.chroma < 0 && this.chroma >= -5)
      return Math.ceil((this.chroma - 5) / 7);
    if (this.chroma > 5) return Math.floor((this.chroma + 8) / 7);
    return Math.ceil((this.chroma - 8) / 7);
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

// src/map.ts
var MapVec = class {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }
  /**
   * Converts a MapVec into a Pitch vector.
   * Returns a new vector. Does not modify the MapVec.
   */
  toPitch() {
    return new Pitch(this.w, this.h);
  }
  /**
   * Converts a MapVec into an Interval vector.
   * Returns a new vector. Does not modify the MapVec.
   */
  toInterval() {
    return new Interval(this.w, this.h);
  }
};
var Map1d = class {
  constructor(m0, m1) {
    this.m0 = m0;
    this.m1 = m1;
  }
  /**
   * Multiplies the matrix with the passed in vector.
   * Returns a number.
   */
  map(v) {
    return this.m0 * v.w + this.m1 * v.h;
  }
};
var Map2d = class {
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
    return new MapVec(
      this.m00 * v.w + this.m01 * v.h,
      this.m10 * v.w + this.m11 * v.h
    );
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
var ET7 = new Map1d(1, 1);
var ET12 = new Map1d(2, 1);
var ET19 = new Map1d(3, 2);
var ET31 = new Map1d(5, 3);
var ET50 = new Map1d(8, 5);
var ET55 = new Map1d(9, 5);
var WICKI_TO = new Map2d(1, -3, 0, 1);
var WICKI_FROM = new Map2d(1, 3, 0, 1);
var GENERATORS_TO = new Map2d(2, -5, -1, 3);
var GENERATORS_FROM = new Map2d(3, 5, 1, 2);

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
};
_TonalContext.ACCIDENTAL_MAP = {
  "#": 1,
  x: 2,
  b: -1,
  w: -2
};
var TonalContext = _TonalContext;
export {
  Axis,
  Chroma,
  ET12,
  ET19,
  ET31,
  ET50,
  ET55,
  ET7,
  GENERATORS_FROM,
  GENERATORS_TO,
  Interval,
  LETTER_COORDS,
  MODES,
  Map1d,
  Map2d,
  MapVec,
  Pitch,
  TonalContext,
  WICKI_FROM,
  WICKI_TO
};
